import { Router, type Request, type Response } from 'express';
import {
  getDb,
  aplicarMovimientoInventario,
  recalcularTotalesPedido,
  procesarPedidoEntregado,
  clearDestacadoEventos,
} from '../db/index';
import { formatCop, newId, parseCop } from '../db/id';

const router = Router();

// ── Mappers ───────────────────────────────────────────────────────────────

type ProductoRow = {
  id: string;
  slug: string;
  nombre: string;
  descripcion_corta: string;
  descripcion_seo: string;
  keywords: string;
  contenido: string;
  categoria_id: string;
  precio_cop: number;
  icono: string;
  emoji: string;
  imagen_url: string | null;
  activo: number;
  stock_actual: number;
  stock_minimo: number;
  created_at: string;
};

function loadProductExtras(id: string) {
  const db = getDb();
  const etiquetas = (db.prepare('SELECT etiqueta FROM producto_etiquetas WHERE producto_id = ?')
    .all(id) as { etiqueta: string }[]).map((r) => r.etiqueta);
  const idealPara = (db.prepare('SELECT texto FROM producto_ideal_para WHERE producto_id = ? ORDER BY orden')
    .all(id) as { texto: string }[]).map((r) => r.texto);
  return { etiquetas, idealPara };
}

function parseContenido(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function toProductoAdmin(row: ProductoRow) {
  const { etiquetas, idealPara } = loadProductExtras(row.id);
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    descripcionCorta: row.descripcion_corta,
    descripcionSeo: row.descripcion_seo,
    keywords: row.keywords,
    contenido: parseContenido(row.contenido),
    precio: formatCop(row.precio_cop),
    categoria: row.categoria_id,
    imagen: row.imagen_url ?? undefined,
    icono: row.icono,
    emoji: row.emoji,
    idealPara,
    etiquetas,
    activo: row.activo === 1,
    fechaCreacion: new Date(row.created_at).getTime(),
    stock: row.stock_actual,
    stockMinimo: row.stock_minimo,
  };
}

function toMesa(row: { id: string; numero: number; nombre: string; activa: number }) {
  return { id: row.id, numero: row.numero, nombre: row.nombre, activa: row.activa === 1 };
}

function toPedido(row: {
  id: string; mesa_id: string; estado: string; notas: string;
  fechaCreacion?: number; created_at: string;
  numero?: number; nombre?: string;
}) {
  const db = getDb();
  const mesa = db.prepare('SELECT numero, nombre FROM mesas WHERE id = ?').get(row.mesa_id) as
    | { numero: number; nombre: string } | undefined;
  const items = (db.prepare(`
    SELECT producto_id, nombre_snapshot, precio_cop, cantidad FROM pedido_items WHERE pedido_id = ?
  `).all(row.id) as { producto_id: string | null; nombre_snapshot: string; precio_cop: number; cantidad: number }[])
    .map((i) => ({
    productoId: i.producto_id ?? '',
    nombre: i.nombre_snapshot,
    precio: formatCop(i.precio_cop),
    cantidad: i.cantidad,
  }));

  return {
    id: row.id,
    mesaId: row.mesa_id,
    numeroMesa: mesa?.numero ?? row.numero ?? 0,
    nombreMesa: mesa?.nombre ?? row.nombre ?? '',
    items,
    estado: row.estado,
    notas: row.notas,
    fechaCreacion: row.fechaCreacion ?? new Date(row.created_at).getTime(),
  };
}

function toEvento(row: {
  id: string; titulo: string; fecha: string; hora: string; tipo: string;
  artista: string; descripcion: string; emoji: string; destacado: number; activo: number;
}) {
  return {
    id: row.id,
    titulo: row.titulo,
    fecha: row.fecha,
    hora: row.hora,
    tipo: row.tipo,
    artista: row.artista,
    descripcion: row.descripcion,
    emoji: row.emoji,
    destacado: row.destacado === 1,
    activo: row.activo === 1,
  };
}

function toMovimiento(row: {
  id: string; tipo: string; concepto: string; monto_cop: number;
  categoria: string; notas: string; fecha: string;
}) {
  return {
    id: row.id,
    tipo: row.tipo,
    concepto: row.concepto,
    monto: row.monto_cop,
    categoria: row.categoria,
    notas: row.notas,
    fecha: new Date(row.fecha).getTime(),
  };
}

// ── Productos ─────────────────────────────────────────────────────────────

router.get('/productos', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM productos ORDER BY created_at DESC').all() as ProductoRow[];
  res.json(rows.map(toProductoAdmin));
});

router.get('/productos/activos', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM productos WHERE activo = 1 ORDER BY nombre').all() as ProductoRow[];
  res.json(rows.map(toProductoAdmin));
});

router.get('/productos/slug/:slug', (req, res) => {
  const row = getDb().prepare('SELECT * FROM productos WHERE slug = ? AND activo = 1').get(req.params.slug) as
    | ProductoRow
    | undefined;
  if (!row) {
    res.status(404).json({ error: 'No encontrado' });
    return;
  }
  res.json(toProductoAdmin(row));
});

router.post('/productos', (req, res) => {
  try {
    const p = req.body;
    const db = getDb();
    const id = p.id || newId('prod');
    const precioCop = parseCop(p.precio);
    const exists = db.prepare('SELECT id FROM productos WHERE id = ?').get(id);

    if (exists) {
      db.prepare(`
        UPDATE productos SET
          slug = ?, nombre = ?, descripcion_corta = ?, precio_cop = ?, categoria_id = ?,
          imagen_url = ?, icono = ?, emoji = ?, activo = ?, stock_actual = ?, stock_minimo = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(
        p.slug, p.nombre, p.descripcionCorta ?? '', precioCop, p.categoria,
        p.imagen ?? null, p.icono ?? '', p.emoji ?? '', p.activo ? 1 : 0,
        p.stock ?? 0, p.stockMinimo ?? 5, id
      );
    } else {
      db.prepare(`
        INSERT INTO productos (
          id, slug, nombre, descripcion_corta, categoria_id, precio_cop,
          imagen_url, icono, emoji, origen, activo, stock_actual, stock_minimo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin', ?, ?, ?)
      `).run(
        id, p.slug, p.nombre, p.descripcionCorta ?? '', p.categoria, precioCop,
        p.imagen ?? null, p.icono ?? '', p.emoji ?? '', p.activo ? 1 : 0,
        p.stock ?? 0, p.stockMinimo ?? 5
      );
    }

    db.prepare('DELETE FROM producto_etiquetas WHERE producto_id = ?').run(id);
    db.prepare('DELETE FROM producto_ideal_para WHERE producto_id = ?').run(id);
    for (const tag of p.etiquetas ?? []) {
      db.prepare('INSERT INTO producto_etiquetas (producto_id, etiqueta) VALUES (?, ?)').run(id, tag);
    }
    (p.idealPara ?? []).forEach((t: string, i: number) => {
      db.prepare('INSERT INTO producto_ideal_para (producto_id, texto, orden) VALUES (?, ?, ?)').run(id, t, i);
    });

    const row = db.prepare('SELECT * FROM productos WHERE id = ?').get(id) as ProductoRow;
    res.json(toProductoAdmin(row));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

router.delete('/productos/:id', (req, res) => {
  getDb().prepare('DELETE FROM productos WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.patch('/productos/:id/toggle', (req, res) => {
  const db = getDb();
  db.prepare(`UPDATE productos SET activo = CASE activo WHEN 1 THEN 0 ELSE 1 END, updated_at = datetime('now') WHERE id = ?`)
    .run(req.params.id);
  const row = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id) as ProductoRow;
  res.json(toProductoAdmin(row));
});

router.patch('/productos/:id/stock', (req, res) => {
  const db = getDb();
  const { delta, cantidad } = req.body;
  const current = db.prepare('SELECT stock_actual FROM productos WHERE id = ?').get(req.params.id) as
    | { stock_actual: number } | undefined;
  if (!current) {
    res.status(404).json({ error: 'No encontrado' });
    return;
  }

  const nuevo = cantidad !== undefined
    ? Math.max(0, cantidad)
    : Math.max(0, current.stock_actual + (delta ?? 0));

  db.prepare(`UPDATE productos SET stock_actual = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(nuevo, req.params.id);

  const row = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id) as ProductoRow;
  res.json(toProductoAdmin(row));
});

// ── Mesas ─────────────────────────────────────────────────────────────────

router.get('/mesas', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM mesas ORDER BY numero').all() as Parameters<typeof toMesa>[0][];
  res.json(rows.map(toMesa));
});

router.post('/mesas', (req, res) => {
  const db = getDb();
  const max = db.prepare('SELECT MAX(numero) AS n FROM mesas').get() as { n: number | null };
  const numero = (max.n ?? 0) + 1;
  const id = newId('mesa');
  const nombre = req.body.nombre || `Mesa ${numero}`;
  db.prepare('INSERT INTO mesas (id, codigo, numero, nombre) VALUES (?, ?, ?, ?)').run(id, id, numero, nombre);
  const row = db.prepare('SELECT * FROM mesas WHERE id = ?').get(id) as Parameters<typeof toMesa>[0];
  res.json(toMesa(row));
});

router.delete('/mesas/:id', (req, res) => {
  getDb().prepare('DELETE FROM mesas WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.patch('/mesas/:id/toggle', (req, res) => {
  const db = getDb();
  db.prepare(`UPDATE mesas SET activa = CASE activa WHEN 1 THEN 0 ELSE 1 END WHERE id = ?`).run(req.params.id);
  const row = db.prepare('SELECT * FROM mesas WHERE id = ?').get(req.params.id) as Parameters<typeof toMesa>[0];
  res.json(toMesa(row));
});

// ── Pedidos ───────────────────────────────────────────────────────────────

router.get('/pedidos', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM pedidos ORDER BY created_at ASC').all() as Parameters<typeof toPedido>[0][];
  res.json(rows.map(toPedido));
});

router.post('/pedidos', (req, res) => {
  try {
    const db = getDb();
    const { mesaId, items, notas } = req.body;
    const id = newId('ped');
    const codigo = `p-${Date.now()}`;

    db.prepare(`
      INSERT INTO pedidos (id, codigo, mesa_id, estado, notas) VALUES (?, ?, ?, 'pendiente', ?)
    `).run(id, codigo, mesaId, notas ?? '');

    const insertItem = db.prepare(`
      INSERT INTO pedido_items (id, pedido_id, producto_id, nombre_snapshot, precio_cop, cantidad, subtotal_cop)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of items ?? []) {
      const precioCop = parseCop(item.precio);
      insertItem.run(
        newId('item'), id, item.productoId || null, item.nombre,
        precioCop, item.cantidad, precioCop * item.cantidad
      );
    }

    recalcularTotalesPedido(db, id);
    const row = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(id) as Parameters<typeof toPedido>[0];
    res.status(201).json(toPedido(row));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

router.patch('/pedidos/:id/estado', (req, res) => {
  try {
    const db = getDb();
    const { estado } = req.body;
    if (estado === 'entregado') {
      procesarPedidoEntregado(db, req.params.id);
    } else {
      db.prepare(`UPDATE pedidos SET estado = ?, updated_at = datetime('now') WHERE id = ?`)
        .run(estado, req.params.id);
    }
    const row = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id) as Parameters<typeof toPedido>[0];
    res.json(toPedido(row));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

router.delete('/pedidos/:id', (req, res) => {
  getDb().prepare('DELETE FROM pedidos WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.delete('/pedidos', (_req, res) => {
  getDb().prepare(`DELETE FROM pedidos WHERE estado = 'entregado'`).run();
  res.json({ ok: true });
});

// ── Eventos ───────────────────────────────────────────────────────────────

router.get('/eventos', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM eventos ORDER BY fecha').all() as Parameters<typeof toEvento>[0][];
  res.json(rows.map(toEvento));
});

router.post('/eventos', (req, res) => {
  const e = req.body;
  const id = e.id || newId('ev');
  const db = getDb();
  if (e.destacado) clearDestacadoEventos(db);
  db.prepare(`
    INSERT INTO eventos (id, codigo, titulo, fecha, hora, tipo, artista, descripcion, emoji, destacado, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, id, e.titulo, e.fecha, e.hora ?? '', e.tipo, e.artista ?? '', e.descripcion ?? '', e.emoji ?? '', e.destacado ? 1 : 0, e.activo !== false ? 1 : 0);
  const row = db.prepare('SELECT * FROM eventos WHERE id = ?').get(id) as Parameters<typeof toEvento>[0];
  res.status(201).json(toEvento(row));
});

router.patch('/eventos/:id', (req, res) => {
  const e = req.body;
  const db = getDb();
  if (e.destacado) clearDestacadoEventos(db, req.params.id);
  const current = db.prepare('SELECT * FROM eventos WHERE id = ?').get(req.params.id) as Parameters<typeof toEvento>[0];
  if (!current) {
    res.status(404).json({ error: 'No encontrado' });
    return;
  }

  db.prepare(`
    UPDATE eventos SET
      titulo = ?, fecha = ?, hora = ?, tipo = ?, artista = ?, descripcion = ?,
      emoji = ?, destacado = ?, activo = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    e.titulo ?? current.titulo, e.fecha ?? current.fecha, e.hora ?? current.hora,
    e.tipo ?? current.tipo, e.artista ?? current.artista, e.descripcion ?? current.descripcion,
    e.emoji ?? current.emoji,
    e.destacado !== undefined ? (e.destacado ? 1 : 0) : current.destacado,
    e.activo !== undefined ? (e.activo ? 1 : 0) : current.activo,
    req.params.id
  );
  const row = db.prepare('SELECT * FROM eventos WHERE id = ?').get(req.params.id) as Parameters<typeof toEvento>[0];
  res.json(toEvento(row));
});

router.delete('/eventos/:id', (req, res) => {
  getDb().prepare('DELETE FROM eventos WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.patch('/eventos/:id/toggle-activo', (req, res) => {
  const db = getDb();
  db.prepare(`UPDATE eventos SET activo = CASE activo WHEN 1 THEN 0 ELSE 1 END, updated_at = datetime('now') WHERE id = ?`)
    .run(req.params.id);
  const row = db.prepare('SELECT * FROM eventos WHERE id = ?').get(req.params.id) as Parameters<typeof toEvento>[0];
  res.json(toEvento(row));
});

router.patch('/eventos/:id/toggle-destacado', (req, res) => {
  const db = getDb();
  const current = db.prepare('SELECT destacado FROM eventos WHERE id = ?').get(req.params.id) as { destacado: number } | undefined;
  if (!current) {
    res.status(404).json({ error: 'No encontrado' });
    return;
  }
  const nuevo = current.destacado === 1 ? 0 : 1;
  if (nuevo) clearDestacadoEventos(db, req.params.id);
  db.prepare(`UPDATE eventos SET destacado = ?, updated_at = datetime('now') WHERE id = ?`).run(nuevo, req.params.id);
  const row = db.prepare('SELECT * FROM eventos WHERE id = ?').get(req.params.id) as Parameters<typeof toEvento>[0];
  res.json(toEvento(row));
});

// ── Reportes / movimientos ────────────────────────────────────────────────

router.get('/movimientos', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM movimientos_financieros ORDER BY fecha DESC').all() as Parameters<typeof toMovimiento>[0][];
  res.json(rows.map(toMovimiento));
});

router.post('/movimientos', (req, res) => {
  const m = req.body;
  const id = newId('mov');
  const fecha = new Date(m.fecha ?? Date.now()).toISOString();
  getDb().prepare(`
    INSERT INTO movimientos_financieros (id, tipo, concepto, monto_cop, categoria, notas, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, m.tipo, m.concepto, m.monto, m.categoria, m.notas ?? '', fecha);
  const row = getDb().prepare('SELECT * FROM movimientos_financieros WHERE id = ?').get(id) as Parameters<typeof toMovimiento>[0];
  res.status(201).json(toMovimiento(row));
});

router.delete('/movimientos/:id', (req, res) => {
  getDb().prepare('DELETE FROM movimientos_financieros WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── Inventario manual ───────────────────────────────────────────────────────

router.post('/inventario/movimiento', (req, res) => {
  try {
    const { productoId, tipo, cantidad, referencia, notas } = req.body;
    aplicarMovimientoInventario(getDb(), productoId, tipo, cantidad, { referencia, notas });
    const row = getDb().prepare('SELECT * FROM productos WHERE id = ?').get(productoId) as ProductoRow;
    res.json(toProductoAdmin(row));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

router.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, db: 'sqlite' });
});

export default router;
