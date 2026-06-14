-- ═══════════════════════════════════════════════════════════════════════════
-- FRESQUITOX — Vistas y consultas de reportes
-- Usadas por el dashboard admin (tab Reportes + Resumen)
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ── Alertas de inventario ─────────────────────────────────────────────────

CREATE OR REPLACE VIEW v_inventario_alertas AS
SELECT
  p.id,
  p.slug,
  p.nombre,
  p.categoria_id,
  p.stock_actual,
  p.stock_minimo,
  CASE
    WHEN p.stock_actual = 0 THEN 'agotado'
    WHEN p.stock_actual <= p.stock_minimo THEN 'bajo'
    ELSE 'ok'
  END AS nivel_alerta,
  p.precio_cop,
  p.activo
FROM productos p
WHERE p.activo = TRUE
  AND (p.stock_actual = 0 OR p.stock_actual <= p.stock_minimo)
ORDER BY
  CASE WHEN p.stock_actual = 0 THEN 0 ELSE 1 END,
  p.stock_actual ASC;

-- ── Resumen financiero mensual ────────────────────────────────────────────

CREATE OR REPLACE VIEW v_resumen_mensual AS
SELECT
  DATE_TRUNC('month', fecha AT TIME ZONE 'America/Bogota')::DATE AS mes,
  TO_CHAR(DATE_TRUNC('month', fecha AT TIME ZONE 'America/Bogota'), 'TMMonth YYYY') AS mes_label,
  COALESCE(SUM(monto_cop) FILTER (WHERE tipo = 'ingreso'), 0) AS ingresos_cop,
  COALESCE(SUM(monto_cop) FILTER (WHERE tipo = 'gasto'), 0) AS gastos_cop,
  COALESCE(SUM(monto_cop) FILTER (WHERE tipo = 'ingreso'), 0)
    - COALESCE(SUM(monto_cop) FILTER (WHERE tipo = 'gasto'), 0) AS balance_cop
FROM movimientos_financieros
GROUP BY 1, 2
ORDER BY mes DESC;

-- ── Gastos por categoría ──────────────────────────────────────────────────

CREATE OR REPLACE VIEW v_gastos_por_categoria AS
SELECT
  categoria,
  COUNT(*) AS movimientos,
  SUM(monto_cop) AS total_cop,
  ROUND(
    100.0 * SUM(monto_cop) / NULLIF(SUM(SUM(monto_cop)) OVER (), 0),
    1
  ) AS porcentaje
FROM movimientos_financieros
WHERE tipo = 'gasto'
GROUP BY categoria
ORDER BY total_cop DESC;

-- ── Ventas diarias (pedidos entregados) ───────────────────────────────────

CREATE OR REPLACE VIEW v_ventas_diarias AS
SELECT
  DATE(entregado_at AT TIME ZONE 'America/Bogota') AS fecha,
  COUNT(*) AS pedidos,
  SUM(total_items) AS items_vendidos,
  SUM(subtotal_cop) AS ventas_cop
FROM pedidos
WHERE estado = 'entregado' AND entregado_at IS NOT NULL
GROUP BY 1
ORDER BY fecha DESC;

-- ── Pedidos activos (kanban) ──────────────────────────────────────────────

CREATE OR REPLACE VIEW v_pedidos_activos AS
SELECT
  pe.id,
  pe.codigo,
  pe.estado,
  pe.notas,
  pe.subtotal_cop,
  pe.total_items,
  pe.created_at,
  m.numero AS numero_mesa,
  m.nombre AS nombre_mesa,
  COALESCE(
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'productoId', pi.producto_id,
        'nombre', pi.nombre_snapshot,
        'precioCop', pi.precio_cop,
        'cantidad', pi.cantidad,
        'subtotalCop', pi.subtotal_cop
      ) ORDER BY pi.created_at
    ) FILTER (WHERE pi.id IS NOT NULL),
    '[]'::JSON
  ) AS items
FROM pedidos pe
JOIN mesas m ON m.id = pe.mesa_id
LEFT JOIN pedido_items pi ON pi.pedido_id = pe.id
WHERE pe.estado <> 'entregado' AND pe.estado <> 'cancelado'
GROUP BY pe.id, m.numero, m.nombre
ORDER BY pe.created_at ASC;

-- ── Catálogo público (productos activos) ──────────────────────────────────

CREATE OR REPLACE VIEW v_productos_publicos AS
SELECT
  p.id,
  p.slug,
  p.nombre,
  p.descripcion_corta,
  p.descripcion_seo,
  p.keywords,
  p.contenido,
  p.categoria_id,
  p.precio_cop,
  p.icono,
  p.emoji,
  p.imagen_url,
  p.origen,
  p.stock_actual,
  COALESCE(
    ARRAY_AGG(DISTINCT pe.etiqueta::TEXT) FILTER (WHERE pe.etiqueta IS NOT NULL),
    '{}'
  ) AS etiquetas,
  COALESCE(
    ARRAY_AGG(pip.texto ORDER BY pip.orden) FILTER (WHERE pip.texto IS NOT NULL),
    '{}'
  ) AS ideal_para
FROM productos p
LEFT JOIN producto_etiquetas pe ON pe.producto_id = p.id
LEFT JOIN producto_ideal_para pip ON pip.producto_id = p.id
WHERE p.activo = TRUE
GROUP BY p.id;

-- ── Historial de inventario por producto ──────────────────────────────────

CREATE OR REPLACE VIEW v_inventario_historial AS
SELECT
  im.id,
  im.created_at,
  p.slug,
  p.nombre AS producto,
  im.tipo,
  im.cantidad,
  im.stock_anterior,
  im.stock_nuevo,
  im.referencia,
  im.notas,
  pe.codigo AS pedido_codigo
FROM inventario_movimientos im
JOIN productos p ON p.id = im.producto_id
LEFT JOIN pedidos pe ON pe.id = im.pedido_id
ORDER BY im.created_at DESC;

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTAS DE EJEMPLO (copiar/pegar en psql o API)
-- ═══════════════════════════════════════════════════════════════════════════

-- Resumen del mes actual
-- SELECT * FROM v_resumen_mensual LIMIT 1;

-- Productos con stock bajo
-- SELECT * FROM v_inventario_alertas;

-- Kanban de pedidos
-- SELECT codigo, estado, nombre_mesa, total_items, subtotal_cop FROM v_pedidos_activos;

-- Registrar entrada de inventario manual
-- SELECT aplicar_movimiento_inventario(
--   (SELECT id FROM productos WHERE slug = 'granizados'),
--   'entrada', 20, NULL, 'INV-001', 'Reposición semanal'
-- );

-- Crear pedido desde mesa
-- WITH nuevo AS (
--   INSERT INTO pedidos (codigo, mesa_id, notas)
--   SELECT 'p-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'),
--          (SELECT id FROM mesas WHERE numero = 1),
--          'Sin azúcar'
--   RETURNING id
-- )
-- INSERT INTO pedido_items (pedido_id, producto_id, nombre_snapshot, precio_cop, cantidad)
-- SELECT n.id, p.id, p.nombre, p.precio_cop, 1
-- FROM nuevo n, productos p WHERE p.slug = 'granizados';

-- Marcar pedido entregado (descuenta inventario + crea ingreso)
-- UPDATE pedidos SET estado = 'entregado' WHERE codigo = 'p-demo-001';
