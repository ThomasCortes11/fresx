import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { CONTACT_INFO } from '../../shared/constants/contact-info';
import { DeliveryOptions } from '../../shared/components/delivery-options/delivery-options';

@Component({
  selector: 'app-nosotros',
  imports: [RouterLink, DeliveryOptions],
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
      title: 'Nosotros — Nuestra Historia | Fresquitox',
      description: 'Conoce a Fresquitox: marca de refrescos naturales en Bogotá. Ingredientes 100% frescos, sabor de calle y actitud real. Granizados, jugos, raspados y más.',
      keywords: 'fresquitox nosotros, refrescos naturales bogota, granizados bogota, jugos frescos bogota, historia fresquitox, bebidas naturales colombia',
      canonicalUrl: '/nosotros'
    });

    this.seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': 'Sobre Fresquitox — Refrescos Naturales en Bogotá',
        'description': 'Marca de refrescos naturales en Bogotá con ingredientes 100% frescos. Granizados, jugos, raspados y limonadas.',
        'url': 'https://www.fresquitox.com/nosotros'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Fresquitox',
        'url': 'https://www.fresquitox.com',
        'telephone': CONTACT_INFO.phoneFormatted,
        'email': CONTACT_INFO.email,
        'areaServed': {
          '@type': 'City',
          'name': 'Bogotá',
          'sameAs': 'https://es.wikipedia.org/wiki/Bogot%C3%A1'
        },
        'slogan': 'El sabor de la calle'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://www.fresquitox.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Nosotros', 'item': 'https://www.fresquitox.com/nosotros' }
        ]
      }
    ]);
  }
}
