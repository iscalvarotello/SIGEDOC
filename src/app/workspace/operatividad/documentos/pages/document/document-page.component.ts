import { Component, OnInit, inject, signal, computed, effect, ViewChild } from '@angular/core';
import { IconComponent } from '@system-shared/common/icon/icon.component';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { SesionService } from '@services/sesion.service';
import { ClaseDocumentoId } from '../../interfaces/document.interface';
import { PageBreadcrumbComponent } from '@system-shared/common/page-breadcrumb/page-breadcrumb.component';
import { ClaseDocumentPipe } from '../../pipes/claseDocument.pipe';
import { DocTypeSelectorComponent } from '../../components/doc-type-selector/doc-type-selector.component';
import { DocBandejasTabsComponent } from '../../components/doc-bandeja-tabs/doc-bandeja-tabs.component';
import { DocSearchFilterComponent } from '../../components/doc-search-filter/doc-search-filter.component';
import { DocListComponent } from '../../components/doc-list/doc-list.component';
import { DocDetailComponent } from '../../components/doc-detail/doc-detail.component';
import { GovSignatureService } from '@core/services/gov-signature.service';
import { firstValueFrom } from 'rxjs';
import { copyToClipboard } from '@core/utils/clipboard.util';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

function getLocalDateString(dateVal: any): string {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Component({
  selector    : 'app-document',
  standalone  : true,
  imports: [
                   ActionButtonComponent,
                   PageBreadcrumbComponent, CommonModule, ClaseDocumentPipe, DocTypeSelectorComponent,
                   DocBandejasTabsComponent, DocSearchFilterComponent, DocListComponent, DocDetailComponent
                , IconComponent],
  templateUrl : './document-page.component.html',
})
export class DocumentPageComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  protected _session = inject(SesionService);
  private _documentService = inject(DocumentService);
  private _govSignature = inject(GovSignatureService);

  @ViewChild(DocDetailComponent) docDetail!: DocDetailComponent;

  // Clase de documento tomada de los parámetros de ruta (memo, oficio, ti, circular)
  claseDocumentoId = signal<ClaseDocumentoId>('memo');

  // Estados del Inbox
  isLoading = signal<boolean>(false);
  inboxResponse = signal<any | null>(null); // { bandejas: string[], data: any[], owner: any }
  selectedBandeja = signal<string | null>(null);
  selectedDocId = signal<string | null>(null);
  selectedBulkDocIds = signal<string[]>([]);
  isGeneratingBulkLink = signal<boolean>(false);

  bulkSelectionEnabled = computed(() => {
    const b = this.selectedBandeja();
    return b ? b.toLowerCase().includes('despachar') : false;
  });

  // Filtros
  selectedTipo = signal<'directo' | 'gestionado' | 'recibido_externo'>('directo');
  searchQuery = signal<string>('');
  startDateInput = signal<string>('');
  endDateInput = signal<string>('');
  appliedStartDate = signal<string>('');
  appliedEndDate = signal<string>('');
  selectedYear = signal<number>(new Date().getFullYear());

  activeAreaName = computed<string>(() => {
    const ads = this._session.activeAdscription();
    return ads ? ads.nombre_area : '';
  });

  constructor() {
    // Recargar el inbox si cambia la clase o la adscripción activa
    effect(() => {
      const ads = this._session.activeAdscription();
      const currentYear = this.selectedYear(); // Track year
      if (ads && ads.id_area) {
        this.loadInbox();
      }
    }, { allowSignalWrites: true });

    // Cuando cambie la clase, el tipo de documento o los documentos, ajustar la bandeja seleccionada
    effect(() => {
      if (this.inboxResponse() === null) {
        return;
      }

      const bandejas = this.bandejasWithCounts();
      const current = this.selectedBandeja();
      if (bandejas.length > 0) {
        const hasCurrent = bandejas.some(b => b.name === current);
        if (!current || !hasCurrent) {
          this.selectedBandeja.set(bandejas[0].name);
        }
      } else {
        this.selectedBandeja.set(null);
      }
    }, { allowSignalWrites: true });

    // Sincronizar filtros de bandeja/tipo y el documento seleccionado con la URL (query parameters)
    effect(() => {
      const tipo = this.selectedTipo();
      const bandeja = this.selectedBandeja();
      const selectedId = this.selectedDocId();
      
      const currentQueryParams = this._route.snapshot.queryParams;
      if (
        currentQueryParams['tipo'] !== tipo || 
        currentQueryParams['bandeja'] !== bandeja || 
        currentQueryParams['selectedId'] !== selectedId
      ) {
        this._router.navigate([], {
          relativeTo: this._route,
          queryParams: { tipo, bandeja, selectedId },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  ngOnInit() {
    // Escuchar parámetros de ruta para la clase de documento
    this._route.params.subscribe(params => {
      const clase = params['claseDocumentoId'] as ClaseDocumentoId;
      if (clase) {
        this.claseDocumentoId.set(clase);
        this.selectedDocId.set(null); // Resetear selección al cambiar de tipo
        this.closeActionForm();
      }
    });

    // Escuchar query params reactivamente (filtros, bandeja y selección)
    this._route.queryParams.subscribe(params => {
      this.selectedTipo.set(params['tipo'] || 'directo');
      this.selectedBandeja.set(params['bandeja'] || null);
      this.selectedDocId.set(params['selectedId'] || null);
    });
  }

  async loadInbox() {
    const areaId = this._session.activeAdscription()?.id_area;
    if (!areaId) {
      this.inboxResponse.set(null);
      return;
    }

    this.isLoading.set(true);
    try {
      const res = await this._documentService.getInbox(areaId, undefined, this.selectedYear());
      this.inboxResponse.set(res);
    } catch (error) {
      console.error('Error al cargar la bandeja de documentos:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  allDocuments = computed<any[]>(() => {
    const rawDocs = this.inboxResponse()?.data || [];
    const a = this._session.activeAdscription()?.id_area;
    const currentEmployeeId = this._session.currentUserData()?.id_empleado;
    if (!a) return rawDocs;

    return rawDocs.map((d: any) => {
      let effectiveType = d.tipo_documento;

      const isEmisora = String(d.id_area_emisora) === String(a);
      const isRemitente = String(d.id_area_remitente) === String(a);
      const isReceptora = String(d.id_area_receptora) === String(a);
      const isTurnedToMe = currentEmployeeId && d.id_turnado_a && String(d.id_turnado_a) === String(currentEmployeeId);

      if (isTurnedToMe) {
        // Para internos, si me lo turnan, lo veo como directo. Para externos, se queda como externo.
        if (effectiveType !== 'recibido_externo') {
          effectiveType = 'directo';
        }
      } else if (isRemitente) {
        if (effectiveType !== 'recibido_externo') effectiveType = 'directo';
      } else if (isEmisora && String(d.id_area_emisora) !== String(d.id_area_remitente)) {
        if (effectiveType !== 'recibido_externo') effectiveType = 'gestionado';
      } else if (!isEmisora && isReceptora && d.tipo_documento === 'gestionado') {
        if (effectiveType !== 'recibido_externo') effectiveType = 'directo';
      }

      return {
        ...d,
        tipo_documento: effectiveType
      };
    });
  });

  countDirecto = computed<number>(() => 
    this.allDocuments().filter((d: any) => 
      d.clase_documento === this.claseDocumentoId() && 
      d.tipo_documento === 'directo'
    ).length
  );

  countGestionado = computed<number>(() => 
    this.allDocuments().filter((d: any) => 
      d.clase_documento === this.claseDocumentoId() && 
      d.tipo_documento === 'gestionado'
    ).length
  );

  countExterno = computed<number>(() => 
    this.allDocuments().filter((d: any) => 
      d.clase_documento === this.claseDocumentoId() && 
      d.tipo_documento === 'recibido_externo'
    ).length
  );
  
  documentsByClassAndType = computed<any[]>(() => 
    this.allDocuments().filter((d: any) => 
      d.clase_documento === this.claseDocumentoId() &&
      d.tipo_documento === this.selectedTipo()
    )
  );

  // Calcula las bandejas que tienen al menos un documento
  bandejasWithCounts = computed(() => {
    const counts: Record<string, number> = {};
    
    const docs = this.documentsByClassAndType();
    docs.forEach((d: any) => {
      counts[d.bandeja] = (counts[d.bandeja] || 0) + 1;
    });

    return Object.keys(counts).map(name => ({
      name,
      count: counts[name]
    })).sort((a, b) => a.name.localeCompare(b.name));
  });

  // Aplica los filtros de búsqueda y fechas
  filteredDocuments = computed<any[]>(() => {
    let list = this.documentsByClassAndType();

    const currentBandeja = this.selectedBandeja();
    if (currentBandeja) {
      list = list.filter((d: any) => d.bandeja === currentBandeja);
    }

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter((d: any) => 
        (d.asunto && d.asunto.toLowerCase().includes(query)) ||
        (d.temas && d.temas.toLowerCase().includes(query)) ||
        (d.num_doc && d.num_doc.toLowerCase().includes(query)) ||
        (d.remitente_nombre && d.remitente_nombre.toLowerCase().includes(query)) ||
        (d.destinatario_nombre && d.destinatario_nombre.toLowerCase().includes(query))
      );
    }

    const start = this.appliedStartDate();
    const end = this.appliedEndDate();
    if (start || end) {
      list = list.filter((d: any) => {
        const localDate = getLocalDateString(d.fecha_doc);
        if (!localDate) return false;
        if (start && localDate < start) return false;
        if (end && localDate > end) return false;
        return true;
      });
    }

    return list;
  });

  // Documento seleccionado
  selectedDoc = computed<any>(() => {
    const list = this.filteredDocuments();
    if (list.length === 0) return null;
    const found = list.find((d: any) => d.id === this.selectedDocId());
    return found || list[0];
  });

  selectDocument(docId: string) {
    this.selectedDocId.set(docId);
    this.closeActionForm();
  }

  selectBandeja(bandejaName: string) {
    this.selectedBandeja.set(bandejaName);
    this.selectedDocId.set(null); // Resetear selección al cambiar de bandeja
    this.selectedBulkDocIds.set([]); // Limpiar selección múltiple
    this.closeActionForm();
  }

  toggleBulkSelection(docId: string) {
    const current = this.selectedBulkDocIds();
    if (current.includes(docId)) {
      this.selectedBulkDocIds.set(current.filter(id => id !== docId));
    } else {
      this.selectedBulkDocIds.set([...current, docId]);
    }
  }

  async generateBulkLink() {
    const ids = this.selectedBulkDocIds();
    const userId = this._session.currentUserData()?.id_empleado;
    if (!ids.length || !userId) return;

    this.isGeneratingBulkLink.set(true);
    try {
      const payload = {
        documentIds: ids,
        userId: userId,
        title: `Firma de ${ids.length} Documento(s)`,
        summary: `Lote de ${ids.length} documento(s) listos para su firma digital.`
      };
      const res = await firstValueFrom(this._govSignature.generateBulkSignatureUrl(payload));
      if (res && res.url) {
        const success = await copyToClipboard(res.url);
        if (success) {
          alert('Enlace copiado al portapapeles:\n' + res.url);
        }
        this.selectedBulkDocIds.set([]); // limpiar
      }
    } catch (e) {
      console.error(e);
      alert('Error al generar el enlace de firma.');
    } finally {
      this.isGeneratingBulkLink.set(false);
    }
  }

  applyDateFilter() {
    this.appliedStartDate.set(this.startDateInput());
    this.appliedEndDate.set(this.endDateInput());
    this.selectedDocId.set(null);
    this.closeActionForm();
  }

  clearDateFilter() {
    this.startDateInput.set('');
    this.endDateInput.set('');
    this.appliedStartDate.set('');
    this.appliedEndDate.set('');
    this.selectedDocId.set(null);
    this.closeActionForm();
  }

  closeActionForm() {
    this.docDetail?.closeActionForm();
  }
  openPdf(type: 'draft' | 'final', doc: any) {
    this.docDetail?.openPdf(type, doc);
  }

  navigateToNewDocument() {
    this._router.navigate(['/operatividad/form-new-document', this.claseDocumentoId()]);
  }

  navigateToExternalRecepcion() {
    this._router.navigate(['/operatividad/recepcion-externa'], { queryParams: { clase: this.claseDocumentoId() } });
  }

  navigateToTemplateManager() {
    this._router.navigate(['/operatividad/documento', this.claseDocumentoId(), 'templates']);
  }
}
