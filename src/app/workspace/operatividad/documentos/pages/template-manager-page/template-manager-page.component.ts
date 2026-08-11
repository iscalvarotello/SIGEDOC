import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InternalTemplatesService, InternalTemplateDTO } from '../../../../database/templates/internal-templates.service';
import { SesionService } from '@services/sesion.service';

import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { PageBreadcrumbComponent } from '@system-shared/common/page-breadcrumb/page-breadcrumb.component';
import { ClaseDocumentPipe } from '../../pipes/claseDocument.pipe';

import { TemplateTagsPanelComponent } from '../../components/template-tags-panel/template-tags-panel.component';

@Component({
  selector: 'app-template-manager-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ActionButtonComponent, 
    IconComponent, 
    PageBreadcrumbComponent, 
    ClaseDocumentPipe,
    TemplateTagsPanelComponent
  ],
  templateUrl: './template-manager-page.component.html'
})
export class TemplateManagerPageComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private templatesService = inject(InternalTemplatesService);
  private session = inject(SesionService);

  @ViewChild('editorTextarea') editorTextarea!: ElementRef<HTMLTextAreaElement>;

  claseDocumentoId = signal<any>('memo');
  isLoading = signal<boolean>(false);
  templates = signal<InternalTemplateDTO[]>([]);

  // Editor state
  editingTemplate = signal<InternalTemplateDTO | null>(null);
  formName = signal<string>('');
  formContent = signal<string>('');
  
  isEditorDirty = signal<boolean>(false);

  ngOnInit() {
    this._route.params.subscribe(params => {
      const clase = params['claseDocumentoId'];
      if (clase) {
        this.claseDocumentoId.set(clase);
        this.loadTemplates();
      }
    });
  }

  async loadTemplates() {
    this.isLoading.set(true);
    try {
      const areaId = this.session.activeAdscription()?.id_area;
      const res = await this.templatesService.getAll({ 
        area_id: areaId, 
        tipo_documento: this.claseDocumentoId() 
      }) as any;
      this.templates.set(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  createNew() {
    if (this.isEditorDirty() && !confirm('¿Descartar cambios sin guardar?')) {
      return;
    }
    this.editingTemplate.set(null);
    this.formName.set('');
    this.formContent.set('');
    this.isEditorDirty.set(false);
  }

  editTemplate(tpl: InternalTemplateDTO) {
    if (this.isEditorDirty() && !confirm('¿Descartar cambios sin guardar?')) {
      return;
    }
    this.editingTemplate.set(tpl);
    this.formName.set(tpl.name);
    this.formContent.set(tpl.content || '');
    this.isEditorDirty.set(false);
  }

  onFormChange() {
    this.isEditorDirty.set(true);
  }

  insertTag(tag: string) {
    const el = this.editorTextarea?.nativeElement;
    if (!el) {
      this.formContent.update(c => c + ' ' + tag);
      this.onFormChange();
      return;
    }
    
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const content = this.formContent();
    
    const newContent = content.substring(0, start) + tag + content.substring(end);
    this.formContent.set(newContent);
    this.onFormChange();
    
    // Devolvemos el foco al editor y posicionamos el cursor después del tag
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  }

  async saveTemplate() {
    if (!this.formName().trim() || !this.formContent().trim()) return;
    
    this.isLoading.set(true);
    const areaId = this.session.activeAdscription()?.id_area;
    if (!areaId) {
      console.error("No area ID found in session");
      this.isLoading.set(false);
      return;
    }

    const payload: InternalTemplateDTO = {
      name: this.formName(),
      content: this.formContent(),
      area_id: areaId,
      document_class: this.claseDocumentoId(),
      active: true
    };

    try {
      let saved: InternalTemplateDTO;
      if (this.editingTemplate()?.id) {
        saved = await this.templatesService.update(this.editingTemplate()!.id!, payload) as any;
      } else {
        saved = await this.templatesService.create(payload) as any;
      }
      this.isEditorDirty.set(false);
      await this.loadTemplates(); 
      // Seleccionar el que acabamos de guardar
      const found = this.templates().find(t => t.id === saved.id || t.name === saved.name);
      if (found) {
        this.editTemplate(found);
      }
    } catch (e) {
      console.error(e);
      alert('Error al guardar la plantilla');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteTemplate(id: string) {
    if (confirm('¿Estás seguro de eliminar esta plantilla permanentemente?')) {
      try {
        this.isLoading.set(true);
        await this.templatesService.delete(id) as any;
        
        if (this.editingTemplate()?.id === id) {
          this.createNew();
        }
        await this.loadTemplates();
      } catch (e) {
        console.error(e);
        alert('Error al eliminar la plantilla');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  goBack() {
    this._router.navigate(['/operatividad/documento', this.claseDocumentoId()]);
  }
}
