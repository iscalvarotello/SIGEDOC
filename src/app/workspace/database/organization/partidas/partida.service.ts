import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { PartidaDTO } from './partida.dto';

@Injectable({
  providedIn: 'root'
})
export class PartidaService extends BaseApiService<PartidaDTO> {
  constructor() {
    super(ENDPOINT_KEYS.PARTIDAS, PartidaDTO);
  }
}
