import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { ZONAS, Zona } from '../../../shared/data/zonas.data';
import { SERVICIOS } from '../../../shared/data/servicios.data';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';

@Component({
  selector: 'app-zona-detail',
  imports: [RouterLink],
  templateUrl: './zona-detail.html',
  styleUrl: './zona-detail.scss'
})
export default class ZonaDetail implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  readonly contact = CONTACT_INFO;
  zona!: Zona;
  servicios = SERVICIOS;
  otrasZonas: Zona[] = [];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const found = ZONAS.find(z => z.slug === slug);
    if (!found) return;

    this.zona = found;
    this.otrasZonas = ZONAS.filter(z => z.slug !== slug).slice(0, 5);

    this.seo.updateSeo({
      title: `Plomero en ${this.zona.nombre}, Bogotá`,
      description: this.zona.descripcionSeo,
      keywords: this.zona.keywords,
      canonicalUrl: `/zonas/${slug}`
    });

    this.seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': `SEP Soluciones - Plomería en ${this.zona.nombre}`,
        'description': this.zona.descripcionSeo,
        'telephone': CONTACT_INFO.phoneFormatted,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Bogotá',
          'addressRegion': this.zona.nombre,
          'addressCountry': 'CO'
        },
        'areaServed': {
          '@type': 'AdministrativeArea',
          'name': `${this.zona.nombre}, Bogotá`
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Inicio',
            'item': 'https://www.sepsoluciones.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Zonas',
            'item': 'https://www.sepsoluciones.com/zonas'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': this.zona.nombre,
            'item': `https://www.sepsoluciones.com/zonas/${slug}`
          }
        ]
      }
    ]);
  }
}
