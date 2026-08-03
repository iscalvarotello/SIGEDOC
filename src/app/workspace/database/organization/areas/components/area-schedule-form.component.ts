import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimePickerComponent } from '@system-shared/form/time-picker/time-picker.component';
import { AreaDTO } from '../area.dto';
import { CancelButtonComponent } from '@system-shared/buttons/cancel-button/cancel-button.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-area-schedule-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TimePickerComponent, CancelButtonComponent, ActionButtonComponent],
  templateUrl: './area-schedule-form.component.html'
})
export class AreaScheduleFormComponent implements OnInit {
  @Input() area!: AreaDTO;
  @Input() isSaving: boolean = false;
  
  @Output() onSave = new EventEmitter<Record<string, any>>();
  @Output() onCancel = new EventEmitter<void>();

  scheduleData: Record<string, any> = {};
  daysOfWeek = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  ngOnInit() {
    const defaultSchedule: Record<string, any> = {
      lunes:     { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      martes:    { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      miercoles: { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      jueves:    { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      viernes:   { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      sabado:    { recepcion: false, hora_inicio: '09:00', hora_fin: '16:00' },
      domingo:   { recepcion: false, hora_inicio: '09:00', hora_fin: '16:00' }
    };
    
    const receptionSchedule = this.area.reception_schedule || {};
    const schedule: Record<string, any> = {};
    
    for (const day of ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']) {
      const item = receptionSchedule[day] || defaultSchedule[day];
      schedule[day] = {
        recepcion: item.recepcion !== undefined ? item.recepcion : false,
        hora_inicio: item.recepcion ? (item.hora_inicio || '09:00') : '',
        hora_fin: item.recepcion ? (item.hora_fin || '16:00') : ''
      };
    }
    
    this.scheduleData = schedule;
  }

  onScheduleToggle(dayKey: string) {
    if (!this.scheduleData[dayKey].recepcion) {
      this.scheduleData[dayKey].hora_inicio = '';
      this.scheduleData[dayKey].hora_fin = '';
    } else {
      this.scheduleData[dayKey].hora_inicio = '09:00';
      this.scheduleData[dayKey].hora_fin = '16:00';
    }
  }

  save() {
    this.onSave.emit(this.scheduleData);
  }

  cancel() {
    this.onCancel.emit();
  }
}
