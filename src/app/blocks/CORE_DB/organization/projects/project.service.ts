import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/api/base-api.service';
import { ENDPOINT_KEYS } from '../../../../core/api/api-routes.config';
import { ProjectDTO } from './project.dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseApiService<ProjectDTO> {
  constructor() {
    super(ENDPOINT_KEYS.PROJECTS, ProjectDTO);
  }
}
