import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, ChangeDetectorRef, inject, OnInit, effect } from '@angular/core';
import { SidebarService } from '../app-sidebar/sidebar.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SafeHtmlPipe } from '@system-pipe/safe-html.pipe';
import { SidebarWidgetComponent } from './app-sidebar-widget.component';
import { combineLatest, Subscription } from 'rxjs';

import { SIDEBAR_MENU, MenuSection } from '@core/menu/app.sidebar.menu';
import { SesionService } from '@services/sesion.service';
import { PermissionService } from '@security/permissions/permission.service';
import { } from '@metasystem/components/logo/logo.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

import { APP_SETTINGS } from '@metasystem/settings/app.settings';

import { HeaderSidebarComponent } from './header-sidebar.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
    SidebarWidgetComponent,
    IconComponent,
    HeaderSidebarComponent
  ],
  templateUrl: './app-sidebar.component.html',
})
export class AppSidebarComponent implements OnInit {
  appSettings = APP_SETTINGS;

  menuSections: MenuSection[] = SIDEBAR_MENU;

  private sesionService = inject(SesionService);
  private permissionService = inject(PermissionService);

  openSubmenu: string | null | number = null;
  subMenuHeights: { [key: string]: number } = {};
  @ViewChildren('subMenu') subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;

    // Reactivamente filtrar el menú cada vez que cambien los permisos en SesionService
    effect(() => {
      this.filterMenuByPermissions();
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      })
    );

    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(
        ([isExpanded, isMobileOpen, isHovered]) => {
          if (!isExpanded && !isMobileOpen && !isHovered) {
            this.cdr.detectChanges();
          }
        }
      )
    );
  }

  /**
   * Filtra el menú síncronamente usando la señal de permisos del SesionService.
   * Si no hay sesión, o los permisos están vacíos y se está cargando,
   * se cae en un fallback de gracia mostrando todo el menú.
   */
  filterMenuByPermissions() {
    const perms = this.sesionService.permissions();

    // Fallback de gracia si no hay sesión
    if (!this.sesionService.isLoggedIn()) {
      this.menuSections = SIDEBAR_MENU;
      this.setActiveMenuFromRoute(this.router.url);
      this.cdr.detectChanges();
      return;
    }

    // Fallback de gracia si los permisos están vacíos por ahora
    if (perms.length === 0) {
      this.menuSections = SIDEBAR_MENU;
      this.setActiveMenuFromRoute(this.router.url);
      this.cdr.detectChanges();
      return;
    }

    const permittedModuleIds = new Set<number>();
    perms.forEach(p => {
      if (p.can_read) {
        permittedModuleIds.add(p.module_id);
      }
    });

    this.menuSections = SIDEBAR_MENU.map(section => {
      const filteredItems = section.items.map((item: any) => {
        if (item.subItems) {
          const filteredSubItems = item.subItems.filter((sub: any) => permittedModuleIds.has(sub.module_id));
          return {
            ...item,
            subItems: filteredSubItems
          };
        }
        return item;
      }).filter((item: any) => {
        if (item.subItems) {
          return item.subItems.length > 0;
        }
        return true;
      });

      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);

    this.setActiveMenuFromRoute(this.router.url);
    this.cdr.detectChanges();
  }

  ngOnDestroy (              ) { this.subscription.unsubscribe (  ) ; }
  isActive    ( path: string ) : boolean { return this.router.url === path ; }

  toggleSubmenu(sectionPrefix: string, index: number) {
    const key = `${sectionPrefix}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges(); 
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.isExpanded$.subscribe(expanded => {
      if (!expanded) {
        this.sidebarService.setHovered(true);
      }
    }).unsubscribe();
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    this.menuSections.forEach(section => {
      section.items.forEach((nav: any, i: number) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem: any) => {
            if (currentUrl === subItem.path) {
              const key = `${section.prefix}-${i}`;
              this.openSubmenu = key;

              setTimeout(() => {
                const el = document.getElementById(key);
                if (el) {
                  this.subMenuHeights[key] = el.scrollHeight;
                  this.cdr.detectChanges();
                }
              });
            }
          });
        }
      });
    });
  }

  onSubmenuClick() {
    this.isMobileOpen$.subscribe(isMobile => {
      if (isMobile) {
        this.sidebarService.setMobileOpen(false);
      }
    }).unsubscribe();
  }
}

