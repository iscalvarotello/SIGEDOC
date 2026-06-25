import { Injectable      } from '@angular/core';
import { BaseApiService  } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS   } from '@app/core/api/api-routes.config';
import { CountryDTO      } from './country.dto';


@Injectable({ providedIn: 'root' })
export class CountryService extends BaseApiService<CountryDTO> {
  constructor() {
    super(ENDPOINT_KEYS.COUNTRIES, CountryDTO);
  }
}