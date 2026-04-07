import { RenderMode, ServerRoute } from '@angular/ssr';
import { SERVICIOS } from './shared/data/servicios.data';
import { ZONAS } from './shared/data/zonas.data';
import { BLOG_POSTS } from './shared/data/blog.data';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'productos', renderMode: RenderMode.Prerender },
  {
    path: 'productos/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return SERVICIOS.map(s => ({ slug: s.slug }));
    }
  },
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
  { path: '**', renderMode: RenderMode.Server }
];
