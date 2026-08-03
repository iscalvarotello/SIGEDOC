import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { CronSettingDTO } from './cron.dto';

export interface AvailableTask {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CronService extends BaseApiService<CronSettingDTO> {
  constructor() {
    super(ENDPOINT_KEYS.CRON_JOBS, CronSettingDTO);
  }

  public async getAvailableTasks(): Promise<AvailableTask[]> {
    const res = await this.executeSpecialRoute<any>('availableTasks');
    // Si la respuesta viene envuelta en { availableTasks: [...] } o es directo el array
    if (res && res.data && res.data.availableTasks) {
       return res.data.availableTasks;
    } else if (res && res.availableTasks) {
       return res.availableTasks;
    }
    return res && res.data !== undefined ? res.data : (res || []);
  }
}
