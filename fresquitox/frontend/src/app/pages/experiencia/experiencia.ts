import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { SERVICIOS } from '../../shared/data/servicios.data';
import { CONTACT_INFO } from '../../shared/constants/contact-info';
import { DeliveryOptions } from '../../shared/components/delivery-options/delivery-options';

@Component({
  selector: 'app-experiencia',
  imports: [RouterLink, DeliveryOptions],
  templateUrl: './experiencia.html',
  styleUrl: './experiencia.scss'
})
export default class Experiencia implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly contact = CONTACT_INFO;
  readonly productos = SERVICIOS;

  constructor() {
    afterNextRender(() => this.initScrollAnimations());
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Experiencia Fresquitox | Sabores que Despiertan Emociones',
      description: 'Descubre lo que cada producto Fresquitox transmite: frescura, nostalgia, energía y alegría. Una experiencia sensorial única con granizados, jugos y refrescos artesanales en Bogotá.',
      keywords: 'experiencia fresquitox, granizados artesanales bogota, refrescos experiencia, sabores fresquitox, jugos naturales experiencia',
      canonicalUrl: '/experiencia'
    });
  }

  private initScrollAnimations(): void {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = this.el.nativeElement.querySelectorAll('[data-animate]') as NodeListOf<HTMLElement>;
    if (!elements.length) return;
    elements.forEach((el: HTMLElement) => {
      el.classList.add('animate-init');
      const d = el.dataset['animateDelay'];
      if (d) el.style.transitionDelay = `${d}ms`;
    });
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('is-visible'); obs.unobserve(e.target); } } },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    elements.forEach((el: HTMLElement) => obs.observe(el));
    this.destroyRef.onDestroy(() => obs.disconnect());
  }
}
