import { Component, inject, signal, computed, viewChild, ElementRef, afterNextRender, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser, SlicePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import {
  ProductosService,
  ProductoAdmin,
  ProductoEtiqueta,
} from '../../../core/services/productos.service';
import { MesasService, EstadoPedido } from '../../../core/services/mesas.service';
import { ReportesService, CATEGORIAS_GASTO, TipoMovimiento, CategoriaGasto } from '../../../core/services/reportes.service';
import { ChatbotService, FaqItem } from '../../../core/services/chatbot.service';
import { EventosService, Evento, TipoEvento } from '../../../core/services/eventos.service';
import { CATEGORIAS, CategoriaProducto } from '../../../shared/data/servicios.data';
import { forkJoin } from 'rxjs';

type Tab = 'resumen' | 'pedidos' | 'reportes' | 'productos' | 'mesas' | 'chatbot' | 'eventos';
type Periodo = 'hoy' | 'semana' | 'todo' | 'mes';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, ReactiveFormsModule, SlicePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class AdminDashboard implements OnDestroy {
  private readonly auth        = inject(AuthService);
  private readonly router      = inject(Router);
  private readonly fb          = inject(FormBuilder);
  private readonly productosSvc = inject(ProductosService);
  readonly mesasSvc            = inject(MesasService);
  readonly reportesSvc         = inject(ReportesService);
  readonly chatbotSvc          = inject(ChatbotService);
  private readonly platformId  = inject(PLATFORM_ID);

  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly baseUrl  = signal('');
  readonly ahora    = signal(Date.now());
  private tickTimer: ReturnType<typeof setInterval> | null = null;
  private pedidosPollTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.baseUrl.set(window.location.origin);
        forkJoin([
          this.productosSvc.reload(),
          this.mesasSvc.reload(),
          this.eventosSvc.reload(),
          this.reportesSvc.reload(),
        ]).subscribe();
        this.chatbotSvc.reload();
        this.tickTimer = setInterval(() => this.ahora.set(Date.now()), 30_000);
        this.pedidosPollTimer = setInterval(() => this.mesasSvc.reload().subscribe(), 15_000);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tickTimer) clearInterval(this.tickTimer);
    if (this.pedidosPollTimer) clearInterval(this.pedidosPollTimer);
  }

  tiempoDesde(ts: number): string {
    const mins = Math.floor((this.ahora() - ts) / 60_000);
    if (mins < 1)  return 'hace un momento';
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    return `hace ${hrs} h`;
  }

  qrUrl(numero: number): string {
    const url = `${this.baseUrl()}/mesa/${numero}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=1a1a2e&margin=8`;
  }

  mesaUrl(numero: number): string {
    return `${this.baseUrl()}/mesa/${numero}`;
  }

  nuevaMesa(): void {
    const n = this.mesasSvc.mesas().length + 1;
    this.mesasSvc.agregarMesa(`Mesa ${n}`);
  }

  cambiarEstado(pedidoId: string, estado: EstadoPedido): void {
    this.mesasSvc.actualizarEstado(pedidoId, estado);
  }

  eliminarPedidoMesa(pedidoId: string): void {
    this.mesasSvc.eliminarPedido(pedidoId);
  }

  limpiarEntregados(): void {
    this.mesasSvc.limpiarEntregados();
  }

  estadoLabel(e: EstadoPedido): string {
    return { pendiente: 'Pendiente', preparando: 'Preparando', listo: 'Listo', entregado: 'Entregado' }[e];
  }

  estadoSiguiente(e: EstadoPedido): EstadoPedido | null {
    const orden: EstadoPedido[] = ['pendiente', 'preparando', 'listo', 'entregado'];
    const idx = orden.indexOf(e);
    return idx < orden.length - 1 ? orden[idx + 1] : null;
  }

  // ── Reportes ─────────────────────────────────────────────────────────────
  readonly categoriasGasto = CATEGORIAS_GASTO;
  readonly periodoReporte  = signal<Periodo>('mes');

  // Mes seleccionado (por defecto: mes actual)
  private _now = new Date();
  readonly mesSelAnio = signal<number>(this._now.getFullYear());
  readonly mesSelMes  = signal<number>(this._now.getMonth());

  readonly mesesDisponibles = computed(() =>
    this.reportesSvc.mesesDisponibles(this.reportesSvc.movimientos())
  );

  // Movimientos según el período elegido
  readonly movsFiltrados = computed(() => {
    const p = this.periodoReporte();
    const movs = this.reportesSvc.movimientos();
    if (p === 'mes') return this.reportesSvc.filtrarPorMes(movs, this.mesSelAnio(), this.mesSelMes());
    return this.reportesSvc.filtrarPorPeriodo(movs, p);
  });

  // Mes anterior para comparativa (solo activo en modo 'mes')
  readonly mesAntInfo = computed(() => this.reportesSvc.mesAnterior(this.mesSelAnio(), this.mesSelMes()));

  readonly movsAnteriores = computed(() =>
    this.periodoReporte() === 'mes'
      ? this.reportesSvc.filtrarPorMes(this.reportesSvc.movimientos(), this.mesAntInfo().anio, this.mesAntInfo().mes)
      : []
  );

  readonly resumenReporte    = computed(() => this.reportesSvc.resumen(this.movsFiltrados()));
  readonly resumenAnterior   = computed(() => this.reportesSvc.resumen(this.movsAnteriores()));
  readonly gastosPorCategoria = computed(() => this.reportesSvc.gastosPorCategoria(this.movsFiltrados()));

  // Helper: variación % respecto al mes anterior
  variacion(actual: number, anterior: number): { pct: number; positivo: boolean } | null {
    if (anterior === 0) return null;
    const pct = Math.round(((actual - anterior) / anterior) * 100);
    return { pct, positivo: pct >= 0 };
  }

  seleccionarMes(key: string): void {
    const [a, m] = key.split('-').map(Number);
    this.mesSelAnio.set(a);
    this.mesSelMes.set(m);
  }

  mesKey(): string { return `${this.mesSelAnio()}-${this.mesSelMes()}`; }

  // Formulario rápido de movimiento
  readonly nuevoTipo      = signal<TipoMovimiento>('gasto');
  readonly nuevoConcepto  = signal('');
  readonly nuevoMonto     = signal<number | null>(null);
  readonly nuevaCategoria = signal<CategoriaGasto>('ingredientes');
  readonly nuevoNotas     = signal('');
  readonly guardandoMov   = signal(false);

  agregarMovimiento(): void {
    const monto = this.nuevoMonto();
    if (!this.nuevoConcepto().trim() || !monto || monto <= 0) return;
    this.guardandoMov.set(true);
    this.reportesSvc.agregar({
      tipo: this.nuevoTipo(),
      concepto: this.nuevoConcepto().trim(),
      monto,
      categoria: this.nuevoTipo() === 'ingreso' ? 'venta' : this.nuevaCategoria(),
      fecha: Date.now(),
      notas: this.nuevoNotas().trim(),
    });
    this.nuevoConcepto.set('');
    this.nuevoMonto.set(null);
    this.nuevoNotas.set('');
    this.guardandoMov.set(false);
  }

  // ── PDF Export ────────────────────────────────────────────────────────────
  readonly generandoPdf = signal(false);

  async exportarPDF(): Promise<void> {
    this.generandoPdf.set(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const periodo = this.periodoReporte() === 'mes'
        ? this.reportesSvc.labelMes(this.mesSelAnio(), this.mesSelMes())
        : ({ hoy: 'Hoy', semana: 'Esta semana', mes: 'Por mes', todo: 'Todo el tiempo' } as Record<string, string>)[this.periodoReporte()];

      const res   = this.resumenReporte();
      const ant   = this.resumenAnterior();
      const movs  = this.movsFiltrados();
      const cats  = this.gastosPorCategoria();
      const fmt   = (n: number) => this.reportesSvc.formatCOP(n);

      const pink  = [255, 70, 119] as [number, number, number];
      const dark  = [26, 26, 46]   as [number, number, number];
      const gray  = [120, 100, 90] as [number, number, number];
      const green = [22, 163, 74]  as [number, number, number];
      const red   = [220, 38, 38]  as [number, number, number];
      const W = 210;

      // ── Header
      doc.setFillColor(...dark);
      doc.rect(0, 0, W, 32, 'F');
      doc.setFillColor(...pink);
      doc.circle(14, 16, 3.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Fresquitox', 22, 14);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 180, 190);
      doc.text('Reporte financiero · ' + periodo, 22, 21);
      doc.setTextColor(180, 160, 170);
      doc.text(`Generado el ${new Date().toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' })}`, 22, 27);

      let y = 42;

      // ── Cards resumen
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...dark);
      doc.text('Resumen del período', 14, y);
      y += 6;

      const cards = [
        { label: 'Ingresos', val: fmt(res.ingresos), color: green },
        { label: 'Gastos',   val: fmt(res.gastos),   color: red   },
        { label: 'Balance',  val: (res.balance < 0 ? '−' : '') + fmt(res.balance), color: res.balance >= 0 ? green : red },
      ];
      const cardW = (W - 28 - 8) / 3;
      cards.forEach((c, i) => {
        const x = 14 + i * (cardW + 4);
        doc.setFillColor(245, 240, 238);
        doc.roundedRect(x, y, cardW, 20, 3, 3, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...gray);
        doc.text(c.label, x + 4, y + 6);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...c.color);
        doc.text(c.val, x + 4, y + 14);
      });
      y += 26;

      // ── Comparativa mes anterior (solo en modo mes)
      if (this.periodoReporte() === 'mes' && this.movsAnteriores().length > 0) {
        const antLabel = this.reportesSvc.labelMes(this.mesAntInfo().anio, this.mesAntInfo().mes);
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...dark);
        doc.text(`Comparativa vs ${antLabel}`, 14, y); y += 5;

        const rows = [
          ['Ingresos', fmt(ant.ingresos), fmt(res.ingresos)],
          ['Gastos',   fmt(ant.gastos),   fmt(res.gastos)],
          ['Balance',  fmt(ant.balance),  fmt(res.balance)],
        ];
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...gray);
        doc.text('Concepto', 16, y);
        doc.text(antLabel, 95, y, { align: 'right' });
        doc.text(periodo ?? '', 160, y, { align: 'right' });
        y += 3;
        doc.setDrawColor(220, 210, 205);
        doc.line(14, y, W - 14, y);
        y += 4;
        rows.forEach(r => {
          doc.setTextColor(...dark); doc.text(r[0], 16, y);
          doc.setTextColor(...gray); doc.text(r[1], 95, y, { align: 'right' });
          doc.setTextColor(...dark); doc.text(r[2], 160, y, { align: 'right' });
          y += 5;
        });
        y += 4;
      }

      // ── Gastos por categoría
      if (cats.length > 0) {
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...dark);
        doc.text('Gastos por categoría', 14, y); y += 6;

        cats.forEach(c => {
          doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...dark);
          doc.text(c.label, 16, y);
          doc.setTextColor(...red);
          doc.text(fmt(c.monto), 130, y, { align: 'right' });
          doc.setTextColor(...gray);
          doc.text(`${c.pct}%`, 150, y);
          // barra
          doc.setFillColor(245, 220, 225);
          doc.roundedRect(155, y - 3, 40, 4, 1, 1, 'F');
          doc.setFillColor(...red);
          doc.roundedRect(155, y - 3, 40 * c.pct / 100, 4, 1, 1, 'F');
          y += 6;
        });
        y += 4;
      }

      // ── Historial
      if (movs.length > 0) {
        if (y > 230) { doc.addPage(); y = 20; }
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...dark);
        doc.text('Historial de movimientos', 14, y); y += 5;

        doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...gray);
        doc.text('Fecha', 14, y);
        doc.text('Concepto', 40, y);
        doc.text('Categoría', 120, y);
        doc.text('Monto', W - 14, y, { align: 'right' });
        y += 2;
        doc.setDrawColor(220, 210, 205);
        doc.line(14, y, W - 14, y);
        y += 4;

        for (const m of movs) {
          if (y > 270) { doc.addPage(); y = 20; }
          const fecha = new Date(m.fecha).toLocaleDateString('es-CO', { day:'2-digit', month:'short' });
          doc.setTextColor(...gray);   doc.text(fecha, 14, y);
          doc.setTextColor(...dark);   doc.text(m.concepto.slice(0, 40), 40, y);
          doc.setTextColor(...gray);   doc.text(m.categoria, 120, y);
          doc.setTextColor(m.tipo === 'ingreso' ? green[0] : red[0], m.tipo === 'ingreso' ? green[1] : red[1], m.tipo === 'ingreso' ? green[2] : red[2]);
          doc.text((m.tipo === 'gasto' ? '−' : '+') + fmt(m.monto), W - 14, y, { align: 'right' });
          y += 5.5;
        }
      }

      // ── Footer
      const pages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(...gray);
        doc.text(`Fresquitox Admin · Pág ${i} de ${pages}`, W / 2, 290, { align: 'center' });
      }

      doc.save(`Fresquitox_Reporte_${(periodo ?? 'reporte').replace(/\s/g, '_')}.pdf`);
    } finally {
      this.generandoPdf.set(false);
    }
  }

  // ── Chatbot / FAQs ────────────────────────────────────────────────────────
  readonly faqEditandoId  = signal<string | null>(null);
  readonly faqPregunta    = signal('');
  readonly faqRespuesta   = signal('');
  readonly faqKeywords    = signal('');
  readonly mostrarFaqForm = signal(false);

  abrirFaqNueva(): void {
    this.faqEditandoId.set(null);
    this.faqPregunta.set(''); this.faqRespuesta.set(''); this.faqKeywords.set('');
    this.mostrarFaqForm.set(true);
  }

  editarFaq(f: FaqItem): void {
    this.faqEditandoId.set(f.id);
    this.faqPregunta.set(f.pregunta);
    this.faqRespuesta.set(f.respuesta);
    this.faqKeywords.set(f.keywords.join(', '));
    this.mostrarFaqForm.set(true);
  }

  guardarFaq(): void {
    const p = this.faqPregunta().trim();
    const r = this.faqRespuesta().trim();
    if (!p || !r) return;
    const kws = this.faqKeywords().split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    const id = this.faqEditandoId();
    if (id) {
      this.chatbotSvc.actualizarFaq(id, { pregunta: p, respuesta: r, keywords: kws });
    } else {
      this.chatbotSvc.agregarFaq(p, r, kws);
    }
    this.mostrarFaqForm.set(false);
  }

  cancelarFaq(): void { this.mostrarFaqForm.set(false); }

  // ── Eventos ───────────────────────────────────────────────────────────────
  readonly eventosSvc = inject(EventosService);
  readonly evEditandoId  = signal<string | null>(null);
  readonly mostrarEvForm = signal(false);
  // Campos del formulario
  readonly evTitulo      = signal('');
  readonly evFecha       = signal('');
  readonly evHora        = signal('');
  readonly evTipo        = signal<TipoEvento>('dj');
  readonly evArtista     = signal('');
  readonly evDescripcion = signal('');
  readonly evEmoji       = signal('🎧');
  readonly evDestacado   = signal(false);

  abrirEvNuevo(): void {
    this.evEditandoId.set(null);
    this.evTitulo.set(''); this.evFecha.set(''); this.evHora.set('7:00 PM - 10:00 PM');
    this.evTipo.set('dj'); this.evArtista.set(''); this.evDescripcion.set('');
    this.evEmoji.set('🎧'); this.evDestacado.set(false);
    this.mostrarEvForm.set(true);
  }

  editarEv(ev: Evento): void {
    this.evEditandoId.set(ev.id);
    this.evTitulo.set(ev.titulo); this.evFecha.set(ev.fecha); this.evHora.set(ev.hora);
    this.evTipo.set(ev.tipo); this.evArtista.set(ev.artista);
    this.evDescripcion.set(ev.descripcion); this.evEmoji.set(ev.emoji);
    this.evDestacado.set(ev.destacado);
    this.mostrarEvForm.set(true);
  }

  guardarEv(): void {
    const t = this.evTitulo().trim(); const f = this.evFecha(); const h = this.evHora().trim();
    if (!t || !f || !h) return;
    const data = {
      titulo: t, fecha: f, hora: h, tipo: this.evTipo(),
      artista: this.evArtista().trim(), descripcion: this.evDescripcion().trim(),
      emoji: this.evEmoji() || '🎉', destacado: this.evDestacado(), activo: true,
    };
    const id = this.evEditandoId();
    if (id) { this.eventosSvc.actualizar(id, data); } else { this.eventosSvc.agregar(data); }
    this.mostrarEvForm.set(false);
  }

  cancelarEv(): void { this.mostrarEvForm.set(false); }

  tipoEmojiEv(tipo: TipoEvento): string {
    return this.eventosSvc.TIPOS.find(t => t.key === tipo)?.emoji ?? '🎉';
  }

  // ── Config IA ─────────────────────────────────────────────────────────────
  readonly apiKeyInput = signal('');
  cargarApiKey(): void  { this.apiKeyInput.set(this.chatbotSvc.apiKey()); }
  guardarApiKey(): void { this.chatbotSvc.setApiKey(this.apiKeyInput().trim()); }
  toggleIA(): void      { this.chatbotSvc.setAiActiva(!this.chatbotSvc.aiActiva()); }

  // ── Columnas del board de pedidos ────────────────────────────────────────
  readonly pedidosPendientes  = computed(() => this.mesasSvc.pedidos().filter(p => p.estado === 'pendiente'));
  readonly pedidosPreparando  = computed(() => this.mesasSvc.pedidos().filter(p => p.estado === 'preparando'));
  readonly pedidosListos      = computed(() => this.mesasSvc.pedidos().filter(p => p.estado === 'listo'));
  readonly pedidosEntregados  = computed(() => this.mesasSvc.pedidos().filter(p => p.estado === 'entregado').slice(-10).reverse());
  readonly totalPendientes    = computed(() => this.pedidosPendientes().length + this.pedidosPreparando().length + this.pedidosListos().length);

  // Resumen agrupado por producto: qué producto, cuántos en total y de qué mesas
  readonly resumenPreparacion = computed(() => {
    const pedidos = this.mesasSvc.pedidos().filter(p => p.estado === 'pendiente' || p.estado === 'preparando');
    const mapa = new Map<string, { nombre: string; totalCantidad: number; mesas: { mesa: string; cantidad: number }[] }>();
    for (const pedido of pedidos) {
      for (const item of pedido.items) {
        const entry = mapa.get(item.productoId) ?? { nombre: item.nombre, totalCantidad: 0, mesas: [] };
        entry.totalCantidad += item.cantidad;
        const mesaEntry = entry.mesas.find(m => m.mesa === pedido.nombreMesa);
        if (mesaEntry) { mesaEntry.cantidad += item.cantidad; }
        else { entry.mesas.push({ mesa: pedido.nombreMesa, cantidad: item.cantidad }); }
        mapa.set(item.productoId, entry);
      }
    }
    return [...mapa.values()].sort((a, b) => b.totalCantidad - a.totalCantidad);
  });

  // ── Tabs
  readonly tabActiva = signal<Tab>('resumen');

  // ── Stats computadas
  readonly totalActivos     = computed(() => this.productosSvc.getActivos().length);
  readonly totalProductos   = computed(() => this.productosSvc.productos().length);
  readonly productosAgotados = computed(() => this.productosSvc.productos().filter(p => p.activo && p.stock === 0).length);
  readonly productosBajoStock = computed(() => this.productosSvc.productos().filter(p => p.activo && p.stock > 0 && p.stock <= p.stockMinimo).length);
  readonly alertasStock     = computed(() => this.productosAgotados() + this.productosBajoStock());

  // ── Productos
  readonly categorias = CATEGORIAS;
  readonly etiquetasDisponibles: { id: ProductoEtiqueta; label: string; color: string }[] = [
    { id: 'nuevo',    label: 'Nuevo',    color: '#22c55e' },
    { id: 'oferta',   label: 'Oferta',   color: '#ef4444' },
    { id: 'popular',  label: 'Popular',  color: '#f59e0b' },
    { id: 'limitado', label: 'Limitado', color: '#8b5cf6' },
  ];

  readonly productos = this.productosSvc.productos;
  readonly productosPorCategoria = computed(() =>
    this.categorias.map((cat) => ({
      ...cat,
      items: this.productos().filter((p) => p.categoria === cat.id),
    }))
  );

  readonly editandoId        = signal<string | null>(null);
  readonly imagenPreview     = signal<string | null>(null);
  readonly mostrarForm       = signal(false);
  readonly guardando         = signal(false);
  readonly confirmarEliminar = signal<string | null>(null);
  readonly editandoStockId   = signal<string | null>(null);
  readonly stockTemporal     = signal<number>(0);

  readonly form = this.fb.group({
    nombre:           ['', [Validators.required, Validators.minLength(2)]],
    descripcionCorta: ['', [Validators.required, Validators.minLength(10)]],
    precio:           ['', Validators.required],
    categoria:        ['clasicos' as CategoriaProducto],
    icono:            ['🍧'],
    etiquetas:        [[] as ProductoEtiqueta[]],
    stock:            [0, [Validators.required, Validators.min(0)]],
    stockMinimo:      [5, [Validators.required, Validators.min(0)]],
  });

  // ── Auth
  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/admin/login']);
  }

  // ── Productos CRUD
  abrirNuevo(): void {
    this.editandoId.set(null);
    this.imagenPreview.set(null);
    this.form.reset({ nombre: '', descripcionCorta: '', precio: '', categoria: 'clasicos', icono: '🍧', etiquetas: [], stock: 0, stockMinimo: 5 });
    this.mostrarForm.set(true);
  }

  editarProducto(p: ProductoAdmin): void {
    this.editandoId.set(p.id);
    this.imagenPreview.set(p.imagen ?? null);
    this.form.patchValue({ nombre: p.nombre, descripcionCorta: p.descripcionCorta, precio: p.precio, categoria: p.categoria, icono: p.icono, etiquetas: [...p.etiquetas], stock: p.stock ?? 0, stockMinimo: p.stockMinimo ?? 5 });
    this.mostrarForm.set(true);
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.imagenPreview.set(null);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('La imagen no puede superar 2 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  toggleEtiqueta(e: ProductoEtiqueta): void {
    const actuales = (this.form.controls['etiquetas'].value ?? []) as ProductoEtiqueta[];
    this.form.controls['etiquetas'].setValue(
      actuales.includes(e) ? actuales.filter((x) => x !== e) : [...actuales, e]
    );
  }

  tieneEtiqueta(e: ProductoEtiqueta): boolean {
    return ((this.form.controls['etiquetas'].value ?? []) as ProductoEtiqueta[]).includes(e);
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando.set(true);
    const v = this.form.getRawValue();
    const id = this.editandoId() ?? this.productosSvc.generateId();

    const existing = this.productosSvc.productos().find((p) => p.id === id);
    const producto: ProductoAdmin = {
      id,
      slug: existing?.slug ?? this.productosSvc.slugify(v.nombre ?? '', id),
      nombre: v.nombre ?? '',
      descripcionCorta: v.descripcionCorta ?? '',
      precio: v.precio ?? '',
      categoria: (v.categoria ?? 'clasicos') as CategoriaProducto,
      icono: v.icono ?? '🍧',
      emoji: v.icono ?? '🍧',
      imagen: this.imagenPreview() ?? undefined,
      idealPara: [],
      etiquetas: (v.etiquetas ?? []) as ProductoEtiqueta[],
      activo: existing?.activo ?? true,
      fechaCreacion: existing?.fechaCreacion ?? Date.now(),
      stock: v.stock ?? 0,
      stockMinimo: v.stockMinimo ?? 5,
    };

    this.productosSvc.save(producto);
    this.guardando.set(false);
    this.cancelar();
  }

  eliminar(id: string): void {
    this.productosSvc.delete(id);
    this.confirmarEliminar.set(null);
  }

  toggleActivo(id: string): void {
    this.productosSvc.toggleActivo(id);
  }

  ajustarStock(id: string, delta: number): void {
    this.productosSvc.updateStock(id, delta);
  }

  iniciarEditStock(p: ProductoAdmin): void {
    this.editandoStockId.set(p.id);
    this.stockTemporal.set(p.stock ?? 0);
  }

  confirmarStock(id: string): void {
    this.productosSvc.setStock(id, this.stockTemporal());
    this.editandoStockId.set(null);
  }

  cancelarEditStock(): void {
    this.editandoStockId.set(null);
  }

  stockStatus(p: ProductoAdmin): 'ok' | 'bajo' | 'agotado' {
    if (p.stock === 0) return 'agotado';
    if (p.stock <= p.stockMinimo) return 'bajo';
    return 'ok';
  }
}
