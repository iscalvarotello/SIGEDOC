import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobeComponent } from '@system-shared/ui/globe/globe.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { GeneralBubbleComponent } from '@system-shared/ui/general-bubble/general-bubble.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { DataTableComponent, TableColumn } from '@system-shared/ui/data-table/data-table.component';
import { GeneralesService } from '../../generales.service';
import { AjusteMinutariosModalComponent } from './ajuste-minutarios-modal.component';

@Component({
  selector: 'generales-minutarios-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, GlobeComponent, ActionButtonComponent, GeneralBubbleComponent, TitleComponent, DataTableComponent, AjusteMinutariosModalComponent],
  templateUrl: './generales-minutarios-tab.component.html'
})
export class GeneralesMinutariosTabComponent implements OnInit {
  private fb = inject(FormBuilder);
  private generalesService = inject(GeneralesService);

  globalMinutarios = signal<any[]>([]);
  areasMinutarios = signal<any[]>([]);
  selectedYear = signal<number>(new Date().getFullYear());
  showGestDocs = signal<boolean>(false);
  isLoadingMinutarios = signal<boolean>(false);
  isLoadingAreas = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  availableYears = computed(() => {
    const years = this.globalMinutarios().map(m => m.year);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  });

  isAjusteModalOpen = signal<boolean>(false);
  ajusteForm!: FormGroup;
  isAdjusting = signal<boolean>(false);

  constructor() {
    this.ajusteForm = this.fb.group({
      anio: [2026, Validators.required],
      scope: ['specific', Validators.required],
      areaId: [''],
      tipo: ['oficio', Validators.required],
      nuevo_valor: [0, [Validators.required, Validators.min(0)]],
      admin_password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }
  get areaTableColumns(): TableColumn[] {
    if (!this.showGestDocs()) {
      return [
        { title: 'Área (Siglas)' },
        { title: 'Memorándums' },
        { title: 'Oficios' },
        { title: 'TI (Tec. Inf.)' },
        { title: 'Circulares' }
      ];
    } else {
      return [
        { title: 'Área (Siglas)' },
        { title: 'Memos Gest.', class: 'text-theme-primary dark:text-theme-primary/80' },
        { title: 'Oficios Gest.', class: 'text-theme-primary dark:text-theme-primary/80' },
        { title: 'TI Gest.', class: 'text-theme-primary dark:text-theme-primary/80' },
        { title: 'Circulares Gest.', class: 'text-theme-primary dark:text-theme-primary/80' }
      ];
    }
  }


  ngOnInit() {
    this.loadMinutariosData();
  }

  async loadMinutariosData() {
    this.isLoadingMinutarios.set(true);
    try {
      const data = await this.generalesService.getGlobalMinutarios();
      this.globalMinutarios.set(data || []);
      
      const years = (data || []).map((m: any) => m.year);
      if (years.length > 0) {
        if (!years.includes(this.selectedYear())) {
          const maxYear = Math.max(...years);
          this.selectedYear.set(maxYear);
        }
      }
      await this.loadAreasMinutarios(this.selectedYear());
    } catch (e) {
      console.error('Error al cargar minutarios globales:', e);
    } finally {
      this.isLoadingMinutarios.set(false);
    }
  }

  async loadAreasMinutarios(year: number) {
    this.isLoadingAreas.set(true);
    try {
      const data = await this.generalesService.getAreasMinutarios(year);
      this.areasMinutarios.set(data || []);
    } catch (e) {
      console.error(`Error al cargar minutarios de áreas del año ${year}:`, e);
      this.areasMinutarios.set([]);
    } finally {
      this.isLoadingAreas.set(false);
    }
  }

  async onYearSelectedChange(year: any) {
    const y = Number(year);
    this.selectedYear.set(y);
    await this.loadAreasMinutarios(y);
  }

  async openNewFiscalYear() {
    const years = this.globalMinutarios().map(m => m.year);
    const nextYear = years.length > 0 ? Math.max(...years) + 1 : new Date().getFullYear();

    if (confirm(`📅 ¿Estás seguro de que deseas inicializar el Año Fiscal ${nextYear}?\nEsto ejecutará el proceso de cambio de ciclo en el servidor.`)) {
      this.isSaving.set(true);
      try {
        await this.generalesService.prepareNewYear(nextYear);
        alert(`✅ ¡Año Fiscal ${nextYear} inicializado con éxito!`);
        await this.loadMinutariosData();
        this.selectedYear.set(nextYear);
        await this.loadAreasMinutarios(nextYear);
      } catch (e: any) {
        console.error('Error al crear año nuevo fiscal:', e);
        alert('No se pudo crear el año fiscal:\n' + (e?.error?.message || e?.message || 'Error de conexión'));
      } finally {
        this.isSaving.set(false);
      }
    }
  }

  openAjusteModal() {
    const defaultTipo = this.showGestDocs() ? 'oficio_gest' : 'oficio';
    this.ajusteForm.patchValue({ 
      admin_password: '',
      tipo: defaultTipo
    });
    this.isAjusteModalOpen.set(true);
  }

  closeAjusteModal() {
    this.isAjusteModalOpen.set(false);
  }

  async executeContadorAdjustment() {
    if (this.ajusteForm.invalid) return;
    const val = this.ajusteForm.value;

    if (val.scope === 'specific' && !val.areaId) {
      alert('Debe seleccionar un área para el ajuste específico.');
      return;
    }

    this.isAdjusting.set(true);
    try {
      await this.generalesService.adjustMinutario({
        year: Number(val.anio),
        type: val.tipo,
        newValue: Number(val.nuevo_valor),
        scope: val.scope,
        areaId: val.scope === 'specific' ? val.areaId : undefined
      });
      
      await this.loadMinutariosData();

      this.closeAjusteModal();
      alert(`✅ Folio de ${val.tipo.toUpperCase()} ajustado correctamente en la base de datos.`);
    } catch (err: any) {
      console.error('Error al ajustar minutario:', err);
      alert(
        err?.error?.message || 
        err?.message || 
        'Ocurrió un error al intentar ajustar el minutario en la base de datos.'
      );
    } finally {
      this.isAdjusting.set(false);
    }
  }
}
