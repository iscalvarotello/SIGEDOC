import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-widget',
  template: `
    <div
      class="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]"
    >
      <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
        Soporte {{ appSettings.SYSTEM_NAME }}
      </h3>
      <p class="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        ¿Tienes dudas o problemas con el sistema? Consulta los manuales.
      </p>
      <a
        href="#"
        class="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-[#7A0026] text-theme-sm hover:bg-[#5c001c]"
      >
        Ver Manuales
      </a>
    </div>
  `
})
export class SidebarWidgetComponent {
  appSettings = APP_SETTINGS;
}
