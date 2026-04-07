import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { CONTACT_INFO } from '../../shared/constants/contact-info';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export default class NotFound implements OnInit {
  private readonly seo = inject(SeoService);
  readonly contact = CONTACT_INFO;

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Página No Encontrada (404)',
      description: 'Lo sentimos, la página que buscas no existe. Visita nuestros productos de refrescos naturales en Bogotá o contáctanos.',
      robots: 'noindex, nofollow',
      canonicalUrl: '/404'
    });
  }
}
