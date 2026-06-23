import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';
import { AuthService } from '../../services/auth.service';

const MENU_CLASS = 'fq-menu-open';

interface NavItem {
  path: string;
  label: string;
  exact?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private scrollListener?: () => void;
  private routerSub?: Subscription;
  readonly contact = CONTACT_INFO;
  readonly mobileNav: NavItem[] = [
    { path: '/', label: 'Inicio', exact: true },
    { path: '/productos', label: 'Productos' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/experiencia', label: 'Experiencia' },
    { path: '/eventos', label: 'Eventos' },
  ];
  menuOpen = false;
  orderOpen = false;
  scrolled = false;
  navDebug = false;
  debugBodyState = 'ok';
  debugLog = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.navDebug =
      new URLSearchParams(window.location.search).has('navdebug') ||
      window.localStorage.getItem('fq-navdebug') === '1';

    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu(false);
        this.cdr.markForCheck();
      });

    const handler = () => {
      if (this.menuOpen) return;
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== this.scrolled) {
        this.scrolled = isScrolled;
        this.cdr.markForCheck();
      }
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    this.scrollListener = () => window.removeEventListener('scroll', handler);
  }

  ngOnDestroy(): void {
    this.scrollListener?.();
    this.routerSub?.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      this.closeMenu(false);
    }
  }

  toggleMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) {
      this.orderOpen = false;
    }
    this.applyMenuState();
    this.logDebug(this.menuOpen ? 'toggle:open' : 'toggle:close');
    this.cdr.markForCheck();
  }

  closeMenu(mark = true): void {
    this.menuOpen = false;
    this.orderOpen = false;
    this.applyMenuState();
    if (mark) {
      this.cdr.markForCheck();
    }
  }

  forceReset(): void {
    this.closeMenu();
    this.logDebug('manual-reset');
  }

  navigateTo(path: string): void {
    this.closeMenu();
    if (this.isActive(path)) {
      this.logDebug(`same:${path}`);
      return;
    }
    this.logDebug(`go:${path}`);
    void this.router.navigateByUrl(path);
  }

  isActive(path: string, exact = false): boolean {
    const current = this.router.url.split('?')[0].split('#')[0];
    const matchExact = exact || path === '/';

    if (matchExact) {
      return current === path;
    }

    return current === path || current.startsWith(`${path}/`);
  }

  trackNav(_index: number, item: NavItem): string {
    return item.path;
  }

  private applyMenuState(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.documentElement.classList.toggle(MENU_CLASS, this.menuOpen);
    this.refreshDebugBodyState();
  }

  private refreshDebugBodyState(): void {
    if (!this.navDebug) return;
    this.debugBodyState = document.documentElement.classList.contains(MENU_CLASS) ? 'menu-open' : 'ok';
  }

  private logDebug(message: string): void {
    if (!this.navDebug) return;
    const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.debugLog = `${time} · ${message}`;
    this.refreshDebugBodyState();
  }

  isAdminLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get currentRoute(): string {
    return this.router.url;
  }
}
