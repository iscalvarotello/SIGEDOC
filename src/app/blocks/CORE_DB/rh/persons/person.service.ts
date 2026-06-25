import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { PersonDTO } from './person.dto';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends BaseApiService<PersonDTO> {
  constructor() {
    super(ENDPOINT_KEYS.PERSONS, PersonDTO);
  }

  async getUnemployed(): Promise<PersonDTO[]> {
    const res = await this.executeSpecialRoute<any>('unemployed');
    const resultData = res && res.data !== undefined ? res.data : res;
    return this.mapData(resultData || []);
  }
}
