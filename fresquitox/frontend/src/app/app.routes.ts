import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home'),
    title: 'SEP Soluciones Élite | Plomería Profesional en Bogotá — Emergencias 24/7'
  },
  {
    path: 'servicios',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/servicios/servicios-list/servicios-list'),
        title: 'Servicios de Plomería en Bogotá | SEP Soluciones Élite'
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
        title: 'Zonas de Cobertura en Bogotá | SEP Soluciones Élite'
      },
      {
        path: ':slug',
        loadComponent: () => import('./pages/zonas/zona-detail/zona-detail')
      }
    ]
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/nosotros/nosotros'),
    title: 'Nosotros — Empresa de Plomería en Bogotá | SEP Soluciones Élite'
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto'),
    title: 'Contacto — Plomero en Bogotá 24/7 | SEP Soluciones Élite'
  },
  {
    path: 'blog',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/blog/blog-list/blog-list'),
        title: 'Blog de Plomería — Consejos y Guías | SEP Soluciones Élite'
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
    title: 'Preguntas Frecuentes sobre Plomería | SEP Soluciones Élite'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found'),
    title: 'Página No Encontrada (404) | SEP Soluciones Élite'
  }
];
