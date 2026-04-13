import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { ZONAS } from '../../shared/data/zonas.data';
import { CONTACT_INFO } from '../../shared/constants/contact-info';
import { DeliveryOptions } from '../../shared/components/delivery-options/delivery-options';
import { Hero } from './hero/hero';

interface Producto {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  idealPara: string[];
}

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
  readonly contact = CONTACT_INFO;
  readonly zonas = ZONAS.slice(0, 6);

  readonly productos: Producto[] = [
    { slug: 'jugos-naturales', nombre: 'Jugos Naturales', descripcionCorta: 'Jugos recien exprimidos con frutas frescas de temporada.', idealPara: ['Naranja', 'Mango', 'Lulo'] },
    { slug: 'raspados', nombre: 'Raspados', descripcionCorta: 'Hielo raspado con siropes artesanales y frutas naturales.', idealPara: ['Fresa', 'Limon', 'Tamarindo'] },
    { slug: 'granizados', nombre: 'Granizados', descripcionCorta: 'Granizados cremosos con sabores tropicales y exoticos.', idealPara: ['Mora', 'Maracuya', 'Guanabana'] },
    { slug: 'limonadas', nombre: 'Limonadas Especiales', descripcionCorta: 'Limonadas clasicas y de autor con combinaciones unicas.', idealPara: ['Natural', 'Cerezada', 'Hierbabuena'] },
    { slug: 'smoothies', nombre: 'Smoothies', descripcionCorta: 'Batidos cremosos con frutas, yogurt y toppings naturales.', idealPara: ['Frutas mixtas', 'Tropical', 'Verde'] },
    { slug: 'eventos', nombre: 'Eventos y Fiestas', descripcionCorta: 'Servicio de refrescos para eventos, fiestas y reuniones.', idealPara: ['Fiestas', 'Empresas', 'Bodas'] },
  ];

  readonly productosDestacados = this.productos.slice(0, 4);

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
      if (delay) el.style.transitionDelay = delay + 'ms';
    });

    // Auto-stagger grid children with data-animate-stagger on parent
    const staggerParents = this.el.nativeElement.querySelectorAll('[data-animate-stagger]') as NodeListOf<HTMLElement>;
    staggerParents.forEach((parent: HTMLElement) => {
      const staggerMs = parseInt(parent.dataset['animateStagger'] || '80', 10);
      const children = parent.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (!child.hasAttribute('data-animate')) {
          child.setAttribute('data-animate', 'fade-up');
        }
        child.classList.add('animate-init');
        child.style.transitionDelay = (i * staggerMs) + 'ms';
      }
    });

    const allAnimated = this.el.nativeElement.querySelectorAll('.animate-init') as NodeListOf<HTMLElement>;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    allAnimated.forEach((el: HTMLElement) => observer.observe(el));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Fresquitox | Refrescos Naturales en Bogota - Pedidos a Domicilio',
      description: 'Fresquitox: refrescos naturales, jugos frescos, raspados y granizados en Bogota. Ingredientes 100% naturales y sabores unicos. Pedidos a domicilio. Pide el tuyo!',
      keywords: 'refrescos bogota, jugos naturales bogota, raspados bogota, granizados bogota, bebidas naturales bogota, fresquitox, refrescos a domicilio bogota, jugos frescos bogota, limonadas bogota, smoothies bogota, bebidas artesanales bogota',
      canonicalUrl: '/'
    });

    this.seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        '@id': 'https://www.fresquitox.com/#organization',
        'name': 'Fresquitox',
        'alternateName': 'Fresquitox Refrescos',
        'description': 'Refrescos naturales, jugos frescos, raspados y granizados en Bogota. Ingredientes 100% naturales y sabores unicos. Pedidos a domicilio.',
        'url': 'https://www.fresquitox.com',
        'telephone': CONTACT_INFO.phoneFormatted,
        'email': CONTACT_INFO.email,
        'servesCuisine': 'Bebidas naturales, Refrescos, Jugos',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Bogota',
          'addressRegion': 'Cundinamarca',
          'addressCountry': 'CO'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': 4.711,
          'longitude': -74.0721
        },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'opens': '08:00',
            'closes': '21:00'
          }
        ],
        'priceRange': '$',
        'image': 'https://www.fresquitox.com/images/og/fresquitox-og.webp',
        'areaServed': {
          '@type': 'City',
          'name': 'Bogota'
        },
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Menu de Refrescos',
          'itemListElement': this.productos.map(s => ({
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': s.nombre,
              'description': s.descripcionCorta,
              'url': 'https://www.fresquitox.com/servicios/' + s.slug
            }
          }))
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Fresquitox',
        'url': 'https://www.fresquitox.com'
      }
    ]);
  }
}
