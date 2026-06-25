import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CountryService } from './blocks/CORE_DB/location/countries/country.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular Ecommerce Dashboard | TailAdmin';

  private countryService = inject(CountryService);

  // Método 2: Obtenemos el Signal directamente desde el servicio
  countriesSignal = this.countryService.getSignalAll();

  constructor() {
    console.log('🚀 Iniciando petición vía Signals...');
    
    // effect() observa los Signals y se ejecuta automáticamente cada vez que su valor cambia
    effect(() => {
      const response = this.countriesSignal();
      
      if (response) {
        console.log('✅ Países obtenidos vía Signals:', response.data);
        if (response.meta) {
          console.log('📄 Meta info (Signals):', response.meta);
        }
      } else {
        console.log('⏳ El Signal está cargando datos...');
      }
    });
  }
}
