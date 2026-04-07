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
      title: 'Preguntas Frecuentes | Fresquitox',
      description: 'Resolvemos tus dudas sobre Fresquitox: productos, precios, domicilios, zonas de entrega, eventos y m\u00e1s. Todo sobre nuestros granizados y refrescos artesanales en Bogot\u00e1.',
      keywords: 'preguntas frecuentes fresquitox, faq fresquitox, granizados bogota precios, domicilios fresquitox, eventos fresquitox',
      canonicalUrl: '/preguntas-frecuentes'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': this.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.pregunta,
        'acceptedAnswer': { '@type': 'Answer', 'text': faq.respuesta }
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
    elements.forEach((el: HTMLElement) => { el.classList.add('animate-init'); const d = el.dataset['animateDelay']; if (d) el.style.transitionDelay = `${d}ms`; });
    const obs = new IntersectionObserver((entries) => { for (const e of entries) { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('is-visible'); obs.unobserve(e.target); } } }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    elements.forEach((el: HTMLElement) => obs.observe(el));
    this.destroyRef.onDestroy(() => obs.disconnect());
  }
}
