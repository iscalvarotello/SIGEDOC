import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasePageController } from '../../../../shared/classes/base-page.controller';
import { MasterWrapperComponent } from '../../../../shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '../../../../shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '../../../../shared/components/master-detail/detail-viewer.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { SupplierDTO } from './supplier.dto';
import { SupplierService } from './supplier.service';
import { AttachmentService } from '../../../../core/services/attachment.service';
import { SUPPLIER_PAGE_CONFIG } from './supplier-page.config';

@Component({
  selector: 'app-suppliers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent, ModalComponent],
  template: `
    <app-master-wrapper 
      title="Directorio de Proveedores" 
      icon="🤝" 
      [layoutSpan]="{ master: 7, detail: 5 }"
      [searchTerm]="searchTerm()"
      searchPlaceholder="Buscar por nombre, RFC..."
      (onSearch)="filtrar($event)"
      (onRefresh)="refresh()"
      (onSync)="sync()"
      (onNew)="nuevo()">
      
      <div master class="h-full">
        <app-data-table 
          [data]="filteredItems()" 
          [columns]="pageConfig.tableColumns"
          [selectedItem]="selectedItem()"
          [isLoading]="isLoading()"
          (onRowSelect)="select($event)"
          (onEdit)="edit($event)"
          (onDelete)="delete($event)">
        </app-data-table>
      </div>

      <div detail class="h-full flex flex-col">
        <app-detail-viewer 
          [data]="selectedItem()"
          [headerConfig]="pageConfig.detailHeader"
          [fields]="pageConfig.detailFields">
          
          <!-- Extra content in detail viewer for contacts -->
          @if (selectedItem()?.contacts?.length) {
            <div class="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Contactos</h4>
              <div class="space-y-3">
                @for (contact of selectedItem()?.contacts; track contact.email || $index) {
                  <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                    <p class="font-medium text-sm text-gray-900 dark:text-white">{{ contact.name }}</p>
                    <p class="text-xs text-gray-500">{{ contact.job }}</p>
                    <div class="mt-2 text-xs flex flex-col gap-1 text-gray-600 dark:text-gray-400">
                      @if (contact.email) { <span class="flex items-center gap-1">✉️ {{ contact.email }}</span> }
                      @if (contact.phone) { <span class="flex items-center gap-1">📞 {{ contact.phone }}</span> }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Attachments (Anexos) section -->
          <div class="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-lg">📂</span> Anexos y Documentación
              </h4>
              @if (canUpdate()) {
                <button 
                  (click)="openAttachmentModal()"
                  class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#691C32] to-[#8A253F] hover:from-[#8A253F] hover:to-[#A12B4A] rounded-lg shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer">
                  ➕ Agregar
                </button>
              }
            </div>

            @if (selectedItem()?.attachments?.length) {
              <div class="grid grid-cols-1 gap-3">
                @for (att of selectedItem()?.attachments; track att.id_attachment) {
                  <div class="group relative flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#691C32]/30 dark:hover:border-[#BC955C]/30 hover:shadow-md transition-all duration-300">
                    <div class="flex items-center gap-3">
                      <!-- PDF Icon container -->
                      <div class="flex items-center justify-center w-10 h-10 bg-red-50 dark:bg-red-950/20 rounded-xl text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform duration-300">
                        📄
                      </div>
                      
                      <!-- Metadata -->
                      <div class="flex flex-col">
                        <span class="font-bold text-xs text-gray-800 dark:text-gray-200 leading-tight group-hover:text-[#691C32] dark:group-hover:text-[#BC955C] transition-colors duration-200">
                          {{ att.attachment_name }}
                        </span>
                        <span class="text-[10px] text-gray-400 mt-0.5 truncate max-w-[200px]" [title]="att.attachment_title">
                          {{ att.attachment_title }}
                        </span>
                        <div class="flex items-center gap-2 mt-1">
                          @if (att.year) {
                            <span class="px-1.5 py-0.5 text-[9px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">
                              Año: {{ att.year }}
                            </span>
                          }
                          @if (att.versionable) {
                            <span class="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded">
                              🔄 Versionable
                            </span>
                          }
                        </div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <a [href]="getDownloadUrl(att.id_attachment)" 
                         target="_blank"
                         class="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
                         title="Ver PDF">
                        👁️
                      </a>
                      @if (canDelete()) {
                        <button 
                                (click)="deleteSupplierAttachment(att.id_attachment)"
                                class="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Eliminar Anexo">
                          🗑️
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p class="text-xs text-gray-400 dark:text-xs text-gray-500">No hay anexos asociados a este proveedor.</p>
              </div>
            }
          </div>
          
        </app-detail-viewer>
      </div>

    </app-master-wrapper>

    <!-- Modal de subida de anexos -->
    <app-modal [isOpen]="isAttachmentModalOpen()" (close)="closeAttachmentModal()" className="max-w-[480px] w-full m-4">
      <div class="relative w-full p-6 bg-white dark:bg-gray-900 rounded-3xl lg:p-8 flex flex-col gap-5 shadow-2xl">
        <!-- Header -->
        <div>
          <h4 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span>📤</span> Subir Nuevo Anexo
          </h4>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Carga un documento PDF (máximo 10MB) y asócialo a este proveedor.
          </p>
        </div>

        <!-- Form fields -->
        <div class="flex flex-col gap-4">
          <!-- Title -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre corto / Nombre económico</label>
            <input 
              type="text" 
              [(ngModel)]="newAttTitle"
              placeholder="Ej. Acta Constitutiva, Opinión de Cumplimiento" 
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-xs rounded-xl focus:border-[#691C32] dark:focus:border-[#BC955C] focus:ring-1 focus:ring-[#691C32] dark:focus:ring-[#BC955C] outline-none transition-colors dark:text-white" />
          </div>

          <!-- Name -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Título Oficial / Descripción Formal</label>
            <input 
              type="text" 
              [(ngModel)]="newAttName"
              placeholder="Ej. Acta de Asamblea, Opinión en sentido positivo" 
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-xs rounded-xl focus:border-[#691C32] dark:focus:border-[#BC955C] focus:ring-1 focus:ring-[#691C32] dark:focus:ring-[#BC955C] outline-none transition-colors dark:text-white" />
          </div>

          <!-- Year & Versionable -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Año (Opcional)</label>
              <input 
                type="number" 
                [(ngModel)]="newAttYear"
                placeholder="Ej. 2026" 
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-xs rounded-xl focus:border-[#691C32] dark:focus:border-[#BC955C] focus:ring-1 focus:ring-[#691C32] dark:focus:ring-[#BC955C] outline-none transition-colors dark:text-white" />
            </div>

            <div class="flex flex-col justify-end">
              <label class="relative flex items-center gap-2 cursor-pointer py-2">
                <input 
                  type="checkbox" 
                  [(ngModel)]="newAttVersionable"
                  class="sr-only peer" />
                <div class="w-10 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#691C32] dark:peer-checked:bg-[#BC955C]"></div>
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Versionable</span>
              </label>
            </div>
          </div>

          <!-- File Upload Dropzone -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Archivo PDF</label>
            
            <label 
              class="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#691C32]/40 dark:hover:border-[#BC955C]/40 rounded-2xl p-6 text-center cursor-pointer transition-colors duration-300 bg-gray-50/50 dark:bg-gray-950/20 hover:bg-gray-50 dark:hover:bg-gray-950/40">
              
              <input 
                type="file" 
                accept=".pdf" 
                class="hidden" 
                (change)="onFileSelected($event)" />

              <div class="text-3xl mb-2">📄</div>
              
              @if (selectedFile()) {
                <div class="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate max-w-xs">
                  {{ selectedFile()?.name }}
                </div>
                <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  {{ (selectedFile()?.size || 0) / 1024 / 1024 | number:'1.0-2' }} MB
                </div>
              } @else {
                <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Haz clic para seleccionar un archivo PDF
                </div>
                <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  Solo PDF. Máximo 10MB.
                </div>
              }
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            (click)="closeAttachmentModal()"
            class="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all cursor-pointer">
            Cancelar
          </button>
          <button 
            [disabled]="!selectedFile() || isUploading() || isSaving()"
            (click)="saveAttachment()"
            class="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#691C32] dark:bg-[#BC955C] hover:bg-[#8A253F] dark:hover:bg-[#A88048] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer">
            @if (isUploading() || isSaving()) {
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Subiendo...
            } @else {
              Guardar Anexo
            }
          </button>
        </div>
      </div>
    </app-modal>
  `
})
export class SuppliersPageComponent extends BasePageController<SupplierDTO> {
  protected apiService = inject(SupplierService);
  private attachmentService = inject(AttachmentService);
  public pageConfig = SUPPLIER_PAGE_CONFIG;

  // Form signal states
  isAttachmentModalOpen = signal<boolean>(false);
  newAttTitle = signal<string>('');
  newAttName = signal<string>('');
  newAttYear = signal<number | null>(null);
  newAttVersionable = signal<boolean>(false);
  selectedFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  openAttachmentModal() {
    this.newAttTitle.set('');
    this.newAttName.set('');
    this.newAttYear.set(null);
    this.newAttVersionable.set(false);
    this.selectedFile.set(null);
    this.isAttachmentModalOpen.set(true);
  }

  closeAttachmentModal() {
    this.isAttachmentModalOpen.set(false);
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Solo se aceptan archivos PDF');
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo supera el límite de 10MB');
      event.target.value = '';
      return;
    }

    this.selectedFile.set(file);
    if (!this.newAttName()) {
      this.newAttName.set(file.name);
    }

    // Clear the input value so selecting the same file again triggers change event
    event.target.value = '';
  }

  async saveAttachment() {
    const file = this.selectedFile();
    const currentSupplier = this.selectedItem();
    if (!file || !currentSupplier) return;

    this.isUploading.set(true);
    try {
      // 1. Upload physically
      const uploadRes = await this.attachmentService.upload(file);
      
      this.isUploading.set(false);
      this.isSaving.set(true);

      // 2. Build the new attachment details
      const newAttachment = {
        id_attachment: uploadRes.id_attachment,
        attachment_name: this.newAttTitle() || 'Anexo',
        attachment_title: this.newAttName() || uploadRes.originalname,
        year: this.newAttYear() || undefined,
        versionable: this.newAttVersionable()
      };

      // 3. Update attachments relationship list
      const updatedList = [...(currentSupplier.attachments || []), newAttachment];
      const updatedSupplier = await this.apiService.updateAttachments(currentSupplier.id, updatedList);

      // 4. Update UI states locally immediately
      this.rawData.update(list => list.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
      this.selectedItem.set(updatedSupplier);

      // 5. Close modal
      this.closeAttachmentModal();
    } catch (error: any) {
      console.error('Error al guardar el anexo:', error);
      alert('Ocurrió un error al guardar el anexo:\n' + (error?.error?.message || error?.message || 'Error desconocido'));
    } finally {
      this.isUploading.set(false);
      this.isSaving.set(false);
    }
  }

  async deleteSupplierAttachment(attachmentId: string) {
    const currentSupplier = this.selectedItem();
    if (!currentSupplier) return;

    if (!confirm('⚠️ ¿Estás seguro de eliminar este anexo? Se eliminará físicamente del servidor.')) {
      return;
    }

    try {
      // 1. Deassociate from db first to prevent DB foreign key constraint errors (as Backend protects referenced attachments)
      const updatedList = (currentSupplier.attachments || []).filter(a => a.id_attachment !== attachmentId);
      const updatedSupplier = await this.apiService.updateAttachments(currentSupplier.id, updatedList);

      // Update UI states locally immediately
      this.rawData.update(list => list.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
      this.selectedItem.set(updatedSupplier);

      // 2. Safely delete physical file on the backend storage
      await this.attachmentService.deleteAttachment(attachmentId);
    } catch (error: any) {
      console.error('Error al eliminar anexo:', error);
      alert('Ocurrió un error al eliminar el anexo:\n' + (error?.error?.message || error?.message || 'Error desconocido'));
    }
  }

  getDownloadUrl(id: string): string {
    return this.attachmentService.getDownloadUrl(id);
  }
}
