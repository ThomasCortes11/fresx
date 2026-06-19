import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API } from '../config/api-endpoints';

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

@Injectable({ providedIn: 'root' })
export class MesasService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private get isBrowser() { return isPlatformBrowser(this.platformId); }

  readonly mesas = signal<Mesa[]>([]);
  readonly pedidos = signal<PedidoMesa[]>([]);
  readonly error = signal<string | null>(null);

  readonly pedidosActivos = computed(() =>
    this.pedidos().filter(p => p.estado !== 'entregado')
  );

  readonly pedidosPorMesa = computed(() =>
    this.mesas().map(m => ({
      ...m,
      pedidos: this.pedidosActivos().filter(p => p.mesaId === m.id),
    }))
  );

  constructor() {
    if (this.isBrowser) this.reload().subscribe();
  }

  reload(): Observable<void> {
    if (!this.isBrowser) return of(void 0);
    return forkJoin({
      mesas: this.http.get<Mesa[]>(API.mesas),
      pedidos: this.http.get<PedidoMesa[]>(API.pedidos),
    }).pipe(
      tap(({ mesas, pedidos }) => {
        this.mesas.set(mesas);
        this.pedidos.set(pedidos);
        this.error.set(null);
      }),
      catchError((err) => {
        console.error('[MesasService]', err);
        this.mesas.set([]);
        this.pedidos.set([]);
        this.error.set('No se pudo cargar mesas/pedidos');
        return of({ mesas: [], pedidos: [] });
      }),
      map(() => void 0)
    );
  }

  agregarMesa(nombre: string): void {
    this.http.post<Mesa>(API.mesas, { nombre }).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[MesasService] agregarMesa', err),
    });
  }

  eliminarMesa(id: string): void {
    this.http.delete(API.mesa(id)).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[MesasService] eliminarMesa', err),
    });
  }

  toggleMesa(id: string): void {
    this.http.patch<Mesa>(API.mesaToggle(id), {}).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[MesasService] toggleMesa', err),
    });
  }

  getMesaByNumero(numero: number): Mesa | undefined {
    return this.mesas().find(m => m.numero === numero);
  }

  crearPedido(
    mesaId: string,
    items: ItemPedido[],
    notas = '',
    onOk?: (p: PedidoMesa) => void,
    onError?: () => void
  ): void {
    this.http.post<PedidoMesa>(API.pedidos, { mesaId, items, notas }).subscribe({
      next: (pedido) => {
        this.pedidos.update((list) => [...list, pedido]);
        onOk?.(pedido);
      },
      error: (err) => {
        console.error('[MesasService] crearPedido', err);
        onError?.();
      },
    });
  }

  actualizarEstado(pedidoId: string, estado: EstadoPedido): void {
    this.http.patch<PedidoMesa>(API.pedidoEstado(pedidoId), { estado }).subscribe({
      next: (p) => this.pedidos.update((list) => list.map((x) => (x.id === p.id ? p : x))),
      error: (err) => console.error('[MesasService] actualizarEstado', err),
    });
  }

  eliminarPedido(pedidoId: string): void {
    this.http.delete(API.pedido(pedidoId)).subscribe({
      next: () => this.pedidos.update((list) => list.filter((p) => p.id !== pedidoId)),
      error: (err) => console.error('[MesasService] eliminarPedido', err),
    });
  }

  limpiarEntregados(): void {
    this.http.delete(API.pedidos).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[MesasService] limpiarEntregados', err),
    });
  }

  totalItems(pedido: PedidoMesa): number {
    return pedido.items.reduce((s, i) => s + i.cantidad, 0);
  }
}
