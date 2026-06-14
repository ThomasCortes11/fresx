-- ═══════════════════════════════════════════════════════════════════════════
-- FRESQUITOX — Datos iniciales (seed)
-- Migra catálogo estático, mesas, eventos y usuario admin
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ── Admin ─────────────────────────────────────────────────────────────────

INSERT INTO admin_usuarios (username, password_hash, nombre)
VALUES ('admin', crypt('admin123', gen_salt('bf')), 'Administrador Fresquitox');

-- ── Categorías ────────────────────────────────────────────────────────────

INSERT INTO categorias (id, titulo, subtitulo, icono, orden) VALUES
  ('clasicos',  'Clásicos Fresquitox', 'Los favoritos de siempre, preparados al instante', '🍧', 1),
  ('naturales', 'Línea Natural',       'Frutas frescas, cero conservantes, sabor real',    '🍋', 2),
  ('premium',   'Línea Premium',       'Experiencias únicas para ocasiones especiales',    '✨', 3);

-- ── Productos del catálogo (servicios.data.ts) ────────────────────────────

INSERT INTO productos (
  slug, nombre, descripcion_corta, descripcion_seo, keywords, contenido,
  categoria_id, precio_cop, icono, emoji, origen, activo, stock_actual, stock_minimo
) VALUES
(
  'granizados',
  'Granizados',
  'Hielo triturado con siropes artesanales de frutas naturales. El clásico Fresquitox que conquistó Chapinero.',
  'Granizados artesanales en Bogotá. Hielo triturado con siropes de frutas naturales. Pide a domicilio o visítanos en Chapinero. Fresquitox.',
  'granizados bogota, granizados artesanales, granizados chapinero',
  '["Nuestros granizados son el alma de Fresquitox.","Más de 15 sabores disponibles.","Preparados al momento frente a ti.","Tres tamaños: Personal, Mediano y Jumbo."]'::JSONB,
  'clasicos', 8000, '🍧', '🍧', 'catalogo', TRUE, 50, 10
),
(
  'raspados',
  'Raspados',
  'Hielo raspado suave con capas de sabor, frutas frescas y toppings irresistibles. Textura única.',
  'Raspados artesanales en Bogotá. Hielo raspado con frutas frescas y toppings. Pide a domicilio. Fresquitox.',
  'raspados bogota, raspados artesanales, raspados chapinero',
  '["Textura única de hielo raspado fino.","Más suave que el granizado.","Frutas frescas y toppings premium."]'::JSONB,
  'clasicos', 9000, '🧊', '🧊', 'catalogo', TRUE, 40, 10
),
(
  'jugos-naturales',
  'Jugos Naturales',
  'Frutas frescas licuadas al instante. Sin azúcar añadida, sin conservantes. Pura fruta.',
  'Jugos naturales en Bogotá. Frutas frescas licuadas al instante sin conservantes. Domicilio en Bogotá. Fresquitox.',
  'jugos naturales bogota, jugos frescos bogota',
  '["100% naturales preparados al instante.","Más de 20 opciones de frutas.","Con agua o leche, dulce a tu gusto."]'::JSONB,
  'naturales', 7000, '🍊', '🍊', 'catalogo', TRUE, 60, 15
),
(
  'limonadas',
  'Limonadas',
  'Limonadas artesanales con hierbabuena, coco, cerezada y más. Frescura en cada sorbo.',
  'Limonadas artesanales en Bogotá. Limonada de coco, cerezada, hierbabuena y más. Frescas y naturales. Fresquitox.',
  'limonadas bogota, limonada artesanal',
  '["Homenaje a la tradición colombiana.","Limonada natural, de coco, cerezada y más.","Agua purificada e hielo cristalino."]'::JSONB,
  'naturales', 6500, '🍋', '🍋', 'catalogo', TRUE, 55, 12
),
(
  'smoothies',
  'Smoothies',
  'Batidos cremosos de frutas con base de yogurt o leche vegetal. Energía natural en cada vaso.',
  'Smoothies naturales en Bogotá. Batidos de frutas con yogurt y superfoods. Saludables y deliciosos. Fresquitox.',
  'smoothies bogota, batidos frutas bogota',
  '["Cremosos y nutritivos.","Bases: yogurt, almendras, coco o agua.","Combinaciones estrella y proteína opcional."]'::JSONB,
  'naturales', 10000, '🥤', '🥤', 'catalogo', TRUE, 35, 8
),
(
  'cocteleria-sin-alcohol',
  'Coctelería Sin Alcohol',
  'Mocktails premium con frutas frescas, siropes artesanales y presentación de bar. Para brindar sin alcohol.',
  'Coctelería sin alcohol en Bogotá. Mocktails premium con frutas frescas para eventos y celebraciones. Fresquitox.',
  'mocktails bogota, cocteles sin alcohol bogota',
  '["Mocktails premium con presentación de bar.","Mojito de fresa, Piña Colada, Spritz de maracuyá.","Cristalería premium y garnish fresco."]'::JSONB,
  'premium', 12000, '🍹', '🍹', 'catalogo', TRUE, 25, 5
),
(
  'estacion-de-refrescos',
  'Estación de Refrescos',
  'Servicio completo de barra de refrescos para eventos: cumpleaños, empresariales, bodas y más.',
  'Estación de refrescos para eventos en Bogotá. Barra de granizados, jugos y smoothies para fiestas y corporativos. Fresquitox.',
  'barra refrescos eventos bogota, catering refrescos bogota',
  '["Barra completa Fresquitox en tu evento.","Personal capacitado y menú personalizado.","Paquetes desde 50 hasta 500+ personas."]'::JSONB,
  'premium', 0, '🎪', '🎪', 'catalogo', TRUE, 999, 0
),
(
  'fresquitox-con-licor',
  'Fresquitox con Licor',
  'Nuestros clásicos granizados y raspados con un shot de tu licor favorito. Solo para mayores de 18.',
  'Granizados y raspados con licor en Bogotá. Cocteles frozen artesanales. Solo mayores de 18. Fresquitox.',
  'granizados con licor bogota, cocteles frozen bogota',
  '["Versión adulta de tus favoritos.","Granizado con vodka, raspado con ron y más.","Solo mayores de 18 años."]'::JSONB,
  'premium', 14000, '🥂', '🥂', 'catalogo', TRUE, 30, 5
);

-- ideal_para por producto
INSERT INTO producto_ideal_para (producto_id, texto, orden)
SELECT p.id, t.texto, t.orden
FROM productos p
JOIN (VALUES
  ('granizados',              'Tardes calurosas',        1),
  ('granizados',              'Reuniones con amigos',    2),
  ('granizados',              'Antojo rápido',           3),
  ('raspados',                'Experiencia refrescante', 1),
  ('raspados',                'Compartir en pareja',     2),
  ('raspados',                'Después del gym',         3),
  ('jugos-naturales',         'Desayunos saludables',    1),
  ('jugos-naturales',         'Post-entrenamiento',      2),
  ('jugos-naturales',         'Cualquier hora del día',  3),
  ('limonadas',               'Almuerzos',               1),
  ('limonadas',               'Eventos',                 2),
  ('limonadas',               'Cualquier momento',       3),
  ('smoothies',               'Pre/post entreno',        1),
  ('smoothies',               'Snack saludable',         2),
  ('smoothies',               'Desayuno rápido',         3),
  ('cocteleria-sin-alcohol',  'Eventos corporativos',    1),
  ('cocteleria-sin-alcohol',  'Fiestas',                 2),
  ('cocteleria-sin-alcohol',  'Cenas especiales',        3),
  ('estacion-de-refrescos',   'Cumpleaños',              1),
  ('estacion-de-refrescos',   'Eventos corporativos',    2),
  ('estacion-de-refrescos',   'Bodas',                   3),
  ('estacion-de-refrescos',   'Ferias',                  4),
  ('fresquitox-con-licor',    'Noches de viernes',       1),
  ('fresquitox-con-licor',    'Celebraciones',           2),
  ('fresquitox-con-licor',    'After office',            3)
) AS t(slug, texto, orden) ON p.slug = t.slug;

-- Etiquetas de ejemplo en productos populares
INSERT INTO producto_etiquetas (producto_id, etiqueta)
SELECT id, 'popular'::producto_etiqueta FROM productos WHERE slug IN ('granizados', 'jugos-naturales');

INSERT INTO producto_etiquetas (producto_id, etiqueta)
SELECT id, 'nuevo'::producto_etiqueta FROM productos WHERE slug = 'cocteleria-sin-alcohol';

-- ── Mesas (mesas.service.ts defaults) ─────────────────────────────────────

INSERT INTO mesas (codigo, numero, nombre, activa) VALUES
  ('m1', 1, 'Mesa 1', TRUE),
  ('m2', 2, 'Mesa 2', TRUE),
  ('m3', 3, 'Mesa 3', TRUE),
  ('m4', 4, 'Barra',  TRUE);

-- ── Eventos (eventos.service.ts defaults) ─────────────────────────────────

INSERT INTO eventos (codigo, titulo, fecha, hora, tipo, artista, descripcion, emoji, destacado, activo) VALUES
(
  'ev1', 'Noche de DJ — Tropical House', '2026-06-07', '7:00 PM - 11:00 PM',
  'dj', 'DJ Fresqui',
  'Beats tropicales mezclados con lo mejor del house mientras disfrutas granizados con licor bajo las luces.',
  '🎧', TRUE, TRUE
),
(
  'ev2', 'Acústico en Vivo — Vallenato Fusión', '2026-06-13', '6:00 PM - 9:00 PM',
  'musica-en-vivo', 'Los Refrescantes',
  'Vallenato fusionado con pop y bossa nova. Música suave para acompañar tus jugos y smoothies al atardecer.',
  '🎸', FALSE, TRUE
),
(
  'ev3', 'Karaoke Night — ¡Canta y Refresca!', '2026-06-20', '7:00 PM - 10:00 PM',
  'karaoke', 'Micrófono abierto',
  'Sube al escenario, canta tu favorita y gana granizados gratis. El público vota por el mejor.',
  '🎤', FALSE, TRUE
),
(
  'ev4', 'Noche Especial — Lanzamiento Nuevos Sabores', '2026-06-27', '5:00 PM - 10:00 PM',
  'especial', 'Equipo Fresquitox',
  'Sé de los primeros en probar nuestros nuevos sabores de temporada. Degustación gratuita, DJ en vivo y sorpresas.',
  '✨', FALSE, TRUE
);

-- ── Movimientos financieros de ejemplo ────────────────────────────────────

INSERT INTO movimientos_financieros (tipo, concepto, monto_cop, categoria, notas, fecha) VALUES
  ('ingreso', 'Venta del día — granizados', 245000, 'venta', 'Estimado manual', NOW() - INTERVAL '2 days'),
  ('gasto',   'Compra de frutas',           85000,  'ingredientes', 'Mercado de Paloquemao', NOW() - INTERVAL '3 days'),
  ('gasto',   'Vasos y popotes',            32000,  'suministros', 'Proveedor local', NOW() - INTERVAL '5 days'),
  ('ingreso', 'Evento karaoke',             180000, 'venta', 'Noche de karaoke', NOW() - INTERVAL '7 days');

-- ── Pedido de ejemplo (mesa 1) ────────────────────────────────────────────

WITH m AS (SELECT id FROM mesas WHERE codigo = 'm1'),
     p1 AS (SELECT id, nombre, precio_cop FROM productos WHERE slug = 'granizados'),
     p2 AS (SELECT id, nombre, precio_cop FROM productos WHERE slug = 'limonadas'),
     ins AS (
       INSERT INTO pedidos (codigo, mesa_id, estado, notas)
       SELECT 'p-demo-001', m.id, 'preparando', 'Sin hielo extra'
       FROM m
       RETURNING id
     )
INSERT INTO pedido_items (pedido_id, producto_id, nombre_snapshot, precio_cop, cantidad)
SELECT ins.id, p1.id, p1.nombre, p1.precio_cop, 2 FROM ins, p1
UNION ALL
SELECT ins.id, p2.id, p2.nombre, p2.precio_cop, 1 FROM ins, p2;

COMMIT;
