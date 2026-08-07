import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { AreaSelectComponent } from '@workspace-shared/components/selects/area-select/area-select.component';
import { ExternalContactSelectComponent } from '@workspace-shared/components/selects/external-contact-select/external-contact-select.component';
import { PageBreadcrumbComponent } from '@system-shared/common/page-breadcrumb/page-breadcrumb.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ControlComponent } from '@system-shared/control/control.component';
import { DatePickerComponent } from '@system-shared/form/date-picker/date-picker.component';
import { FileInputComponent } from '@system-shared/form/input/file-input.component';
import { HttpClient } from '@angular/common/http';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { ExternalContactDTO } from '../../../../database/organization/external-contacts/external-contact.dto';
import { AreaService } from '../../../../database/organization/areas/area.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { ApiRouteService } from '@core/api/api-route.service';
import { SelectComponent } from '@system-shared/form/select/select.component';

@Component({
  selector: 'app-form-external-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    AreaSelectComponent, 
    ExternalContactSelectComponent,
    PageBreadcrumbComponent,
    ActionButtonComponent,
    ControlComponent,
    DatePickerComponent,
    FileInputComponent,
    SelectComponent
  ],
  templateUrl: './form-external-page.component.html'
})
export class FormExternalPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apiRouteService = inject(ApiRouteService);
  private areaService = inject(AreaService);
  private location = inject(Location);

  isLoading = false;
  selectedFile: File | null = null;
  remitenteMode: 'oficiales' | 'libre' = 'oficiales';

  claseDocumentoOptions = [
    { value: 'oficio', label: 'Oficio' },
    { value: 'memo', label: 'Memorándum' },
    { value: 'ti', label: 'Tarjeta Informativa' },
    { value: 'circular', label: 'Circular' }
  ];

  metodoFirmaOptions = [
    { value: 'autografa', label: 'Firma Autógrafa' },
    { value: 'electronica', label: 'Firma Electrónica' }
  ];

  form = this.fb.group({
    clase_documento: ['oficio', Validators.required],
    tipo_documento: ['recibido_externo', Validators.required],
    external_reference: ['', Validators.required],
    remitente_texto_libre: [''],
    dependencia: [''],
    id_contacto_externo: [''],
    id_area_receptora: ['', Validators.required],
    asunto: ['', Validators.required],
    contestacion_a: [''],
    metodo_firma: ['autografa'],
    fecha_doc: [''],
    fecha_recepcion: [this.formatDateForInput(new Date())]
  });

  private formatDateForInput(date: Date): string {
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
  }

  ngOnInit() {
    const clase = this.route.snapshot.queryParamMap.get('clase') || 'oficio';
    this.form.patchValue({ clase_documento: clase });
    this.loadDefaultArea();
  }

  async loadDefaultArea() {
    try {
      const response = await this.areaService.getAll();
      const areas = response.data || [];
      // Buscar la Secretaría (usualmente no tiene parent_id o su nombre incluye 'Secretaría')
      const secretaria = areas.find((a: any) => !a.parent_id || a.name.toLowerCase().includes('secretaría de economía'));
      if (secretaria) {
        this.form.patchValue({ id_area_receptora: secretaria.id });
      }
    } catch (e) {
      console.error('No se pudo cargar el área por defecto', e);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      alert('Debe seleccionar un archivo PDF válido');
    }
  }

  selectedContactData: ExternalContactDTO | null = null;

  onContactSelected(contact: ExternalContactDTO | null) {
    this.selectedContactData = contact;
    if (contact) {
      this.form.patchValue({
        id_contacto_externo: contact.id,
        remitente_texto_libre: contact.nombre,
        dependencia: contact.empresa_dependencia || ''
      });
    } else {
      this.form.patchValue({ id_contacto_externo: '', remitente_texto_libre: '', dependencia: '' });
    }
  }

  onAreaSelected(area: any) {
    if (area) {
      this.form.patchValue({ id_area_receptora: area.id });
    } else {
      this.form.patchValue({ id_area_receptora: '' });
    }
  }

  async onSubmit() {
    if (this.form.invalid || !this.selectedFile) {
      alert('Por favor complete todos los campos obligatorios y anexe el archivo PDF.');
      return;
    }

    if (this.remitenteMode === 'libre') {
      this.form.patchValue({ id_contacto_externo: '' });
    }

    this.isLoading = true;
    try {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      
      const value = this.form.value;
      Object.keys(value).forEach(key => {
        if (value[key as keyof typeof value]) {
          formData.append(key, value[key as keyof typeof value] as string);
        }
      });

      // Añadir metadatos de participantes empaquetaditos
      if (this.selectedContactData) {
        const metadatos = {
          destinatario_oficial_nombre: this.selectedContactData.nombre || '',
          destinatario_oficial_puesto: this.selectedContactData.puesto || '',
          destinatario_oficial_curp: this.selectedContactData.curp || '',
          destinatario_oficial_dependencia: this.selectedContactData.empresa_dependencia || ''
        };
        formData.append('metadatos_participantes', JSON.stringify(metadatos));
      }

      const url = this.apiRouteService.getAbsoluteUrl('/documents/documentos/external');
      
      await firstValueFrom(this.http.post(url, formData, { headers: { 'Accept': 'application/json' }}));
      
      alert('Documento externo registrado correctamente');
      this.router.navigate(['/operatividad/documento', value.clase_documento]);
    } catch (error) {
      console.error('Error registrando documento externo:', error);
      alert('Ocurrió un error al registrar el documento');
    } finally {
      this.isLoading = false;
    }
  }

  cancel() {
    this.location.back();
  }
}

