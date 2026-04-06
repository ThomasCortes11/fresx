import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  robots?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);

  private readonly baseUrl = 'https://www.sepsoluciones.com';
  private readonly defaultImage = `${this.baseUrl}/images/og/logosepsolucionesblancoynegro.webp`;
  private readonly siteName = 'SEP Soluciones Élite';

  updateSeo(config: SeoConfig): void {
    const fullTitle = `${config.title} | ${this.siteName}`;
    this.titleService.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: config.description });

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    this.meta.updateTag({ name: 'robots', content: config.robots ?? 'index, follow' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: config.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:image', content: config.ogImage ?? this.defaultImage });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: config.title });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:locale', content: 'es_CO' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.ogImage ?? this.defaultImage });
    this.meta.updateTag({ name: 'twitter:image:alt', content: config.title });
    this.meta.updateTag({ name: 'twitter:image:alt', content: config.title });

    // Canonical URL
    this.updateCanonicalUrl(config.canonicalUrl ?? '');
  }

  private updateCanonicalUrl(path: string): void {
    const url = `${this.baseUrl}${path}`;
    this.meta.updateTag({ property: 'og:url', content: url });

    // Canonical URL
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);

    // Hreflang es-CO
    let hreflangES: HTMLLinkElement | null = this.document.querySelector('link[rel="alternate"][hreflang="es-CO"]');
    if (!hreflangES) {
      hreflangES = this.document.createElement('link');
      hreflangES.setAttribute('rel', 'alternate');
      hreflangES.setAttribute('hreflang', 'es-CO');
      this.document.head.appendChild(hreflangES);
    }
    hreflangES.setAttribute('href', url);

    // Hreflang x-default
    let hreflangDefault: HTMLLinkElement | null = this.document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (!hreflangDefault) {
      hreflangDefault = this.document.createElement('link');
      hreflangDefault.setAttribute('rel', 'alternate');
      hreflangDefault.setAttribute('hreflang', 'x-default');
      this.document.head.appendChild(hreflangDefault);
    }
    hreflangDefault.setAttribute('href', url);
  }

  setJsonLd(schema: object | object[]): void {
    this.removeJsonLd();

    const schemas = Array.isArray(schema) ? schema : [schema];
    for (const s of schemas) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(s);
      this.document.head.appendChild(script);
    }
  }

  removeJsonLd(): void {
    const scripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(s => s.remove());
  }
}
