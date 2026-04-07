import { Component, OnInit, OnDestroy, NgZone, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private scrollListener?: () => void;
  readonly contact = CONTACT_INFO;
  menuOpen = false;
  orderOpen = false;
  scrolled = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.ngZone.runOutsideAngular(() => {
      const handler = () => {
        const isScrolled = window.scrollY > 20;
        if (isScrolled !== this.scrolled) {
          this.scrolled = isScrolled;
        }
      };
      window.addEventListener('scroll', handler, { passive: true });
      this.scrollListener = () => window.removeEventListener('scroll', handler);
    });
  }

  ngOnDestroy(): void {
    this.scrollListener?.();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
