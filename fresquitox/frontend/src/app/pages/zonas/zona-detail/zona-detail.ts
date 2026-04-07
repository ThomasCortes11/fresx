import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { ZONAS, Zona } from '../../../shared/data/zonas.data';
import { SERVICIOS } from '../../../shared/data/servicios.data';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';
import { DeliveryOptions } from '../../../shared/components/delivery-options/delivery-options';

@Component({
  selector: 'app-zona-detail',
  imports: [RouterLink, DeliveryOptions],
  templateUrl: './zona-detail.html',
  styleUrl: './zona-detail.scss'
})
export default class ZonaDetail implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly contact = CONTACT_INFO;
  zona!: Zona;
  productos = SERVICIOS;
  otrasZonas: Zona[] = [];

  constructor() {
    afterNextRender(() => this.initScrollAnimations());
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const found = ZONAS.find(z => z.slug === slug);
    if (!found) return;
    this.zona = found;
    this.otrasZonas = ZONAS.filter(z => z.slug !== slug).slice(0, 5);

    this.seo.updateSeo({
      title: `Fresquitox en ${this.zona.nombre}, Bogot\u00e1 | Domicilios`,
      description: this.zona.descripcionSeo,
      keywords: this.zona.keywords,
      canonicalUrl: `/zonas/${slug}`
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': `Fresquitox - ${this.zona.nombre}`,
      'description': this.zona.descripcionSeo,
      'telephone': CONTACT_INFO.phoneFormatted,
      'address': { '@type': 'PostalAddress', 'addressLocality': 'Bogot\u00e1', 'addressRegion': this.zona.nombre, 'addressCountry': 'CO' },
      'areaServed': { '@type': 'AdministrativeArea', 'name': `${this.zona.nombre}, Bogot\u00e1` }
    });
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
}
