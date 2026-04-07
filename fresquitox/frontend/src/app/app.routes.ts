import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home'),
    title: 'Fresquitox | Refrescos Naturales en Bogotá — Pedidos a Domicilio'
  },
  {
    path: 'productos',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/servicios/servicios-list/servicios-list'),
        title: 'Productos | Fresquitox — Granizados, Jugos y Más'
      },
      {
        path: ':slug',
        loadComponent: () => import('./pages/servicios/servicio-detail/servicio-detail')
      }
    ]
  },
  {
    path: 'zonas',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/zonas/zonas-list/zonas-list'),
        title: 'Zonas de Entrega en Bogotá | Fresquitox'
      },
      {
        path: ':slug',
        loadComponent: () => import('./pages/zonas/zona-detail/zona-detail')
      }
    ]
  },
  {
    path: 'experiencia',
    loadComponent: () => import('./pages/experiencia/experiencia'),
    title: 'Experiencia | Fresquitox — Sabores que Despiertan Emociones'
  },
  {
    path: 'eventos',
    loadComponent: () => import('./pages/eventos/eventos'),
    title: 'Eventos y Música en Vivo | Fresquitox Chapinero'
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/nosotros/nosotros'),
    title: 'Nosotros — Nuestra Historia | Fresquitox'
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto'),
    title: 'Contacto | Fresquitox — Pedidos y Eventos'
  },
  {
    path: 'blog',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/blog/blog-list/blog-list'),
        title: 'Blog | Fresquitox'
      },
      {
        path: ':slug',
        loadComponent: () => import('./pages/blog/blog-detail/blog-detail')
      }
    ]
  },
  {
    path: 'preguntas-frecuentes',
    loadComponent: () => import('./pages/preguntas-frecuentes/preguntas-frecuentes'),
    title: 'Preguntas Frecuentes | Fresquitox'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found'),
    title: 'Página No Encontrada (404) | Fresquitox'
  }
];
