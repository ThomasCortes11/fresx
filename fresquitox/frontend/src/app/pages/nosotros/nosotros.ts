import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { CONTACT_INFO } from '../../shared/constants/contact-info';

@Component({
  selector: 'app-nosotros',
  imports: [RouterLink],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.scss'
})
export default class Nosotros implements OnInit {
  private readonly seo = inject(SeoService);

  readonly contact = CONTACT_INFO;

  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);


  constructor() {
    afterNextRender(() => {
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
      title: 'Sobre Nosotros – Plomeros Profesionales en Bogotá | SEP Soluciones',
      description: 'Conozca a SEP Soluciones: empresa de plomería profesional en Bogotá con más de 10 años de experiencia. Técnicos certificados, garantía escrita, atención 24/7 en servicios hidráulicos.',
      keywords: 'plomería en bogotá, plomeros profesionales bogotá, servicios hidráulicos bogotá, reparaciones de agua bogotá, urgencias de plomería, empresa de plomería bogotá, sep soluciones, técnicos certificados plomería, plomero 24 horas bogotá',
      canonicalUrl: '/nosotros'
    });

    this.seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': 'Sobre SEP Soluciones – Plomeros Profesionales en Bogotá',
        'description': 'Empresa de plomería profesional en Bogotá con más de 10 años de experiencia en servicios hidráulicos, reparaciones de agua y urgencias de plomería.',
        'url': 'https://www.sepsoluciones.com/nosotros'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'SEP Soluciones',
        'url': 'https://www.sepsoluciones.com',
        'telephone': '+573148153221',
        'email': 'sepplomerosbogota@gmail.com',
        'areaServed': {
          '@type': 'City',
          'name': 'Bogotá',
          'sameAs': 'https://es.wikipedia.org/wiki/Bogot%C3%A1'
        },
        'serviceType': ['Plomería', 'Servicios hidráulicos', 'Reparaciones de agua', 'Urgencias de plomería'],
        'foundingDate': '2014',
        'slogan': 'Plomeros profesionales con garantía escrita en Bogotá'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://www.sepsoluciones.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Nosotros', 'item': 'https://www.sepsoluciones.com/nosotros' }
        ]
      }
    ]);
  }
}
