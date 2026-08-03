import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { SectionCardComponent } from '@system-shared/ui/section-card/section-card.component';
import { BadgeComponent } from '@system-shared/ui/badge/badge.component';

@Component({
  selector: 'doc-ccp-list',
  standalone: true,
  imports: [ActionButtonComponent, CommonModule, SectionCardComponent, BadgeComponent],
  templateUrl: './doc-ccp-list.component.html',
})
export class DocCcpListComponent {
  @Input() doc: any | null = null;

  copiedCcpText = signal<string | null>(null);

  getExistingCcpText(ccp: any): string {
    const prefix = ccp.employee_prefix || '';
    const name = `${ccp.employee_name || ''} ${ccp.employee_first_surname || ''} ${ccp.employee_second_surname || ''}`.trim();
    const job = ccp.job_name || '';
    const area = ccp.area_acronym || ccp.area_name || '';

    const prefixStr = prefix ? `${prefix.trim()} ` : '';
    const jobStr = job ? ` - ${job.trim()}` : '';
    const areaStr = area ? ` - ${area.trim()}` : '';

    return `C.c.p. ${prefixStr}${name}${jobStr}${areaStr}`;
  }

  copyCcpToClipboard(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copiedCcpText.set(text);
      setTimeout(() => {
        if (this.copiedCcpText() === text) {
          this.copiedCcpText.set(null);
        }
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
    });
  }
}
