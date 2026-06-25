import { inject, signal, Directive, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControllerConfig } from '../interfaces/dynamic-form.interface';
import { FormErrorParser } from '../utils/form-error-parser.util';

/**
 * Controlador Base para los Formularios Dinámicos.
 * Al usar @Directive() le permitimos a Angular inyectar dependencias y usar ciclos de vida (OnInit).
 */
@Directive()
export abstract class BaseFormController<T> implements OnInit {
  
  // 1. Inyección de dependencias silenciosa (Sin tocar el constructor del hijo)
  protected fb     = inject ( FormBuilder    ) ;
  protected router = inject ( Router         ) ;
  protected route  = inject ( ActivatedRoute ) ;

  // 2. Propiedades que DEBEN ser provistas por el componente hijo
  protected abstract apiService: any; // Se espera la instancia inyectada de BaseApiService<T>
  protected abstract controllerConfig: FormControllerConfig;

  // 3. Estados Reactivos (Signals)
  public isEditMode = signal<boolean>(false);
  public itemId     = signal<string | null>(null);
  public isLoading  = signal<boolean>(false);
  public contextText = signal<string>('');

  public form!: FormGroup;

  // Shortcut para pasarle al <app-dynamic-form> en el HTML
  get formConfig() {
    return this.controllerConfig.formConfig;
  }

  // ==========================================
  // CICLO DE VIDA Y SETUP
  // ==========================================
  
  ngOnInit(): void {
    if (!this.controllerConfig) {
      throw new Error(`La clase hija debe definir 'controllerConfig' antes de la inicialización.`);
    }
    this.buildForm();
    this.checkEditMode();
  }

  protected buildForm() {
    const group: any = {};
    
    this.controllerConfig.formConfig.forEach(section => {
      section.fields.forEach(field => {
        const validators = field.required ? [Validators.required] : [];
        let initialValue = field.defaultValue !== undefined ? field.defaultValue : '';
        
        // Si es booleano y no tiene default, asume false en lugar de string vacío
        if (field.type === 'boolean' && field.defaultValue === undefined) {
          initialValue = false;
        }

        group[field.key] = [initialValue, validators];
      });
    });

    this.form = this.fb.group(group);
  }

  // ==========================================
  // LÓGICA DE DATOS
  // ==========================================

  protected checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.itemId.set(id);
      this.loadData(id);
    } else {
      // Si estamos en modo "Nuevo", leemos los query params para pre-poblar valores (ej. Filtros activos)
      const queryParams = this.route.snapshot.queryParams;
      if (Object.keys(queryParams).length > 0) {
        // Sacamos context_text de los valores a inyectar al formulario
        const { context_text, ...formValues } = queryParams;
        if (context_text) {
          this.contextText.set(context_text);
        }
        if (Object.keys(formValues).length > 0) {
          const mappedValues: any = {};
          Object.keys(formValues).forEach(key => {
            if (key === 'countryId') {
              mappedValues.country_id = formValues[key];
            } else if (key === 'stateId') {
              mappedValues.state_id = formValues[key];
            } else {
              mappedValues[key] = formValues[key];
            }
          });
          this.form.patchValue(mappedValues);
        }
      }
    }
  }

  protected async loadData(id: string) {
    this.isLoading.set(true);
    try {
      const data = await this.apiService.getById(id);
      if (data) {
        this.form.patchValue(data);
      }
    } catch (error) {
      console.error('Error cargando registro:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // ==========================================
  // LÓGICA DE NAVEGACIÓN Y GUARDADO
  // ==========================================

  public async onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    
    // Sanitizar valores: convertir cadenas vacías en null antes de enviar al backend
    const formValue = { ...this.form.value };
    Object.keys(formValue).forEach(key => {
      if (formValue[key] === '') {
        formValue[key] = null;
      }
    });

    try {
      if (this.isEditMode() && this.itemId()) {
        await this.apiService.update(this.itemId()!, formValue, this.controllerConfig.cacheKeyToInvalidate);
      } else {
        await this.apiService.create(formValue, this.controllerConfig.cacheKeyToInvalidate);
      }
      
      // Actualizamos la lista si el servicio implementa getAll
      if (typeof this.apiService.getAll === 'function') {
        await this.apiService.getAll();
      }

      this.navigateToMain();
    } catch (error: any) {
      console.error('Error guardando registro:', error);
      
      // Intentamos mapear los errores a los controles del formulario
      const unmappedErrors = FormErrorParser.parse(error, this.form);
      
      // Solo mostramos alerta global para los errores que no se pudieron atar a un input
      if (unmappedErrors.length > 0) {
        alert('Hubo un problema con el Backend al guardar:\n\n- ' + unmappedErrors.join('\n- '));
      }
      
    } finally {
      this.isLoading.set(false);
    }
  }

  public onCancel() { this.navigateToMain( ) ; }

  protected navigateToMain() { this.router.navigate ( [ this.controllerConfig.mainRoute ] ) ; }
}
