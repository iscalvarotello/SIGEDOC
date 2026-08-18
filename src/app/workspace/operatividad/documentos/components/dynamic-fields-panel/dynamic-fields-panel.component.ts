import { Component, OnInit, inject, signal, computed, effect, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '@metasystem/components/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

import { ProjectSelectComponent } from '@workspace-shared/components/selects/project-select/project-select.component';
import { PartidaSelectComponent } from '@workspace-shared/components/selects/partida-select/partida-select.component';
import { SupplierSelectComponent } from '@workspace-shared/components/selects/supplier-select/supplier-select.component';
import { CarSelectComponent } from '@workspace-shared/components/selects/car-select/car-select.component';
import { DatePickerComponent } from '@system-shared/form/date-picker/date-picker.component';
import { SesionService } from '@services/sesion.service';
import { numeroALetras } from '@core/utils/number-to-letters.util';

@Component({
  selector: 'app-dynamic-fields-panel',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ActionButtonComponent, IconComponent,
    ProjectSelectComponent, PartidaSelectComponent, SupplierSelectComponent,
    CarSelectComponent, DatePickerComponent
  ],
  templateUrl: './dynamic-fields-panel.component.html'
})
export class DynamicFieldsPanelComponent implements OnInit {
  private _session = inject(SesionService);

  // Inputs & Outputs
  activeAreaCustomFields = input<string[]>([]);
  personalFieldValues = model<Record<string, string>>({});
  
  onAddCustomField = output<string>();
  dictionaryChange = output<Record<string, string>>();
  injectTag = output<string>();
  
  // Tab
  activeFieldsTab = signal<'proyecto' | 'proveedor' | 'vehiculo' | 'evento' | 'personalizados' | 'general'>('proyecto');

  // Proyecto
  selectedProjectId = signal<string>('');
  selectedProjectObj = signal<any>(null);
  selectedProjectDate = signal<string>(new Date().toISOString().substring(0, 10));
  selectedPartidaId = signal<string>('');
  selectedPartidaObj = signal<any>(null);
  selectedMonth = signal<string>('Enero');

  // Proveedor
  selectedSupplierId = signal<string>('');
  selectedSupplierObj = signal<any>(null);
  customContractNumber = signal<string>('');
  customLicitacionNumber = signal<string>('');
  customSupplierAddress = signal<string>('');

  // Vehiculo
  selectedCarId = signal<string>('');
  selectedCarObj = signal<any>(null);

  // Evento / General
  customEventName = signal<string>('');
  customEventPlace = signal<string>('');
  customInvoice = signal<string>('');
  customEventDate = signal<string>(new Date().toISOString().substring(0, 10));
  customStartDate = signal<string>(new Date().toISOString().substring(0, 10));
  customEndDate = signal<string>(new Date().toISOString().substring(0, 10));
  customEventCost = signal<string>('0.00');
  customMonto = signal<string>('0.00');
  customFecha = signal<string>(new Date().toISOString().substring(0, 10));

  // Personalizados
  newCustomFieldName = signal<string>('');

  // Visibility toggles
  showProjectFields = signal<boolean>(false);
  showProjectDateFields = signal<boolean>(false);
  showPartidaFields = signal<boolean>(false);
  showMonthFields = signal<boolean>(false);
  showSupplierFields = signal<boolean>(false);
  showSupplierAddressFields = signal<boolean>(false);
  showVehicleFields = signal<boolean>(false);
  showEventNameFields = signal<boolean>(false);
  showEventPlaceFields = signal<boolean>(false);
  showInvoiceFields = signal<boolean>(false);
  showEventDateFields = signal<boolean>(false);
  showMontoFields = signal<boolean>(false);
  showFechaFields = signal<boolean>(false);

  bodyDictionary = computed(() => {
    const dict: Record<string, string> = {};
    
    // Proyecto seleccionado
    const proj = this.selectedProjectObj();
    dict['__project_name__'] = proj ? (proj.oficial_name || proj.name) : '';
    dict['__project_code__'] = proj ? proj.code : '';
    dict['__project_type__'] = proj ? proj.type : '';
    dict['__project_cp__'] = proj ? proj.CP : '';
    dict['__project_ca__'] = proj ? proj.CA : '';
    dict['__project_fu__'] = proj ? proj.FU : '';
    dict['__project_sf__'] = proj ? proj.SF : '';
    dict['__project_ai__'] = proj ? proj.AI : '';
    dict['__project_pt__'] = proj ? proj.PT : '';
    dict['__project_oficial_name__'] = proj ? proj.oficial_name : '';

    // Proyecto Fecha
    dict['__project_date_with_day__'] = this.formatProjectDate(this.selectedProjectDate(), 'with_day');
    dict['__project_date_full__'] = this.formatProjectDate(this.selectedProjectDate(), 'full');
    dict['__project_date_compact__'] = this.formatProjectDate(this.selectedProjectDate(), 'compact');
    
    // Partida seleccionada
    const part = this.selectedPartidaObj();
    dict['__partida__'] = part ? (part.full_name || `${part.partida}.- ${part.descripcion}`) : '';
    dict['__partida_clave__'] = part ? part.partida : '';
    dict['__partida_desc__'] = part ? part.descripcion : '';
    
    // Mes de ministración
    dict['__mes_ministracion__'] = this.selectedMonth();
    
    // Proveedor seleccionado
    const sup = this.selectedSupplierObj();
    dict['__provider_name__'] = sup ? (sup.razon_social || sup.name) : '';
    dict['__provider_rfc__'] = sup ? sup.rfc : '';
    dict['__provider_address__'] = this.customSupplierAddress();
    dict['__contract_number__'] = this.customContractNumber();
    dict['__licitacion_number__'] = this.customLicitacionNumber();
    dict['__provider_phone__'] = sup ? (sup.telephone || '') : '';
    dict['__provider_email__'] = sup && sup.contacts && sup.contacts.length > 0 ? sup.contacts[0].email : '';
    dict['__provider_contact__'] = sup && sup.contacts && sup.contacts.length > 0 ? sup.contacts[0].name : '';
    
    // Vehículo seleccionado
    const car = this.selectedCarObj();
    dict['__vehicle_brand__'] = car ? car.marca : '';
    dict['__vehicle_model__'] = car ? car.modelo : '';
    dict['__vehicle_plates__'] = car ? car.placas : '';
    dict['__vehicle_color__'] = car && car.color ? car.color : '';
    dict['__vehicle_vin__'] = car && car.serie ? car.serie : '';

    // Campos libres
    dict['__event_name__'] = this.customEventName();
    dict['__lugar_evento__'] = this.customEventPlace();
    dict['__invoice__'] = this.customInvoice();
    
    // Evento - Fechas
    dict['__event_date__'] = this.customEventDate();
    dict['__event_date_short__'] = this.formatProjectDate(this.customEventDate(), 'compact');
    dict['__event_date_long__'] = this.formatProjectDate(this.customEventDate(), 'full');
    dict['__event_date_with_day__'] = this.formatProjectDate(this.customEventDate(), 'with_day');
    
    // Evento - Costos
    const eventMontoVal = parseFloat(this.customEventCost());
    dict['__event_cost__'] = !isNaN(eventMontoVal) ? this.formatCurrency(this.customEventCost()) : '';
    dict['__event_cost_letra__'] = !isNaN(eventMontoVal) ? this.numeroALetras(eventMontoVal) : '';
    
    // Rango de Fechas
    dict['__range_date__'] = this.formatDateRange(this.customStartDate(), this.customEndDate());
    
    // Fecha general
    dict['__fecha_corta__'] = this.formatProjectDate(this.customFecha(), 'compact');
    dict['__fecha_larga__'] = this.formatProjectDate(this.customFecha(), 'full');
    
    // Mis Datos (Sesión Actual)
    const today = new Date();
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    dict['__current_year__'] = today.getFullYear().toString();
    dict['__current_month__'] = months[today.getMonth()];
    
    const sessionData = this._session.dataUser;
    dict['__user_name__'] = sessionData ? (sessionData.fullName || '') : '';
    dict['__user_position__'] = sessionData ? (sessionData.puesto || '') : '';
    dict['__user_area__'] = sessionData ? (sessionData.nombre_area || '') : '';
    
    // Monto y Letra
    const montoVal = parseFloat(this.customMonto());
    dict['__monto_moneda__'] = !isNaN(montoVal) ? this.formatCurrency(this.customMonto()) : '';
    dict['__monto_letra__'] = !isNaN(montoVal) ? this.numeroALetras(montoVal) : '';
    
    // Campos personalizados
    const personalVals = this.personalFieldValues();
    Object.entries(personalVals).forEach(([fieldName, value]) => {
      const keyName = '__personalizado_' + this.normalizeKeyName(fieldName) + '__';
      dict[keyName] = value;
    });

    return dict;
  });

  constructor() {
    effect(() => {
      const dic = this.bodyDictionary();
      this.dictionaryChange.emit(dic);
    }, { allowSignalWrites: true });
  }

  ngOnInit() {}

  doInjectTag(tag: string) {
    this.injectTag.emit(tag);
  }

  doReplaceTagsInBody() {
    this.injectTag.emit('__REPLACE_ALL_TAGS__');
  }

  formatCurrency(valStr: string): string {
    const val = parseFloat(valStr);
    if (isNaN(val)) return '';
    const parts = val.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + parts.join('.');
  }

  numeroALetras(num: number): string {
    return numeroALetras(num);
  }

  formatProjectDate(dateStr: string, type: 'with_day' | 'full' | 'compact'): string {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00'); 
    if (isNaN(date.getTime())) return '';

    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const monthsCompact = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];

    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const monthNameCompact = monthsCompact[date.getMonth()];
    const year = date.getFullYear();

    if (type === 'with_day') {
      return `${dayName} ${dayNum} de ${monthName} del ${year}`;
    } else if (type === 'full') {
      return `${dayNum} de ${monthName} del ${year}`;
    } else if (type === 'compact') {
      return `${dayNum}/${monthNameCompact}/${year}`;
    }
    return '';
  }

  formatDateRange(startStr: string, endStr: string): string {
    if (!startStr || !endStr) return '';
    const start = new Date(startStr + 'T12:00:00');
    const end = new Date(endStr + 'T12:00:00');
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
    
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const ds = start.getDate();
    const ms = start.getMonth();
    const ys = start.getFullYear();
    
    const de = end.getDate();
    const me = end.getMonth();
    const ye = end.getFullYear();
    
    if (ms === me && ys === ye) {
      return `del ${ds} al ${de} de ${months[ms]} de ${ys}`;
    } else if (ys === ye) {
      return `del ${ds} de ${months[ms]} al ${de} de ${months[me]} de ${ys}`;
    } else {
      return `del ${ds} de ${months[ms]} de ${ys} al ${de} de ${months[me]} de ${ye}`;
    }
  }

  normalizeKeyName(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  }

  onPersonalFieldValueChange(fieldName: string, value: string) {
    this.personalFieldValues.update(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }

  addCustomField() {
    const fieldName = this.newCustomFieldName().trim();
    if (fieldName) {
      this.onAddCustomField.emit(fieldName);
      this.newCustomFieldName.set('');
    }
  }
}




