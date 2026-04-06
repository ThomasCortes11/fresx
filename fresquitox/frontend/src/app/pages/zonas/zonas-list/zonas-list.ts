import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { ZONAS } from '../../../shared/data/zonas.data';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';

@Component({
  selector: 'app-zonas-list',
  imports: [RouterLink],
  templateUrl: './zonas-list.html',
  styleUrl: './zonas-list.scss'
})
export default class ZonasList implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  readonly contact = CONTACT_INFO;
  readonly zonas = ZONAS;

  hoveredSlug: string | null = null;

  /** Posición de cada localidad (viewBox 0 0 1024 720) */
  readonly mapDots: Record<string, { x: number; y: number }> = {
    'usaquen':            { x: 192, y: 130 },
    'chapinero':          { x: 488, y: 225 },
    'suba':               { x: 145, y: 295 },
    'barrios-unidos':     { x: 390, y: 255 },
    'engativa':           { x: 268, y: 375 },
    'teusaquillo':        { x: 445, y: 325 },
    'fontibon':           { x: 330, y: 450 },
    'kennedy':            { x: 500, y: 500 },
    'puente-aranda':      { x: 502, y: 415 },
    'antonio-narino':     { x: 620, y: 380 },
    'santa-fe':           { x: 648, y: 252 },
    'san-cristobal':      { x: 750, y: 340 },
    'usme':               { x: 855, y: 435 },
    'tunjuelito':         { x: 632, y: 490 },
    'bosa':               { x: 530, y: 670 },
    'los-martires':       { x: 600, y: 330 },
    'la-candelaria':      { x: 670, y: 205 },
    'rafael-uribe-uribe': { x: 708, y: 428 },
    'ciudad-bolivar':     { x: 692, y: 540 },
    'sumapaz':            { x: 895, y: 370 },
  };

  constructor() {
    afterNextRender(() => this.initScrollAnimations());
  }

  goToZona(slug: string): void {
    this.router.navigate(['/zonas', slug]);
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Zonas de Servicio de Plomería en Bogotá',
      description: 'Cobertura de plomería profesional en todas las localidades de Bogotá: Usaquén, Chapinero, Suba, Kennedy, Engativá, Fontibón y más. Respuesta inmediata 24/7. SEP Soluciones.',
      keywords: 'plomero bogota norte, plomeria bogota norte, plomeros en bogota norte, plomeria en bogota norte, plomero chapinero, plomero suba, plomero usaquen, plomero kennedy, plomero engativa, plomero fontibon, zonas de cobertura plomeria bogota, plomero bogota todas las localidades, servicio de plomeria bogota suba, servicio de plomeria bogota chapinero, plomeria a domicilio bogota',
      canonicalUrl: '/zonas'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Zonas de Cobertura en Bogotá',
      'description': 'Localidades de Bogotá donde prestamos servicio de plomería profesional',
      'itemListElement': this.zonas.map((zona, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': `Plomería en ${zona.nombre}`,
        'url': `https://www.sepsoluciones.com/zonas/${zona.slug}`,
        'description': zona.descripcionSeo
      }))
    });
  }

  private initScrollAnimations(): void {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = this.el.nativeElement.querySelectorAll('[data-animate]') as NodeListOf<HTMLElement>;
    if (!elements.length) return;

    elements.forEach((el: HTMLElement) => {
      el.classList.add('animate-init');
      const delay = el.dataset['animateDelay'];
      if (delay) el.style.transitionDelay = `${delay}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach((el: HTMLElement) => observer.observe(el));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
