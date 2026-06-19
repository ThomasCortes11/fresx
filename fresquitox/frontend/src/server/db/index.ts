import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { SCHEMA_SQL } from './schema';
import { seedIfEmpty } from './seed';
import { newId } from './id';

let db: Database.Database | null = null;

export function getDbPath(): string {
  return process.env['FRESQUITOX_DB_PATH'] ?? join(process.cwd(), 'data', 'fresquitox.db');
}

export function initDatabase(): Database.Database {
  if (db) return db;

  const dbPath = getDbPath();
  mkdirSync(dirname(dbPath), { recursive: true });

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA_SQL);
  seedIfEmpty(db);

  console.log(`[fresquitox] SQLite: ${dbPath}`);
  return db;
}

export function getDb(): Database.Database {
  return db ?? initDatabase();
}

// ── Inventario ──────────────────────────────────────────────────────────────

export function aplicarMovimientoInventario(
  database: Database.Database,
  productoId: string,
  tipo: string,
  cantidad: number,
  opts: { pedidoId?: string; referencia?: string; notas?: string } = {}
): void {
  const producto = database.prepare('SELECT stock_actual FROM productos WHERE id = ?').get(productoId) as
    | { stock_actual: number }
    | undefined;
  if (!producto) throw new Error('Producto no encontrado');

  const delta =
    tipo === 'entrada' || tipo === 'devolucion' ? Math.abs(cantidad)
    : tipo === 'salida' || tipo === 'venta' || tipo === 'merma' ? -Math.abs(cantidad)
    : cantidad;

  const stockNuevo = Math.max(0, producto.stock_actual + delta);

  database.prepare(`UPDATE productos SET stock_actual = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(stockNuevo, productoId);

  database.prepare(`
    INSERT INTO inventario_movimientos (
      id, producto_id, tipo, cantidad, stock_anterior, stock_nuevo, pedido_id, referencia, notas
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    newId('inv'),
    productoId,
    tipo,
    delta,
    producto.stock_actual,
    stockNuevo,
    opts.pedidoId ?? null,
    opts.referencia ?? '',
    opts.notas ?? ''
  );
}

export function recalcularTotalesPedido(database: Database.Database, pedidoId: string): void {
  const totals = database.prepare(`
    SELECT COALESCE(SUM(subtotal_cop), 0) AS subtotal, COALESCE(SUM(cantidad), 0) AS items
    FROM pedido_items WHERE pedido_id = ?
  `).get(pedidoId) as { subtotal: number; items: number };

  database.prepare(`
    UPDATE pedidos SET subtotal_cop = ?, total_items = ?, updated_at = datetime('now') WHERE id = ?
  `).run(totals.subtotal, totals.items, pedidoId);
}

export function procesarPedidoEntregado(database: Database.Database, pedidoId: string): void {
  const pedido = database.prepare('SELECT * FROM pedidos WHERE id = ?').get(pedidoId) as {
    id: string;
    codigo: string;
    estado: string;
    subtotal_cop: number;
    movimiento_id: string | null;
  } | undefined;

  if (!pedido || pedido.estado === 'entregado') return;

  database.prepare(`
    UPDATE pedidos SET estado = 'entregado', entregado_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(pedidoId);

  const items = database.prepare(`
    SELECT producto_id, cantidad, nombre_snapshot FROM pedido_items
    WHERE pedido_id = ? AND producto_id IS NOT NULL
  `).all(pedidoId) as { producto_id: string; cantidad: number; nombre_snapshot: string }[];

  for (const item of items) {
    aplicarMovimientoInventario(database, item.producto_id, 'venta', item.cantidad, {
      pedidoId,
      referencia: pedido.codigo,
      notas: `Venta mesa — ${item.nombre_snapshot}`,
    });
  }

  if (pedido.subtotal_cop > 0 && !pedido.movimiento_id) {
    const movId = newId('mov');
    database.prepare(`
      INSERT INTO movimientos_financieros (id, tipo, concepto, monto_cop, categoria, notas, pedido_id)
      VALUES (?, 'ingreso', ?, ?, 'venta', 'Generado al entregar pedido', ?)
    `).run(movId, `Venta mesa ${pedido.codigo}`, pedido.subtotal_cop, pedidoId);

    database.prepare(`UPDATE pedidos SET movimiento_id = ? WHERE id = ?`).run(movId, pedidoId);
  }
}

export function clearDestacadoEventos(database: Database.Database, exceptId?: string): void {
  if (exceptId) {
    database.prepare(`UPDATE eventos SET destacado = 0 WHERE id <> ?`).run(exceptId);
  } else {
    database.prepare(`UPDATE eventos SET destacado = 0`).run();
  }
}
