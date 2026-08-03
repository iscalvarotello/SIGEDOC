import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';
import { SVG_ICONS } from '../../icons/svg-icons';

@Component({
  selector: 'app-contacts-array',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContactsArrayComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-4">
      <div class="flex justify-between items-center mb-2">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Contactos del Proveedor</h4>
        <button type="button" (click)="addContact()" class="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[#691C32] dark:text-[#BC955C] font-medium rounded transition-colors flex items-center gap-1">
          + Añadir Contacto
        </button>
      </div>

      @if (contacts.length === 0) {
        <div class="p-4 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500">
          No hay contactos registrados.
        </div>
      }

      <div class="space-y-3">
        @for (contact of contacts; track $index) {
          <div class="p-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col md:flex-row gap-4 items-start md:items-center">
            
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              <input type="text" [(ngModel)]="contact.name" (ngModelChange)="onChange(contacts)" placeholder="Nombre Completo" class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#691C32] focus:border-[#691C32] transition-all">
              
              <input type="text" [(ngModel)]="contact.job" (ngModelChange)="onChange(contacts)" placeholder="Puesto" class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#691C32] focus:border-[#691C32] transition-all">
              
              <input type="email" [(ngModel)]="contact.email" (ngModelChange)="onChange(contacts)" placeholder="Correo Electrónico" class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#691C32] focus:border-[#691C32] transition-all">
              
              <input type="text" [(ngModel)]="contact.phone" (ngModelChange)="onChange(contacts)" placeholder="Teléfono" class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#691C32] focus:border-[#691C32] transition-all">
            </div>

            <button type="button" (click)="removeContact($index)" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors" title="Eliminar Contacto">
              <span class="text-lg flex items-center justify-center" [innerHTML]="iconDelete | safeHtml"></span>
            </button>
            
          </div>
        }
      </div>
    </div>
  `
})
export class ContactsArrayComponent implements ControlValueAccessor {
  contacts: any[] = [];
  iconDelete = SVG_ICONS.Basurero;

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any[]): void {
    this.contacts = Array.isArray(value) ? value : [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  addContact() {
    this.contacts.push({ name: '', job: '', email: '', phone: '' });
    this.onChange(this.contacts);
    this.onTouch();
  }

  removeContact(index: number) {
    this.contacts.splice(index, 1);
    this.onChange(this.contacts);
    this.onTouch();
  }
}
