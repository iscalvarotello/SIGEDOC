import { Component, OnInit, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExternalContactService } from '../../../../database/organization/external-contacts/external-contact.service';
import { ExternalContactDTO } from '../../../../database/organization/external-contacts/external-contact.dto';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';

@Component({
  selector: 'app-external-contact-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ListboxComponent],
  template: `
    <app-listbox
      [options]="contactOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled()"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="loadContacts(true)"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="selectedId()">
      
    </app-listbox>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class ExternalContactSelectComponent implements OnInit {
  selectedId = input<string>('');
  placeholder = input<string>('Seleccione Contacto Externo...');
  disabled = input<boolean>(false);
  showReload = input<boolean>(true);

  onSelect = output<ExternalContactDTO | null>();

  private service = inject(ExternalContactService);
  rawContacts = signal<ExternalContactDTO[]>([]);
  isLoading = signal<boolean>(false);

  contactOptions = computed(() => {
    return this.rawContacts().map(item => {
      const desc = [item.nombre, item.puesto ? `(${item.puesto})` : '', item.empresa_dependencia ? `- ${item.empresa_dependencia}` : ''].filter(Boolean).join(' ');
      return {
        value: item.id,
        label: desc,
        raw: item,
        iconKey: 'AvatarPremium'
      };
    });
  });

  ngOnInit() {
    this.loadContacts();
  }

  async loadContacts(forceRefresh = false) {
    this.isLoading.set(true);
    try {
      const response = await this.service.getAll(
        undefined, 
        { enabled: true, key: 'EXTERNAL_CONTACTS_COMBO', ttlMinutes: 10 }, 
        forceRefresh
      );
      this.rawContacts.set(response.data || []);
    } catch (error) {
      console.error('Error al cargar catálogo en ExternalContactSelect:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleSelectionChange(opt: any) {
    if (opt) {
      this.onSelect.emit(opt.raw);
    } else {
      this.onSelect.emit(null);
    }
  }
}
