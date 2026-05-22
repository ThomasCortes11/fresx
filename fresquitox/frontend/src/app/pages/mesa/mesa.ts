import {
  Component, inject, signal, computed, PLATFORM_ID, afterNextRender
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MesasService, ItemPedido, Mesa } from '../../core/services/mesas.service';
import { ProductosService, ProductoAdmin } from '../../core/services/productos.service';

@Component({
  selector: 'app-mesa',
  imports: [],
  templateUrl: './mesa.html',
  styleUrl: './mesa.scss',
})
export default class MesaComponent {
  private readonly route       = inject(ActivatedRoute);
  private readonly mesasSvc    = inject(MesasService);
  private readonly productosSvc = inject(ProductosService);
  private readonly platformId  = inject(PLATFORM_ID);

  readonly mesa         = signal<Mesa | null>(null);
  readonly productos    = computed(() => this.productosSvc.getActivos());
  readonly carrito      = signal<ItemPedido[]>([]);
  readonly notas        = signal('');
  readonly enviado      = signal(false);
  readonly enviando     = signal(false);
  readonly pedidoId     = signal<string | null>(null);
  readonly mesaNoEncontrada = signal(false);

  readonly totalItems = computed(() =>
    this.carrito().reduce((s, i) => s + i.cantidad, 0)
  );

  readonly totalPrecio = computed(() => {
    return this.carrito().reduce((sum, item) => {
      const num = parseInt(item.precio.replace(/\D/g, ''), 10) || 0;
      return sum + num * item.cantidad;
    }, 0);
  });

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.mesasSvc.reload();
      this.productosSvc.reload();
      const num = Number(this.route.snapshot.paramMap.get('numero'));
      const mesa = this.mesasSvc.getMesaByNumero(num);
      if (mesa && mesa.activa) {
        this.mesa.set(mesa);
      } else {
        this.mesaNoEncontrada.set(true);
      }
    });
  }

  cantidad(productoId: string): number {
    return this.carrito().find(i => i.productoId === productoId)?.cantidad ?? 0;
  }

  agregar(p: ProductoAdmin): void {
    const actual = this.carrito();
    const idx = actual.findIndex(i => i.productoId === p.id);
    if (idx >= 0) {
      this.carrito.set(actual.map((i, n) => n === idx ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      this.carrito.set([...actual, { productoId: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 }]);
    }
  }

  quitar(productoId: string): void {
    this.carrito.update(c => {
      const idx = c.findIndex(i => i.productoId === productoId);
      if (idx < 0) return c;
      const item = c[idx];
      if (item.cantidad <= 1) return c.filter((_, n) => n !== idx);
      return c.map((i, n) => n === idx ? { ...i, cantidad: i.cantidad - 1 } : i);
    });
  }

  enviarPedido(): void {
    const mesa = this.mesa();
    if (!mesa || this.carrito().length === 0) return;
    this.enviando.set(true);
    const pedido = this.mesasSvc.crearPedido(mesa.id, this.carrito(), this.notas());
    this.pedidoId.set(pedido.id);
    this.enviado.set(true);
    this.enviando.set(false);
  }

  nuevoPedido(): void {
    this.carrito.set([]);
    this.notas.set('');
    this.enviado.set(false);
    this.pedidoId.set(null);
  }

  formatPrecio(n: number): string {
    return '$' + n.toLocaleString('es-CO');
  }
}
