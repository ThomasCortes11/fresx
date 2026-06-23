import { RenderMode, ServerRoute } from '@angular/ssr';
import { ZONAS } from './shared/data/zonas.data';
import { BLOG_POSTS } from './shared/data/blog.data';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'productos', renderMode: RenderMode.Client },
  { path: 'productos/:slug', renderMode: RenderMode.Client },
  { path: 'zonas', renderMode: RenderMode.Prerender },
  {
    path: 'zonas/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return ZONAS.map(z => ({ slug: z.slug }));
    }
  },
  { path: 'nosotros', renderMode: RenderMode.Prerender },
  { path: 'experiencia', renderMode: RenderMode.Prerender },
  { path: 'eventos', renderMode: RenderMode.Prerender },
  { path: 'contacto', renderMode: RenderMode.Prerender },
  { path: 'blog', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return BLOG_POSTS.map(p => ({ slug: p.slug }));
    }
  },
  { path: 'preguntas-frecuentes', renderMode: RenderMode.Prerender },
  { path: 'mesa/:numero', renderMode: RenderMode.Client },
  { path: 'admin/login', renderMode: RenderMode.Client },
  { path: 'admin/dashboard', renderMode: RenderMode.Client },
  { path: 'admin/productos', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server }
];
