-- ═══════════════════════════════════════════════════════════════════════════
-- FRESQUITOX — Esquema PostgreSQL
-- Productos · Inventario · Pedidos · Eventos · Reportes
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUMS ─────────────────────────────────────────────────────────────────

CREATE TYPE categoria_producto AS ENUM ('clasicos', 'naturales', 'premium');
CREATE TYPE producto_etiqueta AS ENUM ('nuevo', 'oferta', 'popular', 'limitado');
CREATE TYPE origen_producto AS ENUM ('catalogo', 'admin');
CREATE TYPE estado_pedido AS ENUM ('pendiente', 'preparando', 'listo', 'entregado', 'cancelado');
CREATE TYPE tipo_inventario AS ENUM ('entrada', 'salida', 'ajuste', 'venta', 'merma', 'devolucion');
CREATE TYPE tipo_evento AS ENUM ('dj', 'musica-en-vivo', 'karaoke', 'especial');
CREATE TYPE tipo_movimiento AS ENUM ('ingreso', 'gasto');
CREATE TYPE categoria_movimiento AS ENUM (
  'venta', 'ingredientes', 'suministros', 'servicios',
  'personal', 'arriendo', 'marketing', 'otro'
);

-- ── ADMIN ─────────────────────────────────────────────────────────────────

CREATE TABLE admin_usuarios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nombre        TEXT NOT NULL DEFAULT '',
  activo        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── CATÁLOGO / PRODUCTOS ──────────────────────────────────────────────────

CREATE TABLE categorias (
  id         categoria_producto PRIMARY KEY,
  titulo     TEXT NOT NULL,
  subtitulo  TEXT NOT NULL DEFAULT '',
  icono      TEXT NOT NULL DEFAULT '',
  orden      SMALLINT NOT NULL DEFAULT 0,
  activo     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE productos (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT NOT NULL UNIQUE,
  nombre              TEXT NOT NULL,
  descripcion_corta   TEXT NOT NULL DEFAULT '',
  descripcion_seo     TEXT NOT NULL DEFAULT '',
  keywords            TEXT NOT NULL DEFAULT '',
  contenido           JSONB NOT NULL DEFAULT '[]'::JSONB,
  categoria_id        categoria_producto NOT NULL REFERENCES categorias(id),
  precio_cop          INTEGER NOT NULL DEFAULT 0 CHECK (precio_cop >= 0),
  icono               TEXT NOT NULL DEFAULT '',
  emoji               TEXT NOT NULL DEFAULT '',
  imagen_url          TEXT,
  origen              origen_producto NOT NULL DEFAULT 'admin',
  activo              BOOLEAN NOT NULL DEFAULT TRUE,
  stock_actual        INTEGER NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo        INTEGER NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE producto_etiquetas (
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  etiqueta    producto_etiqueta NOT NULL,
  PRIMARY KEY (producto_id, etiqueta)
);

CREATE TABLE producto_ideal_para (
  id          SERIAL PRIMARY KEY,
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  texto       TEXT NOT NULL,
  orden       SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_activo ON productos(activo) WHERE activo = TRUE;
CREATE INDEX idx_productos_stock_bajo ON productos(stock_actual, stock_minimo)
  WHERE activo = TRUE AND stock_actual <= stock_minimo;

-- ── INVENTARIO ────────────────────────────────────────────────────────────

CREATE TABLE inventario_movimientos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id     UUID NOT NULL REFERENCES productos(id),
  tipo            tipo_inventario NOT NULL,
  cantidad        INTEGER NOT NULL CHECK (cantidad <> 0),
  stock_anterior  INTEGER NOT NULL CHECK (stock_anterior >= 0),
  stock_nuevo     INTEGER NOT NULL CHECK (stock_nuevo >= 0),
  pedido_id       UUID,
  referencia      TEXT NOT NULL DEFAULT '',
  notas           TEXT NOT NULL DEFAULT '',
  creado_por      UUID REFERENCES admin_usuarios(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventario_producto ON inventario_movimientos(producto_id, created_at DESC);
CREATE INDEX idx_inventario_pedido ON inventario_movimientos(pedido_id) WHERE pedido_id IS NOT NULL;

-- ── MESAS Y PEDIDOS ───────────────────────────────────────────────────────

CREATE TABLE mesas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo     TEXT NOT NULL UNIQUE,
  numero     SMALLINT NOT NULL UNIQUE CHECK (numero > 0),
  nombre     TEXT NOT NULL,
  activa     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pedidos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo          TEXT NOT NULL UNIQUE,
  mesa_id         UUID NOT NULL REFERENCES mesas(id),
  estado          estado_pedido NOT NULL DEFAULT 'pendiente',
  notas           TEXT NOT NULL DEFAULT '',
  subtotal_cop    INTEGER NOT NULL DEFAULT 0 CHECK (subtotal_cop >= 0),
  total_items     INTEGER NOT NULL DEFAULT 0 CHECK (total_items >= 0),
  entregado_at    TIMESTAMPTZ,
  movimiento_id   UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pedido_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id       UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id     UUID REFERENCES productos(id) ON DELETE SET NULL,
  nombre_snapshot TEXT NOT NULL,
  precio_cop      INTEGER NOT NULL CHECK (precio_cop >= 0),
  cantidad        SMALLINT NOT NULL CHECK (cantidad > 0),
  subtotal_cop    INTEGER GENERATED ALWAYS AS (precio_cop * cantidad) STORED,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pedidos_estado ON pedidos(estado, created_at DESC);
CREATE INDEX idx_pedidos_mesa ON pedidos(mesa_id, created_at DESC);
CREATE INDEX idx_pedido_items_pedido ON pedido_items(pedido_id);

ALTER TABLE inventario_movimientos
  ADD CONSTRAINT fk_inventario_pedido
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL;

-- ── EVENTOS ───────────────────────────────────────────────────────────────

CREATE TABLE eventos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo       TEXT NOT NULL UNIQUE,
  titulo       TEXT NOT NULL,
  fecha        DATE NOT NULL,
  hora         TEXT NOT NULL DEFAULT '',
  tipo         tipo_evento NOT NULL,
  artista      TEXT NOT NULL DEFAULT '',
  descripcion  TEXT NOT NULL DEFAULT '',
  emoji        TEXT NOT NULL DEFAULT '',
  destacado    BOOLEAN NOT NULL DEFAULT FALSE,
  activo       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eventos_fecha ON eventos(fecha) WHERE activo = TRUE;
CREATE UNIQUE INDEX idx_eventos_destacado ON eventos(destacado)
  WHERE destacado = TRUE AND activo = TRUE;

-- ── REPORTES / FINANZAS ───────────────────────────────────────────────────

CREATE TABLE movimientos_financieros (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo        tipo_movimiento NOT NULL,
  concepto    TEXT NOT NULL,
  monto_cop   INTEGER NOT NULL CHECK (monto_cop > 0),
  categoria   categoria_movimiento NOT NULL,
  notas       TEXT NOT NULL DEFAULT '',
  pedido_id   UUID REFERENCES pedidos(id) ON DELETE SET NULL,
  creado_por  UUID REFERENCES admin_usuarios(id),
  fecha       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movimientos_fecha ON movimientos_financieros(fecha DESC);
CREATE INDEX idx_movimientos_tipo ON movimientos_financieros(tipo, fecha DESC);
CREATE INDEX idx_movimientos_categoria ON movimientos_financieros(categoria);

ALTER TABLE pedidos
  ADD CONSTRAINT fk_pedidos_movimiento
  FOREIGN KEY (movimiento_id) REFERENCES movimientos_financieros(id) ON DELETE SET NULL;

-- ── FAQs (chatbot + página pública) ───────────────────────────────────────

CREATE TABLE faqs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta   TEXT NOT NULL,
  respuesta  TEXT NOT NULL,
  keywords   TEXT[] NOT NULL DEFAULT '{}',
  activa     BOOLEAN NOT NULL DEFAULT TRUE,
  orden      SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── FUNCIONES AUXILIARES ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION un_solo_evento_destacado()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.destacado = TRUE AND NEW.activo = TRUE THEN
    UPDATE eventos
    SET destacado = FALSE, updated_at = NOW()
    WHERE id <> NEW.id AND destacado = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recalcular_totales_pedido(p_pedido_id UUID)
RETURNS VOID AS $$
DECLARE
  v_subtotal INTEGER;
  v_items    INTEGER;
BEGIN
  SELECT COALESCE(SUM(subtotal_cop), 0), COALESCE(SUM(cantidad), 0)
  INTO v_subtotal, v_items
  FROM pedido_items
  WHERE pedido_id = p_pedido_id;

  UPDATE pedidos
  SET subtotal_cop = v_subtotal,
      total_items  = v_items,
      updated_at   = NOW()
  WHERE id = p_pedido_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_recalcular_pedido()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalcular_totales_pedido(COALESCE(NEW.pedido_id, OLD.pedido_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION aplicar_movimiento_inventario(
  p_producto_id UUID,
  p_tipo        tipo_inventario,
  p_cantidad    INTEGER,
  p_pedido_id   UUID DEFAULT NULL,
  p_referencia  TEXT DEFAULT '',
  p_notas       TEXT DEFAULT '',
  p_creado_por  UUID DEFAULT NULL
)
RETURNS inventario_movimientos AS $$
DECLARE
  v_stock_anterior INTEGER;
  v_stock_nuevo    INTEGER;
  v_delta          INTEGER;
  v_row            inventario_movimientos;
BEGIN
  SELECT stock_actual INTO v_stock_anterior
  FROM productos
  WHERE id = p_producto_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto % no encontrado', p_producto_id;
  END IF;

  v_delta := CASE
    WHEN p_tipo IN ('entrada', 'devolucion') THEN ABS(p_cantidad)
    WHEN p_tipo IN ('salida', 'venta', 'merma') THEN -ABS(p_cantidad)
    ELSE p_cantidad
  END;

  v_stock_nuevo := GREATEST(0, v_stock_anterior + v_delta);

  UPDATE productos
  SET stock_actual = v_stock_nuevo, updated_at = NOW()
  WHERE id = p_producto_id;

  INSERT INTO inventario_movimientos (
    producto_id, tipo, cantidad, stock_anterior, stock_nuevo,
    pedido_id, referencia, notas, creado_por
  ) VALUES (
    p_producto_id, p_tipo, v_delta, v_stock_anterior, v_stock_nuevo,
    p_pedido_id, p_referencia, p_notas, p_creado_por
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION procesar_pedido_entregado()
RETURNS TRIGGER AS $$
DECLARE
  v_item       RECORD;
  v_movimiento movimientos_financieros;
BEGIN
  IF NEW.estado = 'entregado' AND OLD.estado IS DISTINCT FROM 'entregado' THEN
    NEW.entregado_at := NOW();

    FOR v_item IN
      SELECT pi.producto_id, pi.cantidad, pi.nombre_snapshot
      FROM pedido_items pi
      WHERE pi.pedido_id = NEW.id AND pi.producto_id IS NOT NULL
    LOOP
      PERFORM aplicar_movimiento_inventario(
        v_item.producto_id,
        'venta',
        v_item.cantidad,
        NEW.id,
        NEW.codigo,
        'Venta mesa — ' || v_item.nombre_snapshot
      );
    END LOOP;

    IF NEW.subtotal_cop > 0 AND NEW.movimiento_id IS NULL THEN
      INSERT INTO movimientos_financieros (tipo, concepto, monto_cop, categoria, notas, pedido_id, fecha)
      VALUES (
        'ingreso',
        'Venta mesa ' || NEW.codigo,
        NEW.subtotal_cop,
        'venta',
        'Generado automáticamente al entregar pedido',
        NEW.id,
        NOW()
      )
      RETURNING * INTO v_movimiento;

      NEW.movimiento_id := v_movimiento.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── TRIGGERS ──────────────────────────────────────────────────────────────

CREATE TRIGGER trg_productos_updated
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_mesas_updated
  BEFORE UPDATE ON mesas
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_pedidos_updated
  BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_eventos_updated
  BEFORE UPDATE ON eventos
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_eventos_destacado
  BEFORE INSERT OR UPDATE OF destacado, activo ON eventos
  FOR EACH ROW EXECUTE PROCEDURE un_solo_evento_destacado();

CREATE TRIGGER trg_pedido_items_recalc
  AFTER INSERT OR UPDATE OR DELETE ON pedido_items
  FOR EACH ROW EXECUTE PROCEDURE trg_recalcular_pedido();

CREATE TRIGGER trg_pedido_entregado
  BEFORE UPDATE OF estado ON pedidos
  FOR EACH ROW EXECUTE PROCEDURE procesar_pedido_entregado();

COMMIT;
