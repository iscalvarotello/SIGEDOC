import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { JobPositionDTO } from './job-position.dto';

@Injectable({
  providedIn: 'root'
})
export class JobPositionService extends BaseApiService<JobPositionDTO> {
  constructor() {
    super(ENDPOINT_KEYS.JOB_POSITIONS, JobPositionDTO);
  }
}
