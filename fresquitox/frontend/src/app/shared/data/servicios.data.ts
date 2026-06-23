export type CategoriaProducto = 'clasicos' | 'naturales' | 'premium';

export interface Servicio {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcionSeo: string;
  keywords: string;
  icono: string;
  idealPara: string[];
  contenido: string[];
  categoria: CategoriaProducto;
  precio?: string;
  emoji?: string;
}

export interface CategoriaInfo {
  id: CategoriaProducto;
  titulo: string;
  subtitulo: string;
  icono: string;
}

export const CATEGORIAS: CategoriaInfo[] = [
  { id: 'clasicos', titulo: 'Clásicos Fresquitox', subtitulo: 'Los favoritos de siempre, preparados al instante', icono: '🍧' },
  { id: 'naturales', titulo: 'Línea Natural', subtitulo: 'Frutas frescas, cero conservantes, sabor real', icono: '🍋' },
  { id: 'premium', titulo: 'Línea Premium', subtitulo: 'Experiencias únicas para ocasiones especiales', icono: '✨' },
];

/** Catálogo dinámico vía API — los productos se crean desde el admin */
export const SERVICIOS: Servicio[] = [];
