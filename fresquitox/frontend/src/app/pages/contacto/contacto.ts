import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { CONTACT_INFO } from '../../shared/constants/contact-info';

@Component({
  selector: 'app-contacto',
  imports: [RouterLink],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss'
})
export default class Contacto implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly contact = CONTACT_INFO;

  constructor() {
    afterNextRender(() => this.initScrollAnimations());
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Contacto | Fresquitox \u2014 Pedidos y Eventos',
      description: 'Cont\u00e1ctanos para pedidos, eventos privados o cotizaciones. Punto f\u00edsico en Chapinero y domicilios en toda Bogot\u00e1. Fresquitox.',
      keywords: 'contacto fresquitox, pedidos fresquitox, whatsapp fresquitox, fresquitox chapinero, granizados bogota contacto',
      canonicalUrl: '/contacto'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contacto - Fresquitox',
      'url': 'https://www.fresquitox.com/contacto'
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
