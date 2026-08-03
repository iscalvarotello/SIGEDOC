import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocalRouteService } from './local-route.service';

@Pipe({
  name: 'localRoute',
  standalone: true
})
export class LocalRoutePipe implements PipeTransform {
  private routeService = inject(LocalRouteService);

  transform(routeKey: string, params?: Record<string, any>): any[] {
    return this.routeService.getLink(routeKey, params);
  }
}
