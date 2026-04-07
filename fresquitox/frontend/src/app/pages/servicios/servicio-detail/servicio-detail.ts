import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { SERVICIOS, Servicio } from '../../../shared/data/servicios.data';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';
import { DeliveryOptions } from '../../../shared/components/delivery-options/delivery-options';

@Component({
  selector: 'app-servicio-detail',
  imports: [RouterLink, DeliveryOptions],
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
    this.otrosServicios = SERVICIOS.filter(s => s.categoria === found.categoria && s.slug !== slug).slice(0, 5);

    this.seo.updateSeo({
      title: `${this.servicio.nombre} | Fresquitox`,
      description: this.servicio.descripcionSeo,
      keywords: this.servicio.keywords,
      canonicalUrl: `/productos/${slug}`
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': this.servicio.nombre,
      'description': this.servicio.descripcionSeo,
      'brand': { '@type': 'Brand', 'name': 'Fresquitox' },
      'offers': {
        '@type': 'Offer',
        'availability': 'https://schema.org/InStock',
        'areaServed': { '@type': 'City', 'name': 'Bogot\u00e1' }
      }
    });
  }
}
