import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { /*AiSidebarHistoryComponent*/ } from '@system-shared/ai/ai-sidebar-history/ai-sidebar-history.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-generator-layout',
  imports: [CommonModule, IconComponent, /*AiSidebarHistoryComponent*/],
  templateUrl: './generator-layout.component.html',
  styles: ``,
})
export class GeneratorLayoutComponent {
  sidebarOpen = true;

  closeSidebar = () => {
    this.sidebarOpen = false;
  };
}

