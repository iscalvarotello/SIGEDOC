import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasePageController } from '@baseclass/base-page.controller';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';

import { SupplierDTO } from './supplier.dto';
import { SupplierService } from './supplier.service';
import { AttachmentService } from '@core/services/attachment.service';
import { SUPPLIER_PAGE_CONFIG } from './supplier-page.config';

import { AttachmentListComponent, AttachmentItem } from '@system-shared/media/attachment-list/attachment-list.component';
import { ContactCardComponent, ContactInfo } from '@workspace-shared/components/common/contact-card/contact-card.component';
import { SupplierAttachmentFormComponent, SupplierAttachmentPayload } from './components/supplier-attachment-form/supplier-attachment-form.component';
import { SupplierContactFormComponent, SupplierContactPayload } from './components/supplier-contact-form/supplier-contact-form.component';

@Component({
  selector: 'app-suppliers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent, AttachmentListComponent, ContactCardComponent, SupplierAttachmentFormComponent, SupplierContactFormComponent],
  templateUrl: './suppliers-page.component.html'
})
export class SuppliersPageComponent extends BasePageController<SupplierDTO> {
  protected apiService = inject(SupplierService);
  private attachmentService = inject(AttachmentService);
  public pageConfig = SUPPLIER_PAGE_CONFIG;

  // Form signal states
  isAttachmentModalOpen = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  // Contact Modal states
  isContactModalOpen = signal<boolean>(false);
  editingContactIndex = signal<number | null>(null);
  currentContactPayload = signal<ContactInfo | null>(null);

  openAttachmentModal() {
    this.isAttachmentModalOpen.set(true);
  }

  closeAttachmentModal() {
    this.isAttachmentModalOpen.set(false);
  }

  openContactModal(index: number | null = null, contact: ContactInfo | null = null) {
    this.editingContactIndex.set(index);
    this.currentContactPayload.set(contact);
    this.isContactModalOpen.set(true);
  }

  closeContactModal() {
    this.isContactModalOpen.set(false);
    this.editingContactIndex.set(null);
    this.currentContactPayload.set(null);
  }

  async saveContact(payload: SupplierContactPayload) {
    const supplier = this.selectedItem();
    if (!supplier) return;

    this.isSaving.set(true);
    try {
      const updatedContacts = [...(supplier.contacts || [])];
      
      // Ensure we map ContactInfo to ContactDTO
      const newContact = {
        name: payload.contact.name,
        job: payload.contact.job || '',
        email: payload.contact.email || '',
        phone: payload.contact.phone || ''
      };
      
      if (payload.index !== null && payload.index >= 0) {
        // Edit existing
        updatedContacts[payload.index] = newContact;
      } else {
        // Add new
        updatedContacts.push(newContact);
      }

      await this.apiService.update(supplier.id, { contacts: updatedContacts });
      
      // Actualizar el item seleccionado localmente para reflejar los cambios en la UI
      this.selectedItem.set({
        ...supplier,
        contacts: updatedContacts
      } as any);

      await this.refresh();
      this.closeContactModal();
    } catch (error) {
      console.error('Error al guardar contacto', error);
      alert('Error al guardar el contacto.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteContact(index: number) {
    const supplier = this.selectedItem();
    if (!supplier || !supplier.contacts) return;

    const result = confirm('¿Estás seguro de que deseas eliminar este contacto?');
    if (!result) return;

    this.isSaving.set(true);
    try {
      const updatedContacts = [...supplier.contacts];
      updatedContacts.splice(index, 1);

      await this.apiService.update(supplier.id, { contacts: updatedContacts });
      
      // Actualizar el item seleccionado localmente para reflejar los cambios en la UI
      this.selectedItem.set({
        ...supplier,
        contacts: updatedContacts
      } as any);

      await this.refresh();
    } catch (error) {
      console.error('Error al eliminar contacto', error);
      alert('No se pudo eliminar el contacto.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async onSaveAttachment(payload: SupplierAttachmentPayload) {
    const currentSupplier = this.selectedItem();
    if (!currentSupplier) return;

    this.isUploading.set(true);
    try {
      // 1. Upload physically
      const uploadRes = await this.attachmentService.upload(payload.file);
      
      this.isUploading.set(false);
      this.isSaving.set(true);

      // 2. Build the new attachment details
      const newAttachment = {
        id_attachment: uploadRes.id_attachment,
        attachment_name: payload.title || 'Anexo',
        attachment_title: payload.name || uploadRes.originalname,
        extension: uploadRes.extension,
        year: payload.year || undefined,
        versionable: payload.versionable
      };

      // 3. Update attachments relationship list
      const updatedList = [...(currentSupplier.attachments || []), newAttachment];
      const updatedSupplier = await this.apiService.updateAttachments(currentSupplier.id, updatedList);

      // 4. Update UI states locally immediately
      this.rawData.update(list => list.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
      this.selectedItem.set(updatedSupplier);

      // 5. Close modal
      this.closeAttachmentModal();
    } catch (err) {
      console.error('Error saving attachment', err);
      // Aqui podrías mostrar un toast de error
    } finally {
      this.isUploading.set(false);
      this.isSaving.set(false);
    }
  }

  async handleRemove(attachmentId: string) {
    const currentSupplier = this.selectedItem();
    if (!currentSupplier) return;

    try {
      // 1. Deassociate from db first to prevent DB foreign key constraint errors
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

  async handleReorder(newList: AttachmentItem[]) {
    const item = this.selectedItem();
    if (!item) return;

    try {
      const payload = newList.map((a, i) => ({
        id_attachment: a.id_attachment,
        attachment_name: a.attachment_name,
        attachment_title: a.attachment_title,
        year: a.year || undefined,
        versionable: !!a.versionable,
        orden: i
      }));

      const updatedSupplier = await this.apiService.updateAttachments(item.id, payload);
      this.selectedItem.set(updatedSupplier);
      this.rawData.update(list => list.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
    } catch (error) {
      console.error(error);
      alert('Error al reordenar los anexos');
    }
  }
}
