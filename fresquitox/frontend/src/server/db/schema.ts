export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categorias (
  id         TEXT PRIMARY KEY CHECK (id IN ('clasicos', 'naturales', 'premium')),
  titulo     TEXT NOT NULL,
  subtitulo  TEXT NOT NULL DEFAULT '',
  icono      TEXT NOT NULL DEFAULT '',
  orden      INTEGER NOT NULL DEFAULT 0,
  activo     INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS productos (
  id                TEXT PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,
  nombre            TEXT NOT NULL,
  descripcion_corta TEXT NOT NULL DEFAULT '',
  descripcion_seo   TEXT NOT NULL DEFAULT '',
  keywords          TEXT NOT NULL DEFAULT '',
  contenido         TEXT NOT NULL DEFAULT '[]',
  categoria_id      TEXT NOT NULL REFERENCES categorias(id),
  precio_cop        INTEGER NOT NULL DEFAULT 0 CHECK (precio_cop >= 0),
  icono             TEXT NOT NULL DEFAULT '',
  emoji             TEXT NOT NULL DEFAULT '',
  imagen_url        TEXT,
  origen            TEXT NOT NULL DEFAULT 'admin' CHECK (origen IN ('catalogo', 'admin')),
  activo            INTEGER NOT NULL DEFAULT 1,
  stock_actual      INTEGER NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo      INTEGER NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS producto_etiquetas (
  producto_id TEXT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  etiqueta    TEXT NOT NULL CHECK (etiqueta IN ('nuevo', 'oferta', 'popular', 'limitado')),
  PRIMARY KEY (producto_id, etiqueta)
);

CREATE TABLE IF NOT EXISTS producto_ideal_para (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  producto_id TEXT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  texto       TEXT NOT NULL,
  orden       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mesas (
  id         TEXT PRIMARY KEY,
  codigo     TEXT NOT NULL UNIQUE,
  numero     INTEGER NOT NULL UNIQUE CHECK (numero > 0),
  nombre     TEXT NOT NULL,
  activa     INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pedidos (
  id            TEXT PRIMARY KEY,
  codigo        TEXT NOT NULL UNIQUE,
  mesa_id       TEXT NOT NULL REFERENCES mesas(id),
  estado        TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'preparando', 'listo', 'entregado', 'cancelado')),
  notas         TEXT NOT NULL DEFAULT '',
  subtotal_cop  INTEGER NOT NULL DEFAULT 0 CHECK (subtotal_cop >= 0),
  total_items   INTEGER NOT NULL DEFAULT 0 CHECK (total_items >= 0),
  entregado_at  TEXT,
  movimiento_id TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pedido_items (
  id              TEXT PRIMARY KEY,
  pedido_id       TEXT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id     TEXT REFERENCES productos(id) ON DELETE SET NULL,
  nombre_snapshot TEXT NOT NULL,
  precio_cop      INTEGER NOT NULL CHECK (precio_cop >= 0),
  cantidad        INTEGER NOT NULL CHECK (cantidad > 0),
  subtotal_cop    INTEGER NOT NULL CHECK (subtotal_cop >= 0),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inventario_movimientos (
  id             TEXT PRIMARY KEY,
  producto_id    TEXT NOT NULL REFERENCES productos(id),
  tipo           TEXT NOT NULL CHECK (tipo IN ('entrada', 'salida', 'ajuste', 'venta', 'merma', 'devolucion')),
  cantidad       INTEGER NOT NULL CHECK (cantidad <> 0),
  stock_anterior INTEGER NOT NULL CHECK (stock_anterior >= 0),
  stock_nuevo    INTEGER NOT NULL CHECK (stock_nuevo >= 0),
  pedido_id      TEXT REFERENCES pedidos(id) ON DELETE SET NULL,
  referencia     TEXT NOT NULL DEFAULT '',
  notas          TEXT NOT NULL DEFAULT '',
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS eventos (
  id          TEXT PRIMARY KEY,
  codigo      TEXT NOT NULL UNIQUE,
  titulo      TEXT NOT NULL,
  fecha       TEXT NOT NULL,
  hora        TEXT NOT NULL DEFAULT '',
  tipo        TEXT NOT NULL CHECK (tipo IN ('dj', 'musica-en-vivo', 'karaoke', 'especial')),
  artista     TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  emoji       TEXT NOT NULL DEFAULT '',
  destacado   INTEGER NOT NULL DEFAULT 0,
  activo      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS movimientos_financieros (
  id         TEXT PRIMARY KEY,
  tipo       TEXT NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  concepto   TEXT NOT NULL,
  monto_cop  INTEGER NOT NULL CHECK (monto_cop > 0),
  categoria  TEXT NOT NULL CHECK (categoria IN (
    'venta', 'ingredientes', 'suministros', 'servicios',
    'personal', 'arriendo', 'marketing', 'otro'
  )),
  notas      TEXT NOT NULL DEFAULT '',
  pedido_id  TEXT REFERENCES pedidos(id) ON DELETE SET NULL,
  fecha      TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado, created_at);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos(fecha);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_financieros(fecha);
`;
