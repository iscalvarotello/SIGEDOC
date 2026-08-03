import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconPipe } from '@system-pipe/svg-icon.pipe';
import { IconComponent } from '@system-shared/common/icon/icon.component';

export interface ContactInfo {
  name: string;
  job?: string;
  email?: string;
  phone?: string;
}

@Component({
  selector: 'app-contact-card',
  standalone: true,
  imports: [CommonModule, SvgIconPipe, IconComponent],
  templateUrl: './contact-card.component.html',
  host: {
    class: 'block w-full h-full'
  }
})
export class ContactCardComponent {
  @Input({ required: true }) contact!: ContactInfo;
}
