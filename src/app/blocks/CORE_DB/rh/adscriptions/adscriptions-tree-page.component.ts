import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TreeViewComponent } from '../../../../shared/components/common/tree-view/tree-view.component';
import { SplitLayoutComponent } from '../../../../shared/components/common/split-layout/split-layout.component';
import { AdscriptionPanelComponent } from './adscription-panel.component';
import { environment } from '../../../../../environments/environment';

// =============================================================================
// COMPONENTE PRINCIPAL: ADSCRIPTIONS TREE PAGE (REFACTORED)
// =============================================================================
@Component({
  selector: 'app-adscriptions-tree-page',
  standalone: true,
  imports: [CommonModule, TreeViewComponent, SplitLayoutComponent, AdscriptionPanelComponent],
  templateUrl: './adscriptions-tree-page.component.html'
})
export class AdscriptionsTreePageComponent implements OnInit {
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
