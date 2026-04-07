import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SeoService } from '../../../core/services/seo.service';
import { BLOG_POSTS, BlogPost } from '../../../shared/data/blog.data';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';
import { DeliveryOptions } from '../../../shared/components/delivery-options/delivery-options';


interface ContentBlock {
  type: 'paragraph' | 'list' | 'section';
  html?: string;
  heading?: string;
  body?: string;
  items?: string[];
}

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink, DeliveryOptions],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'bd-page' }
})
export default class BlogDetail implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly contact = CONTACT_INFO;
  post!: BlogPost;
  otrosPosts: BlogPost[] = [];
  contentBlocks: ContentBlock[] = [];
  readProgress = 0;
  readingTime = 0;

  private readonly MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  private scrollHandler: (() => void) | null = null;

  constructor() {
    afterNextRender(() => {
      this.initScrollAnimations();
      this.initProgressBar();
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const slug = params.get('slug')!;
      this.loadPost(slug);
    });
  }

  private loadPost(slug: string): void {
    const found = BLOG_POSTS.find(p => p.slug === slug);
    if (!found) return;

    this.post = found;
    this.otrosPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 5);
    this.contentBlocks = this.processContent(found.contenido);
    this.readingTime = Math.ceil(found.contenido.join(' ').split(/\s+/).length / 200);
    this.readProgress = 0;

    this.seo.updateSeo({
      title: this.post.titulo + ' | Fresquitox',
      description: this.post.descripcionSeo,
      keywords: this.post.keywords,
      canonicalUrl: `/blog/${slug}`,
      ogType: 'article'
    });

    this.seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': this.post.titulo,
        'description': this.post.descripcionSeo,
        'datePublished': this.post.fecha,
        'author': { '@type': 'Organization', 'name': 'Fresquitox' },
        'publisher': { '@type': 'Organization', 'name': 'Fresquitox', 'url': 'https://www.fresquitox.com' }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://www.fresquitox.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://www.fresquitox.com/blog' },
          { '@type': 'ListItem', 'position': 3, 'name': this.post.titulo, 'item': `https://www.fresquitox.com/blog/${slug}` }
        ]
      }
    ]);

    // Scroll to top on navigation
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0 });
    }
  }

  formatDate(fecha: string): string {
    const [y, m, d] = fecha.split('-');
    return `${parseInt(d)} ${this.MONTHS[parseInt(m) - 1]} ${y}`;
  }

  private processContent(content: string[]): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    let listItems: string[] = [];

    for (const text of content) {
      if (text.startsWith('•')) {
        listItems.push(this.parseMd(text.substring(1).trim()));
        continue;
      }

      if (listItems.length) {
        blocks.push({ type: 'list', items: [...listItems] });
        listItems = [];
      }

      const headingMatch = text.match(/^\*\*(.*?)\*\*[:\s]*([\s\S]*)/);
      if (headingMatch) {
        const heading = headingMatch[1].replace(/:$/, '');
        const body = headingMatch[2].trim();
        blocks.push({ type: 'section', heading, body: body ? this.parseMd(body) : undefined });
      } else {
        blocks.push({ type: 'paragraph', html: this.parseMd(text) });
      }
    }

    if (listItems.length) blocks.push({ type: 'list', items: [...listItems] });
    return blocks;
  }

  private parseMd(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  private initScrollAnimations(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    this.el.nativeElement.querySelectorAll('.bd-anim').forEach((el: Element) => observer.observe(el));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private initProgressBar(): void {
    const handler = () => {
      const body = this.el.nativeElement.querySelector('.bd-body');
      if (!body) return;
      const rect = body.getBoundingClientRect();
      const total = body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      this.readProgress = Math.min(100, Math.max(0, (-rect.top / total) * 100));
    };
    window.addEventListener('scroll', handler, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('scroll', handler));
  }
}
