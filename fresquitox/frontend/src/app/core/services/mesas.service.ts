import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Mesa {
  id: string;
  numero: number;
  nombre: string;
  activa: boolean;
}

export interface ItemPedido {
  productoId: string;
  nombre: string;
  precio: string;
  cantidad: number;
}

export type EstadoPedido = 'pendiente' | 'preparando' | 'listo' | 'entregado';

export interface PedidoMesa {
  id: string;
  mesaId: string;
  numeroMesa: number;
  nombreMesa: string;
  items: ItemPedido[];
  estado: EstadoPedido;
  notas: string;
  fechaCreacion: number;
}

const MESAS_KEY   = 'fq_mesas';
const PEDIDOS_KEY = 'fq_pedidos';

const MESAS_DEFAULT: Mesa[] = [
  { id: 'm1', numero: 1, nombre: 'Mesa 1', activa: true },
  { id: 'm2', numero: 2, nombre: 'Mesa 2', activa: true },
  { id: 'm3', numero: 3, nombre: 'Mesa 3', activa: true },
  { id: 'm4', numero: 4, nombre: 'Barra',  activa: true },
];

@Injectable({ providedIn: 'root' })
export class MesasService {
  private readonly platformId = inject(PLATFORM_ID);
  private get isBrowser() { return isPlatformBrowser(this.platformId); }

  readonly mesas   = signal<Mesa[]>(this.loadMesas());
  readonly pedidos = signal<PedidoMesa[]>(this.loadPedidos());

  readonly pedidosActivos = computed(() =>
    this.pedidos().filter(p => p.estado !== 'entregado')
  );

  readonly pedidosPorMesa = computed(() =>
    this.mesas().map(m => ({
      ...m,
      pedidos: this.pedidosActivos().filter(p => p.mesaId === m.id),
    }))
  );

  private loadMesas(): Mesa[] {
    if (!this.isBrowser) return MESAS_DEFAULT;
    try {
      const raw = localStorage.getItem(MESAS_KEY);
      return raw ? (JSON.parse(raw) as Mesa[]) : MESAS_DEFAULT;
    } catch { return MESAS_DEFAULT; }
  }

  private loadPedidos(): PedidoMesa[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(PEDIDOS_KEY);
      return raw ? (JSON.parse(raw) as PedidoMesa[]) : [];
    } catch { return []; }
  }

  private saveMesas(list: Mesa[]): void {
    if (this.isBrowser) localStorage.setItem(MESAS_KEY, JSON.stringify(list));
    this.mesas.set(list);
  }

  private savePedidos(list: PedidoMesa[]): void {
    if (this.isBrowser) localStorage.setItem(PEDIDOS_KEY, JSON.stringify(list));
    this.pedidos.set(list);
  }

  // ── Mesas CRUD ────────────────────────────────────────────────────────────
  agregarMesa(nombre: string): void {
    const mesas = this.mesas();
    const numero = mesas.length > 0 ? Math.max(...mesas.map(m => m.numero)) + 1 : 1;
    this.saveMesas([...mesas, {
      id: `m${Date.now()}`,
      numero,
      nombre: nombre || `Mesa ${numero}`,
      activa: true,
    }]);
  }

  eliminarMesa(id: string): void {
    this.saveMesas(this.mesas().filter(m => m.id !== id));
  }

  toggleMesa(id: string): void {
    this.saveMesas(this.mesas().map(m => m.id === id ? { ...m, activa: !m.activa } : m));
  }

  getMesaByNumero(numero: number): Mesa | undefined {
    return this.mesas().find(m => m.numero === numero);
  }

  // ── Pedidos ───────────────────────────────────────────────────────────────
  crearPedido(mesaId: string, items: ItemPedido[], notas = ''): PedidoMesa {
    const mesa = this.mesas().find(m => m.id === mesaId)!;
    const pedido: PedidoMesa = {
      id: `p${Date.now()}`,
      mesaId,
      numeroMesa: mesa.numero,
      nombreMesa: mesa.nombre,
      items,
      estado: 'pendiente',
      notas,
      fechaCreacion: Date.now(),
    };
    this.savePedidos([...this.pedidos(), pedido]);
    return pedido;
  }

  actualizarEstado(pedidoId: string, estado: EstadoPedido): void {
    this.savePedidos(this.pedidos().map(p => p.id === pedidoId ? { ...p, estado } : p));
  }

  eliminarPedido(pedidoId: string): void {
    this.savePedidos(this.pedidos().filter(p => p.id !== pedidoId));
  }

  limpiarEntregados(): void {
    this.savePedidos(this.pedidos().filter((p) => p.estado !== 'entregado'));
  }

  reload(): void {
    this.mesas.set(this.loadMesas());
    this.pedidos.set(this.loadPedidos());
  }

  totalItems(pedido: PedidoMesa): number {
    return pedido.items.reduce((s, i) => s + i.cantidad, 0);
  }
}
