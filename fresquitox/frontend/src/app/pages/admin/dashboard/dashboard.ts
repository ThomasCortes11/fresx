import { Component, inject, signal, computed, viewChild, ElementRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  ProductosService,
  ProductoAdmin,
  ProductoEtiqueta,
} from '../../../core/services/productos.service';
import { CATEGORIAS, CategoriaProducto } from '../../../shared/data/servicios.data';

type Tab = 'resumen' | 'productos';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class AdminDashboard {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productosSvc = inject(ProductosService);

  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // ── Tabs
  readonly tabActiva = signal<Tab>('resumen');

  // ── Stats
  readonly stats = [
    { label: 'Pedidos hoy', value: '24', trend: '+12%' },
    { label: 'Productos activos', value: computed(() => String(this.productosSvc.getActivos().length + 8)), trend: 'Estable' },
    { label: 'Zonas de entrega', value: '12', trend: '+2 nuevas' },
    { label: 'Mensajes pendientes', value: '5', trend: 'Revisar' },
  ];

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

  readonly editandoId      = signal<string | null>(null);
  readonly imagenPreview   = signal<string | null>(null);
  readonly mostrarForm     = signal(false);
  readonly guardando       = signal(false);
  readonly confirmarEliminar = signal<string | null>(null);

  readonly form = this.fb.group({
    nombre:           ['', [Validators.required, Validators.minLength(2)]],
    descripcionCorta: ['', [Validators.required, Validators.minLength(10)]],
    precio:           ['', Validators.required],
    categoria:        ['clasicos' as CategoriaProducto],
    icono:            ['🍧'],
    etiquetas:        [[] as ProductoEtiqueta[]],
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
    this.form.reset({ nombre: '', descripcionCorta: '', precio: '', categoria: 'clasicos', icono: '🍧', etiquetas: [] });
    this.mostrarForm.set(true);
  }

  editarProducto(p: ProductoAdmin): void {
    this.editandoId.set(p.id);
    this.imagenPreview.set(p.imagen ?? null);
    this.form.patchValue({ nombre: p.nombre, descripcionCorta: p.descripcionCorta, precio: p.precio, categoria: p.categoria, icono: p.icono, etiquetas: [...p.etiquetas] });
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

    const producto: ProductoAdmin = {
      id,
      slug: this.productosSvc.slugify(v.nombre ?? ''),
      nombre: v.nombre ?? '',
      descripcionCorta: v.descripcionCorta ?? '',
      precio: v.precio ?? '',
      categoria: (v.categoria ?? 'clasicos') as CategoriaProducto,
      icono: v.icono ?? '🍧',
      emoji: v.icono ?? '🍧',
      imagen: this.imagenPreview() ?? undefined,
      idealPara: [],
      etiquetas: (v.etiquetas ?? []) as ProductoEtiqueta[],
      activo: true,
      fechaCreacion: this.editandoId()
        ? (this.productosSvc.productos().find((p) => p.id === id)?.fechaCreacion ?? Date.now())
        : Date.now(),
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
}
