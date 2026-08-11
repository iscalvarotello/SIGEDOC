import { Component, Input, Output, EventEmitter, OnInit, signal, inject, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitutionService } from '@organization/institutions/institution.service';
import { InstitutionDTO } from '@organization/institutions/institution.dto';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { SmartImageComponent } from '@system-shared/images/smart-image/smart-image.component';

@Component({
  selector: 'app-virtual-paper-modal',
  standalone: true,
  imports: [CommonModule, IconComponent, ActionButtonComponent, SmartImageComponent],
  templateUrl: './virtual-paper-modal.component.html',
  styleUrls: ['./virtual-paper-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualPaperModalComponent implements OnInit {
  @Input() content: string = '';
  @Input() metadata: any = {};
  @Output() close = new EventEmitter<void>();

  private institutionService = inject(InstitutionService);
  
  institution = signal<InstitutionDTO | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.fetchInstitution();
  }

  async fetchInstitution() {
    this.isLoading.set(true);
    try {
      const resp = await this.institutionService.getAll();
      if (resp && resp.data && resp.data.length > 0) {
        this.institution.set(resp.data[0]);
      }
    } catch (e) {
      console.error('Error loading institution settings for virtual paper', e);
    } finally {
      this.isLoading.set(false);
    }
  }

  printDocument() {
    window.print();
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
