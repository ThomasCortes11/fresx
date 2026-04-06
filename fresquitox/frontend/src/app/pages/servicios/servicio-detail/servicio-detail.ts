import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { SERVICIOS, Servicio } from '../../../shared/data/servicios.data';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';

@Component({
  selector: 'app-servicio-detail',
  imports: [RouterLink],
  templateUrl: './servicio-detail.html',
  styleUrl: './servicio-detail.scss'
})
export default class ServicioDetail implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  readonly contact = CONTACT_INFO;
  servicio!: Servicio;
  otrosServicios: Servicio[] = [];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const found = SERVICIOS.find(s => s.slug === slug);
    if (!found) return;

    this.servicio = found;
    this.otrosServicios = SERVICIOS
      .filter(s => s.categoria === found.categoria && s.slug !== slug)
      .slice(0, 5);

    this.seo.updateSeo({
      title: `${this.servicio.nombre} en Bogotá`,
      description: this.servicio.descripcionSeo,
      keywords: this.servicio.keywords,
      canonicalUrl: `/servicios/${slug}`
    });

    this.seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': this.servicio.nombre,
        'description': this.servicio.descripcionSeo,
        'provider': {
          '@type': 'LocalBusiness',
          'name': 'SEP Soluciones',
          'telephone': CONTACT_INFO.phoneFormatted,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Bogotá',
            'addressCountry': 'CO'
          }
        },
        'areaServed': {
          '@type': 'City',
          'name': 'Bogotá'
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
            'name': 'Servicios',
            'item': 'https://www.sepsoluciones.com/servicios'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': this.servicio.nombre,
            'item': `https://www.sepsoluciones.com/servicios/${slug}`
          }
        ]
      }
    ]);
  }
}
