import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { SERVICIOS, CATEGORIAS, CategoriaProducto, Servicio } from '../../../shared/data/servicios.data';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';
import { DeliveryOptions } from '../../../shared/components/delivery-options/delivery-options';
import { ProductosService, ProductoAdmin } from '../../../core/services/productos.service';

export interface ProductoVista {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  icono: string;
  emoji?: string;
  idealPara: string[];
  precio?: string;
  imagen?: string;
  etiquetas?: string[];
  esAdmin?: boolean;
}

@Component({
  selector: 'app-servicios-list',
  imports: [RouterLink, DeliveryOptions],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.scss'
})
export default class ServiciosList implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productosSvc = inject(ProductosService);
  readonly categorias = CATEGORIAS;
  readonly contact = CONTACT_INFO;

  readonly serviciosPorCategoria = computed<Record<CategoriaProducto, ProductoVista[]>>(() => {
    const adminActivos = this.productosSvc.getActivos();
    const mezclar = (cat: CategoriaProducto): ProductoVista[] => {
      const estaticos: ProductoVista[] = SERVICIOS
        .filter(s => s.categoria === cat)
        .map(s => ({ ...s, etiquetas: [] }));
      const admin: ProductoVista[] = adminActivos
        .filter(p => p.categoria === cat)
        .map(p => ({ ...p, esAdmin: true }));
      return [...estaticos, ...admin];
    };
    return { clasicos: mezclar('clasicos'), naturales: mezclar('naturales'), premium: mezclar('premium') };
  });

  scrollToGroup(cat: CategoriaProducto): void {
    const el = this.el.nativeElement.querySelector(`#cat-${cat}`) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  constructor() {
    afterNextRender(() => this.initScrollAnimations());
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
      (entries) => { for (const entry of entries) { if (entry.isIntersecting) { (entry.target as HTMLElement).classList.add('is-visible'); observer.unobserve(entry.target); } } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach((el: HTMLElement) => observer.observe(el));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Productos | Fresquitox \u2014 Granizados, Jugos y M\u00e1s',
      description: 'Descubre nuestro men\u00fa de refrescos artesanales: granizados, raspados, jugos naturales, limonadas, smoothies y m\u00e1s. Pide a domicilio en Bogot\u00e1. Fresquitox.',
      keywords: 'granizados bogota, jugos naturales bogota, raspados bogota, limonadas bogota, smoothies bogota, refrescos artesanales bogota, fresquitox productos',
      canonicalUrl: '/productos'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Productos Fresquitox',
      'description': 'Men\u00fa de refrescos artesanales en Bogot\u00e1',
      'itemListElement': SERVICIOS.map((s, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': s.nombre,
        'url': `https://www.fresquitox.com/productos/${s.slug}`,
        'description': s.descripcionCorta
      }))
    });
  }
}
