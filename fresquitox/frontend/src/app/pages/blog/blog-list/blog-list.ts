import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { BLOG_POSTS } from '../../../shared/data/blog.data';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss'
})
export default class BlogList implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly posts = BLOG_POSTS;

  private readonly MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  constructor() {
    afterNextRender(() => this.initScrollAnimations());
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Blog de Plomería en Bogotá – Consejos y Guías | SEP Soluciones',
      description: 'Blog de plomería con consejos, guías y tips para el cuidado de las tuberías de su hogar en Bogotá. Información profesional de SEP Soluciones.',
      keywords: 'blog plomeria, consejos plomeria, tips plomeria bogota, guias plomeria hogar, como destapar tuberias, como detectar fugas, mantenimiento plomeria, blog plomeria profesional bogota',
      canonicalUrl: '/blog'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Blog de Plomería',
      'description': 'Artículos sobre consejos, guías y tips para el cuidado de las tuberías',
      'itemListElement': this.posts.map((post, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': post.titulo,
        'url': `https://www.sepsoluciones.com/blog/${post.slug}`,
        'datePublished': post.fecha,
        'description': post.extracto
      }))
    });
  }

  formatDate(fecha: string): string {
    const [y, m, d] = fecha.split('-');
    return `${parseInt(d)} ${this.MONTHS[parseInt(m) - 1]} ${y}`;
  }

  private initScrollAnimations(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    this.el.nativeElement.querySelectorAll('[data-animate]').forEach((el: Element) => observer.observe(el));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
