import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { SERVICIOS, CATEGORIAS, CategoriaServicio, Servicio } from '../../../shared/data/servicios.data';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';

// SVG path data per slug — no emojis, rendered as <svg> in template
const ICON_PATHS: Record<string, string> = {
  // Residenciales
  'destaqueos-y-desagues': 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  'plomeria-sanitarios': 'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2zM9 7h6M12 17v.01',
  'plomeria-duchas': 'M4 4h4v4H4zM14 4v7M14 4h3a3 3 0 0 1 0 6h-3M7 15l-3 6M10 15l3 6M8 12h2a2 2 0 0 1 0 4H8z',
  'plomeria-lavamanos': 'M12 2v6M8 8h8l1 6H7l1-6zM6 14h12M8 14l-1 6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l-1-6',
  'plomeria-cocinas': 'M3 7h18M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 7V3h8v4M7 11h.01M12 11h.01M17 11h.01',
  'plomeria-zonas-de-lavado': 'M3 6h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zM3 6l3-3h12l3 3M12 10v4M9 12h6',
  'plomeria-calentadores': 'M12 2c1 3-2 5-2 8a4 4 0 0 0 8 0c0-3-3-5-2-8M12 2c-1 3 2 5 2 8a4 4 0 0 1-8 0c0-3 3-5 2-8M12 18v4M8 22h8',
  'deteccion-de-fugas': 'M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35M8 11c0-1.66 1.34-3 3-3',
  'tuberias-internas': 'M6 3v18M18 3v18M6 8h12M6 16h12M3 8h3M3 16h3M18 8h3M18 16h3',
  // Empresariales
  'banos-y-zonas-comunes': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  'redes-hidraulicas-y-sanitarias': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'areas-sociales-y-recreativas': 'M2 15c6.667-6 13.333 0 20-6M22 9l-2 6-2-6M2 9l2 6 2-6M12 2v4M10 4h4M12 16v6',
  'sistemas-agua-potable-y-presurizacion': 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
  'parqueaderos-y-areas-tecnicas': 'M3 21V3h18v18H3zM3 7h18M7 3v4M12 11h4a2 2 0 0 1 0 4h-4v-4z',
  'mantenimiento-preventivo': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6M16 13H8M16 17H8M10 9H8',
  // Especializados
  'plomeria-restaurantes': 'M3 2l3 18h12l3-18M3 2h18M12 2v18M8 6v2M16 6v2',
  'plomeria-centros-comerciales': 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01',
  'plomeria-oficinas-y-empresas': 'M20 7h-9M14 17H5M17 17l4 4-4-4zM7 7L3 3l4 4z',
  'plomeria-colegios-y-universidades': 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5a6 6 0 0 0 12 0v-5',
  'plomeria-clinicas-y-hospitales': 'M3 3h18v18H3V3zM12 8v8M8 12h8',
};

@Component({
  selector: 'app-servicios-list',
  imports: [RouterLink],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.scss'
})
export default class ServiciosList implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly categorias = CATEGORIAS;
  readonly iconPaths = ICON_PATHS;
  readonly contact = CONTACT_INFO;
  readonly serviciosPorCategoria: Record<CategoriaServicio, Servicio[]> = {
    residencial: SERVICIOS.filter(s => s.categoria === 'residencial'),
    empresarial: SERVICIOS.filter(s => s.categoria === 'empresarial'),
    especializado: SERVICIOS.filter(s => s.categoria === 'especializado'),
  };
  scrollToGroup(cat: CategoriaServicio): void {
    const el = this.el.nativeElement.querySelector(`#cat-${cat}`) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  constructor() {
    afterNextRender(() => {
      this.initScrollAnimations();
      this.initCounterAnimations();
    });
  }

  private initCounterAnimations(): void {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const counters = this.el.nativeElement.querySelectorAll('[data-count]') as NodeListOf<HTMLElement>;
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private animateCounter(el: HTMLElement): void {
    const target = parseInt(el.dataset['count'] || '0', 10);
    const prefix = el.dataset['prefix'] || '';
    const duration = 2000;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = `${prefix}${current}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el: HTMLElement) => observer.observe(el));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Servicios de Plomería en Bogotá — Residencial, Empresarial y Especializado',
      description: 'Servicios profesionales de plomería en Bogotá: residencial, empresarial y especializado. Destaqueos, sanitarios, calentadores, redes hidráulicas, restaurantes, hospitales y más. SEP Soluciones.',
      keywords: 'servicios de plomeria bogota, plomeria residencial bogota, plomeria empresarial bogota, plomeria especializada bogota, destaqueos bogota, reparacion sanitarios bogota, calentadores bogota, redes hidraulicas bogota, plomeria restaurantes bogota, plomeria hospitales bogota, servicio plomeria bogota 24 horas',
      canonicalUrl: '/servicios'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Servicios de Plomería en Bogotá',
      'description': 'Servicios profesionales de plomería residencial, empresarial y especializada en Bogotá',
      'itemListElement': SERVICIOS.map((servicio, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': servicio.nombre,
        'url': `https://www.sepsoluciones.com/servicios/${servicio.slug}`,
        'description': servicio.descripcionCorta
      }))
    });
  }
}
