import type Database from 'better-sqlite3';
import { newId } from './id';

type ProductSeed = {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcionSeo: string;
  keywords: string;
  contenido: string[];
  categoria: 'clasicos' | 'naturales' | 'premium';
  precioCop: number;
  icono: string;
  emoji: string;
  stock: number;
  stockMinimo: number;
  idealPara: string[];
  etiquetas?: string[];
};

const CATALOG: ProductSeed[] = [
  {
    slug: 'granizados',
    nombre: 'Granizados',
    descripcionCorta: 'Hielo triturado con siropes artesanales de frutas naturales.',
    descripcionSeo: 'Granizados artesanales en Bogotá. Fresquitox.',
    keywords: 'granizados bogota',
    contenido: ['El alma de Fresquitox.', 'Más de 15 sabores.', 'Preparados al momento.'],
    categoria: 'clasicos',
    precioCop: 8000,
    icono: '🍧',
    emoji: '🍧',
    stock: 50,
    stockMinimo: 10,
    idealPara: ['Tardes calurosas', 'Reuniones con amigos', 'Antojo rápido'],
    etiquetas: ['popular'],
  },
  {
    slug: 'raspados',
    nombre: 'Raspados',
    descripcionCorta: 'Hielo raspado suave con capas de sabor y toppings.',
    descripcionSeo: 'Raspados artesanales en Bogotá.',
    keywords: 'raspados bogota',
    contenido: ['Textura única.', 'Más suave que el granizado.'],
    categoria: 'clasicos',
    precioCop: 9000,
    icono: '🧊',
    emoji: '🧊',
    stock: 40,
    stockMinimo: 10,
    idealPara: ['Experiencia refrescante', 'Compartir en pareja'],
  },
  {
    slug: 'jugos-naturales',
    nombre: 'Jugos Naturales',
    descripcionCorta: 'Frutas frescas licuadas al instante. Pura fruta.',
    descripcionSeo: 'Jugos naturales en Bogotá.',
    keywords: 'jugos naturales bogota',
    contenido: ['100% naturales.', 'Más de 20 opciones.'],
    categoria: 'naturales',
    precioCop: 7000,
    icono: '🍊',
    emoji: '🍊',
    stock: 60,
    stockMinimo: 15,
    idealPara: ['Desayunos saludables', 'Post-entrenamiento'],
    etiquetas: ['popular'],
  },
  {
    slug: 'limonadas',
    nombre: 'Limonadas',
    descripcionCorta: 'Limonadas artesanales con hierbabuena, coco y más.',
    descripcionSeo: 'Limonadas artesanales en Bogotá.',
    keywords: 'limonadas bogota',
    contenido: ['Tradición colombiana.', 'Variedad de sabores.'],
    categoria: 'naturales',
    precioCop: 6500,
    icono: '🍋',
    emoji: '🍋',
    stock: 55,
    stockMinimo: 12,
    idealPara: ['Almuerzos', 'Eventos'],
  },
  {
    slug: 'smoothies',
    nombre: 'Smoothies',
    descripcionCorta: 'Batidos cremosos con yogurt o leche vegetal.',
    descripcionSeo: 'Smoothies naturales en Bogotá.',
    keywords: 'smoothies bogota',
    contenido: ['Cremosos y nutritivos.', 'Bases saludables.'],
    categoria: 'naturales',
    precioCop: 10000,
    icono: '🥤',
    emoji: '🥤',
    stock: 35,
    stockMinimo: 8,
    idealPara: ['Pre/post entreno', 'Snack saludable'],
  },
  {
    slug: 'cocteleria-sin-alcohol',
    nombre: 'Coctelería Sin Alcohol',
    descripcionCorta: 'Mocktails premium con frutas frescas.',
    descripcionSeo: 'Coctelería sin alcohol en Bogotá.',
    keywords: 'mocktails bogota',
    contenido: ['Presentación de bar.', 'Mocktails premium.'],
    categoria: 'premium',
    precioCop: 12000,
    icono: '🍹',
    emoji: '🍹',
    stock: 25,
    stockMinimo: 5,
    idealPara: ['Eventos corporativos', 'Fiestas'],
    etiquetas: ['nuevo'],
  },
  {
    slug: 'estacion-de-refrescos',
    nombre: 'Estación de Refrescos',
    descripcionCorta: 'Barra de refrescos para eventos y celebraciones.',
    descripcionSeo: 'Estación de refrescos para eventos en Bogotá.',
    keywords: 'barra refrescos eventos bogota',
    contenido: ['Barra completa Fresquitox.', 'Paquetes para eventos.'],
    categoria: 'premium',
    precioCop: 0,
    icono: '🎪',
    emoji: '🎪',
    stock: 999,
    stockMinimo: 0,
    idealPara: ['Cumpleaños', 'Eventos corporativos', 'Bodas'],
  },
  {
    slug: 'fresquitox-con-licor',
    nombre: 'Fresquitox con Licor',
    descripcionCorta: 'Clásicos con shot de licor. Solo +18.',
    descripcionSeo: 'Granizados con licor en Bogotá.',
    keywords: 'granizados con licor bogota',
    contenido: ['Versión adulta.', 'Solo mayores de 18.'],
    categoria: 'premium',
    precioCop: 14000,
    icono: '🥂',
    emoji: '🥂',
    stock: 30,
    stockMinimo: 5,
    idealPara: ['Noches de viernes', 'Celebraciones'],
  },
];

export function seedIfEmpty(db: Database.Database): void {
  const count = db.prepare('SELECT COUNT(*) AS n FROM productos').get() as { n: number };
  if (count.n > 0) return;

  const insertCat = db.prepare(`
    INSERT INTO categorias (id, titulo, subtitulo, icono, orden) VALUES (?, ?, ?, ?, ?)
  `);
  insertCat.run('clasicos', 'Clásicos Fresquitox', 'Los favoritos de siempre', '🍧', 1);
  insertCat.run('naturales', 'Línea Natural', 'Frutas frescas, cero conservantes', '🍋', 2);
  insertCat.run('premium', 'Línea Premium', 'Experiencias únicas', '✨', 3);

  const insertProd = db.prepare(`
    INSERT INTO productos (
      id, slug, nombre, descripcion_corta, descripcion_seo, keywords, contenido,
      categoria_id, precio_cop, icono, emoji, origen, activo, stock_actual, stock_minimo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'catalogo', 1, ?, ?)
  `);
  const insertTag = db.prepare(`INSERT INTO producto_etiquetas (producto_id, etiqueta) VALUES (?, ?)`);
  const insertIdeal = db.prepare(`INSERT INTO producto_ideal_para (producto_id, texto, orden) VALUES (?, ?, ?)`);

  for (const p of CATALOG) {
    const id = newId('prod');
    insertProd.run(
      id, p.slug, p.nombre, p.descripcionCorta, p.descripcionSeo, p.keywords,
      JSON.stringify(p.contenido), p.categoria, p.precioCop, p.icono, p.emoji,
      p.stock, p.stockMinimo
    );
    for (const tag of p.etiquetas ?? []) insertTag.run(id, tag);
    p.idealPara.forEach((t, i) => insertIdeal.run(id, t, i));
  }

  const insertMesa = db.prepare(`INSERT INTO mesas (id, codigo, numero, nombre) VALUES (?, ?, ?, ?)`);
  insertMesa.run('m1', 'm1', 1, 'Mesa 1');
  insertMesa.run('m2', 'm2', 2, 'Mesa 2');
  insertMesa.run('m3', 'm3', 3, 'Mesa 3');
  insertMesa.run('m4', 'm4', 4, 'Barra');

  const insertEv = db.prepare(`
    INSERT INTO eventos (id, codigo, titulo, fecha, hora, tipo, artista, descripcion, emoji, destacado, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  insertEv.run('ev1', 'ev1', 'Noche de DJ — Tropical House', '2026-06-07', '7:00 PM - 11:00 PM',
    'dj', 'DJ Fresqui', 'Beats tropicales y house.', '🎧', 1);
  insertEv.run('ev2', 'ev2', 'Acústico en Vivo — Vallenato Fusión', '2026-06-13', '6:00 PM - 9:00 PM',
    'musica-en-vivo', 'Los Refrescantes', 'Música suave al atardecer.', '🎸', 0);
  insertEv.run('ev3', 'ev3', 'Karaoke Night', '2026-06-20', '7:00 PM - 10:00 PM',
    'karaoke', 'Micrófono abierto', 'Canta y gana granizados.', '🎤', 0);
  insertEv.run('ev4', 'ev4', 'Lanzamiento Nuevos Sabores', '2026-06-27', '5:00 PM - 10:00 PM',
    'especial', 'Equipo Fresquitox', 'Degustación y DJ en vivo.', '✨', 0);

  const insertMov = db.prepare(`
    INSERT INTO movimientos_financieros (id, tipo, concepto, monto_cop, categoria, notas, fecha)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);
  insertMov.run(newId('mov'), 'ingreso', 'Venta del día — granizados', 245000, 'venta', 'Estimado', '-2 days');
  insertMov.run(newId('mov'), 'gasto', 'Compra de frutas', 85000, 'ingredientes', 'Mercado', '-3 days');
}
