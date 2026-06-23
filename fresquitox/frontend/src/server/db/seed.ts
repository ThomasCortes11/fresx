import type Database from 'better-sqlite3';
import { newId } from './id';

export function seedIfEmpty(db: Database.Database): void {
  seedCategorias(db);
  seedMesas(db);
  seedEventos(db);
  seedMovimientosDemo(db);
}

function seedCategorias(db: Database.Database): void {
  const count = db.prepare('SELECT COUNT(*) AS n FROM categorias').get() as { n: number };
  if (count.n > 0) return;

  const insert = db.prepare(`
    INSERT INTO categorias (id, titulo, subtitulo, icono, orden) VALUES (?, ?, ?, ?, ?)
  `);
  insert.run('clasicos', 'Clásicos Fresquitox', 'Los favoritos de siempre', '🍧', 1);
  insert.run('naturales', 'Línea Natural', 'Frutas frescas, cero conservantes', '🍋', 2);
  insert.run('premium', 'Línea Premium', 'Experiencias únicas', '✨', 3);
}

function seedMesas(db: Database.Database): void {
  const count = db.prepare('SELECT COUNT(*) AS n FROM mesas').get() as { n: number };
  if (count.n > 0) return;

  const insert = db.prepare(`INSERT INTO mesas (id, codigo, numero, nombre) VALUES (?, ?, ?, ?)`);
  insert.run('m1', 'm1', 1, 'Mesa 1');
  insert.run('m2', 'm2', 2, 'Mesa 2');
  insert.run('m3', 'm3', 3, 'Mesa 3');
  insert.run('m4', 'm4', 4, 'Barra');
}

function seedEventos(db: Database.Database): void {
  const count = db.prepare('SELECT COUNT(*) AS n FROM eventos').get() as { n: number };
  if (count.n > 0) return;

  const insert = db.prepare(`
    INSERT INTO eventos (id, codigo, titulo, fecha, hora, tipo, artista, descripcion, emoji, destacado, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  insert.run('ev1', 'ev1', 'Noche de DJ — Tropical House', '2026-06-07', '7:00 PM - 11:00 PM',
    'dj', 'DJ Fresqui', 'Beats tropicales y house.', '🎧', 1);
  insert.run('ev2', 'ev2', 'Acústico en Vivo — Vallenato Fusión', '2026-06-13', '6:00 PM - 9:00 PM',
    'musica-en-vivo', 'Los Refrescantes', 'Música suave al atardecer.', '🎸', 0);
  insert.run('ev3', 'ev3', 'Karaoke Night', '2026-06-20', '7:00 PM - 10:00 PM',
    'karaoke', 'Micrófono abierto', 'Canta y gana granizados.', '🎤', 0);
  insert.run('ev4', 'ev4', 'Lanzamiento Nuevos Sabores', '2026-06-27', '5:00 PM - 10:00 PM',
    'especial', 'Equipo Fresquitox', 'Degustación y DJ en vivo.', '✨', 0);
}

function seedMovimientosDemo(db: Database.Database): void {
  const count = db.prepare('SELECT COUNT(*) AS n FROM movimientos_financieros').get() as { n: number };
  if (count.n > 0) return;

  const insert = db.prepare(`
    INSERT INTO movimientos_financieros (id, tipo, concepto, monto_cop, categoria, notas, fecha)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);
  insert.run(newId('mov'), 'ingreso', 'Venta del día — granizados', 245000, 'venta', 'Estimado', '-2 days');
  insert.run(newId('mov'), 'gasto', 'Compra de frutas', 85000, 'ingredientes', 'Mercado', '-3 days');
}
