import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TreeViewComponent } from '@system-shared/common/tree-view/tree-view.component';
import { SplitLayoutComponent } from '@system-shared/common/split-layout/split-layout.component';
import { EmployeesPanelComponent } from './employees-panel.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [CommonModule, TreeViewComponent, SplitLayoutComponent, EmployeesPanelComponent],
  template: `
    <app-split-layout
      title="Personal Activo por Área"
      subtitle="Visualice la plantilla del personal activo, gestione altas de empleados, cambios de adscripción y bajas organizacionales."
      icon="👥">
      
      <!-- Panel Izquierdo: Organigrama de Dependencias -->
      <div leftPane class="h-full flex flex-col gap-4">
        <app-tree-view
          [nodes]="areaTree()"
          [selectedId]="selectedArea()?.id || ''"
          [isLoading]="isTreeLoading()"
          title="Organigrama de Dependencias"
          subtitle="Seleccione un área administrativa para visualizar su plantilla de empleados."
          searchPlaceholder="Buscar área por nombre o siglas..."
          [searchFields]="['name', 'acronym', 'area_type']"
          (onSelect)="onAreaSelect($event)">
        </app-tree-view>
      </div>

      <!-- Panel Derecho: Acciones, Listado y Ficha de Detalle -->
      <div rightPane class="h-full">
        <app-employees-panel [selectedArea]="selectedArea()"></app-employees-panel>
      </div>

    </app-split-layout>
  `
})
export class EmployeesPageComponent implements OnInit {
  private http = inject(HttpClient);

  // Estados del Organigrama
  areaTree = signal<any[]>([]);
  isTreeLoading = signal<boolean>(true);
  selectedArea = signal<any | null>(null);

  ngOnInit() {
    this.loadAreaTree();
  }

  async loadAreaTree() {
    this.isTreeLoading.set(true);
    try {
      const url = `${environment.URL_PATH.replace(/\/$/, '')}/organization/areas/root/tree?plain=true`;
      const res = await firstValueFrom(this.http.get<any[]>(url));
      this.areaTree.set(res || []);
    } catch (e) {
      console.error('Error cargando el árbol de áreas:', e);
    } finally {
      this.isTreeLoading.set(false);
    }
  }

  onAreaSelect(areaNode: any) {
    this.selectedArea.set(areaNode);
  }
}
