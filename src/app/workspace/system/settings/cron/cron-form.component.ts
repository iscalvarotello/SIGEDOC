import { Component, OnInit, inject, signal } from '@angular/core';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CronService, AvailableTask } from './cron.service';
import { CronSettingDTO, CronScheduleConfig } from './cron.dto';

import { AreaSelectComponent } from '@workspace-shared/components/selects/area-select/area-select.component';
import { EmployeeSelectComponent } from '@workspace-shared/components/selects/employee-select/employee-select.component';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { CancelButtonComponent } from '@system-shared/buttons/cancel-button/cancel-button.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-cron-form',
  standalone: true,
  imports: [CommonModule, FormsModule, AreaSelectComponent, ListboxComponent, CancelButtonComponent, ActionButtonComponent, IconComponent],
  templateUrl: './cron-form.component.html'
})
export class CronFormComponent implements OnInit {
  private apiService = inject(CronService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public isEditMode = signal(false);
  public isLoading = signal(false);
  public isSaving = signal(false);
  public availableTasks = signal<any[]>([]);

  public formData = signal<CronSettingDTO>(new CronSettingDTO({
    name: '',
    task_code: '',
    dependencia: null,
    is_active: true,
    timezone: 'America/Mexico_City',
    schedule_config: {
      type: 'WEEKLY',
      daily: { time: '12:00' },
      weekly: {
        monday: { enabled: true, time: '12:00' },
        tuesday: { enabled: true, time: '12:00' },
        wednesday: { enabled: true, time: '12:00' },
        thursday: { enabled: true, time: '12:00' },
        friday: { enabled: true, time: '12:00' },
        saturday: { enabled: false, time: '12:00' },
        sunday: { enabled: false, time: '12:00' }
      },
      monthly: { day: 1, time: '12:00' },
      yearly: { month: 1, day: 1, time: '12:00' }
    }
  }));

  public daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  public monthsOfYear = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  async ngOnInit() {
    this.loadAvailableTasks();
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      await this.loadData(id);
    }
  }

  async loadAvailableTasks() {
    try {
      const tasks = await this.apiService.getAvailableTasks();
      // Map tasks to listbox options
      const mapped = tasks.map((t: any) => ({
        value: t.code,
        label: `${t.name} (${t.code})`
      }));
      this.availableTasks.set(mapped);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  async loadData(id: string) {
    this.isLoading.set(true);
    try {
      const data = await this.apiService.getById(id);
      
      // Merge with default to ensure objects exist if missing in DB
      const defaults = this.formData().schedule_config;
      const dbConfig = data.schedule_config || {} as any;
      
      data.schedule_config = {
        type: dbConfig.type || 'WEEKLY',
        daily: { ...defaults.daily, ...dbConfig.daily } as any,
        weekly: { ...defaults.weekly, ...dbConfig.weekly } as any,
        monthly: { ...defaults.monthly, ...dbConfig.monthly } as any,
        yearly: { ...defaults.yearly, ...dbConfig.yearly } as any
      };
      
      this.formData.set(new CronSettingDTO(data));
    } catch (error) {
      console.error('Error loading cron job:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async save() {
    this.isSaving.set(true);
    try {
      const formPayload = this.formData();
      const payload = formPayload.toPayload();

      if (this.isEditMode()) {
        await this.apiService.update(formPayload.id, payload);
      } else {
        await this.apiService.create(payload);
      }
      this.router.navigate(['/system/settings/cron']);
    } catch (error) {
      console.error('Save error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/system/settings/cron']);
  }

  get schedule() {
    return this.formData().schedule_config;
  }
}
