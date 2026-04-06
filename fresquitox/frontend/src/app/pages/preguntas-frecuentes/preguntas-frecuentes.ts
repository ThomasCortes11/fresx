import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { FAQ_DATA } from '../../shared/data/faq.data';
import { CONTACT_INFO } from '../../shared/constants/contact-info';

@Component({
  selector: 'app-preguntas-frecuentes',
  imports: [RouterLink],
  templateUrl: './preguntas-frecuentes.html',
  styleUrl: './preguntas-frecuentes.scss'
})
export default class PreguntasFrecuentes implements OnInit {
  private readonly seo = inject(SeoService);

  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly contact = CONTACT_INFO;
  readonly faqs = FAQ_DATA;
  expandedIndex: number | null = null;

  constructor() {
    afterNextRender(() => this.initScrollAnimations());
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Preguntas Frecuentes de Plomería en Bogotá | SEP Soluciones',
      description: 'Resolvemos tus dudas sobre plomería en Bogotá: costos, tiempos de respuesta, garantía, cobertura, emergencias 24 horas, métodos de pago y más. Plomero en Bogotá con servicio de plomería urgente.',
      keywords: 'preguntas frecuentes plomeria bogota, faq plomeria, cuanto cuesta plomero bogota, plomeria bogota precios, plomero emergencia bogota, plomero bogota 24 horas, servicio de plomeria urgente bogota, plomeria 24 horas, plomero en bogota',
      canonicalUrl: '/preguntas-frecuentes'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': this.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.pregunta,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.respuesta
        }
      }))
    });
  }

  toggle(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
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
