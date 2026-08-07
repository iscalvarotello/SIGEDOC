import { Component, Input, Output, EventEmitter, inject, signal, effect, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternalTemplatesService, InternalTemplateDTO } from '../../../database/templates/internal-templates.service';
import { SesionService } from '@services/sesion.service';
import { ActionButtonComponent } from '@metasystem/components/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'template-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionButtonComponent, IconComponent],
  templateUrl: './template-manager.component.html'
})
export class TemplateManagerComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() claseDocumentoId: string = ''; // Recibe 'memo', 'oficio', etc.
  @Output() close = new EventEmitter<void>();
  @Output() useTemplate = new EventEmitter<InternalTemplateDTO>();

  private templatesService = inject(InternalTemplatesService);
  private session = inject(SesionService);

  // States
  isLoading = signal<boolean>(false);
  templates = signal<InternalTemplateDTO[]>([]);
  
  // Editor state
  editingTemplate = signal<InternalTemplateDTO | null>(null);
  
  // Create / Edit Form
  formName = signal<string>('');
  formContent = signal<string>('');
  
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.loadTemplates();
      } else {
        this.editingTemplate.set(null);
      }
    }
  }

  async loadTemplates() {
    this.isLoading.set(true);
    try {
      const areaId = this.session.activeAdscription()?.id_area;
      console.log('TemplateManager loading for area:', areaId, 'clase:', this.claseDocumentoId);
      const res = await this.templatesService.getAll({ 
        area_id: areaId, 
        tipo_documento: this.claseDocumentoId 
      });
      console.log('TemplateManager getAll res:', res);
      this.templates.set(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  openEditor(tpl?: InternalTemplateDTO) {
    if (tpl) {
      this.editingTemplate.set(tpl);
      this.formName.set(tpl.name);
      this.formContent.set(tpl.content || '');
    } else {
      this.editingTemplate.set(null);
      this.formName.set('');
      this.formContent.set('');
    }
  }

  closeEditor() {
    this.editingTemplate.set(null);
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
      document_class: this.claseDocumentoId,
      active: true
    };

    try {
      if (this.editingTemplate()) {
        await this.templatesService.update(this.editingTemplate()!.id!, payload);
      } else {
        await this.templatesService.create(payload);
      }
      this.closeEditor();
      await this.loadTemplates(); // Reload to get fresh data
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteTemplate(id: string) {
    if (confirm('¿Estás seguro de eliminar esta plantilla?')) {
      try {
        this.isLoading.set(true);
        await this.templatesService.delete(id);
        await this.loadTemplates(); // Reload to get fresh data
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  selectTemplate(tpl: InternalTemplateDTO) {
    this.useTemplate.emit(tpl);
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
