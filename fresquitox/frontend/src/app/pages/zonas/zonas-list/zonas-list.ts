import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  readonly contact = CONTACT_INFO;
  readonly zonas = ZONAS;

  constructor() {
    afterNextRender(() => this.initScrollAnimations());
  }

  private initScrollAnimations(): void {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = this.el.nativeElement.querySelectorAll('[data-animate]') as NodeListOf<HTMLElement>;
    if (!elements.length) return;
    elements.forEach((el: HTMLElement) => { el.classList.add('animate-init'); const d = el.dataset['animateDelay']; if (d) el.style.transitionDelay = `${d}ms`; });
    const obs = new IntersectionObserver((entries) => { for (const e of entries) { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('is-visible'); obs.unobserve(e.target); } } }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    elements.forEach((el: HTMLElement) => obs.observe(el));
    this.destroyRef.onDestroy(() => obs.disconnect());
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Zonas de Entrega en Bogot\u00e1 | Fresquitox',
      description: 'Punto f\u00edsico en Chapinero y domicilios en toda Bogot\u00e1. Granizados, jugos naturales y refrescos artesanales a tu puerta. Fresquitox.',
      keywords: 'fresquitox zonas, domicilios bogota, fresquitox chapinero, refrescos a domicilio bogota, granizados domicilio bogota',
      canonicalUrl: '/zonas'
    });
    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Fresquitox',
      'address': { '@type': 'PostalAddress', 'addressLocality': 'Bogot\u00e1', 'addressRegion': 'Chapinero', 'addressCountry': 'CO' },
      'areaServed': this.zonas.map(z => ({ '@type': 'AdministrativeArea', 'name': `${z.nombre}, Bogot\u00e1` }))
    });
  }
}
