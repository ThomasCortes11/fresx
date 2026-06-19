import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { ZONAS } from '../../shared/data/zonas.data';
import { CONTACT_INFO } from '../../shared/constants/contact-info';
import { DeliveryOptions } from '../../shared/components/delivery-options/delivery-options';
import { ProductosService } from '../../core/services/productos.service';
import { Hero } from './hero/hero';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Hero, DeliveryOptions],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export default class Home implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productosSvc = inject(ProductosService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly contact = CONTACT_INFO;
  readonly zonas = ZONAS.slice(0, 6);

  readonly productosDestacados = computed(() =>
    this.productosSvc.getActivos().slice(0, 4).map((p) => ({
      slug: p.slug,
      nombre: p.nombre,
      descripcionCorta: p.descripcionCorta,
      idealPara: p.idealPara.slice(0, 3),
    }))
  );

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.productosSvc.loadActivos().subscribe();
      }
      this.initScrollAnimations();
    });
  }

  private initScrollAnimations(): void {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = this.el.nativeElement.querySelectorAll('[data-animate]') as NodeListOf<HTMLElement>;
    if (!elements.length) return;

    elements.forEach((el: HTMLElement) => {
      el.classList.add('animate-init');
      const delay = el.dataset['animateDelay'];
      if (delay) el.style.transitionDelay = delay + 'ms';
    });

    const staggerParents = this.el.nativeElement.querySelectorAll('[data-animate-stagger]') as NodeListOf<HTMLElement>;
    staggerParents.forEach((parent: HTMLElement) => {
      const children = parent.children;
      Array.from(children).forEach((child, i) => {
        const el = child as HTMLElement;
        el.classList.add('animate-init');
        el.style.transitionDelay = (i * 80) + 'ms';
      });
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
    staggerParents.forEach((parent: HTMLElement) => {
      Array.from(parent.children).forEach((child) => observer.observe(child as HTMLElement));
    });

    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Fresquitox | Refrescos Artesanales en Bogotá',
      description: 'Granizados, jugos naturales, raspados, limonadas y smoothies artesanales en Chapinero, Bogotá. Pide a domicilio o visítanos.',
      keywords: 'fresquitox, granizados bogota, jugos naturales bogota, raspados bogota, refrescos artesanales chapinero',
      canonicalUrl: '/'
    });

    const activos = this.productosSvc.getActivos();
    if (activos.length) {
      this.seo.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Productos Fresquitox',
        itemListElement: activos.map((s) => ({
          '@type': 'Product',
          name: s.nombre,
          description: s.descripcionCorta,
          url: `https://www.fresquitox.com/productos/${s.slug}`,
        })),
      });
    }
  }
}
