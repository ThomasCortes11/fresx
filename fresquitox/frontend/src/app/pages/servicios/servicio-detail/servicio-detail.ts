import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../core/services/seo.service';
import { SERVICIOS, Servicio, CategoriaProducto } from '../../../shared/data/servicios.data';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';
import { DeliveryOptions } from '../../../shared/components/delivery-options/delivery-options';
import { ProductosService, ProductoAdmin } from '../../../core/services/productos.service';

@Component({
  selector: 'app-servicio-detail',
  imports: [RouterLink, DeliveryOptions],
  templateUrl: './servicio-detail.html',
  styleUrl: './servicio-detail.scss'
})
export default class ServicioDetail implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly productosSvc = inject(ProductosService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly contact = CONTACT_INFO;
  servicio!: Servicio;
  otrosServicios: Servicio[] = [];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const estatico = SERVICIOS.find((s) => s.slug === slug);

    if (estatico) {
      this.aplicarServicio(estatico, slug);
    }

    if (isPlatformBrowser(this.platformId)) {
      this.productosSvc.getBySlug(slug).subscribe((p) => {
        if (p) this.aplicarServicio(this.toServicio(p), slug);
      });
      this.productosSvc.loadActivos().subscribe((list) => {
        const found = list.find((p) => p.slug === slug);
        if (found) {
          this.aplicarServicio(this.toServicio(found), slug);
          this.otrosServicios = list
            .filter((s) => s.categoria === found.categoria && s.slug !== slug)
            .slice(0, 5)
            .map((s) => this.toServicio(s));
        }
      });
    }
  }

  private aplicarServicio(servicio: Servicio, slug: string): void {
    this.servicio = servicio;
    this.seo.updateSeo({
      title: `${servicio.nombre} | Fresquitox`,
      description: servicio.descripcionSeo,
      keywords: servicio.keywords,
      canonicalUrl: `/productos/${slug}`,
    });
    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: servicio.nombre,
      description: servicio.descripcionSeo,
      brand: { '@type': 'Brand', name: 'Fresquitox' },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        areaServed: { '@type': 'City', name: 'Bogotá' },
      },
    });
  }

  private toServicio(p: ProductoAdmin): Servicio {
    return {
      slug: p.slug,
      nombre: p.nombre,
      descripcionCorta: p.descripcionCorta,
      descripcionSeo: p.descripcionSeo ?? p.descripcionCorta,
      keywords: p.keywords ?? '',
      icono: p.icono,
      emoji: p.emoji,
      idealPara: p.idealPara,
      contenido: p.contenido ?? [],
      categoria: p.categoria as CategoriaProducto,
      precio: p.precio,
    };
  }
}
