import {
  Component,
  inject,
  signal,
  computed,
  ElementRef,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ProductosService,
  ProductoAdmin,
  ProductoEtiqueta,
} from '../../../core/services/productos.service';
import { CATEGORIAS, CategoriaProducto } from '../../../shared/data/servicios.data';

@Component({
  selector: 'app-admin-productos',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export default class AdminProductos {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(ProductosService);
  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly categorias = CATEGORIAS;
  readonly etiquetasDisponibles: { id: ProductoEtiqueta; label: string; color: string }[] = [
    { id: 'nuevo', label: 'Nuevo', color: '#22c55e' },
    { id: 'oferta', label: 'Oferta', color: '#ef4444' },
    { id: 'popular', label: 'Popular', color: '#f59e0b' },
    { id: 'limitado', label: 'Limitado', color: '#8b5cf6' },
  ];

  readonly productos = this.svc.productos;
  readonly productosPorCategoria = computed(() => {
    const lista = this.productos();
    return this.categorias.map((cat) => ({
      ...cat,
      items: lista.filter((p) => p.categoria === cat.id),
    }));
  });

  readonly editandoId = signal<string | null>(null);
  readonly imagenPreview = signal<string | null>(null);
  readonly mostrarForm = signal(false);
  readonly guardando = signal(false);
  readonly confirmarEliminar = signal<string | null>(null);
  readonly editandoStockId = signal<string | null>(null);
  readonly stockTemporal = signal<number>(0);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcionCorta: ['', [Validators.required, Validators.minLength(10)]],
    precio: ['', Validators.required],
    categoria: ['clasicos' as CategoriaProducto],
    icono: ['🍧'],
    etiquetas: [[] as ProductoEtiqueta[]],
    stock: [0, [Validators.required, Validators.min(0)]],
    stockMinimo: [5, [Validators.required, Validators.min(0)]],
  });

  abrirNuevo(): void {
    this.editandoId.set(null);
    this.imagenPreview.set(null);
    this.form.reset({
      nombre: '',
      descripcionCorta: '',
      precio: '',
      categoria: 'clasicos',
      icono: '🍧',
      etiquetas: [],
      stock: 0,
      stockMinimo: 5,
    });
    this.mostrarForm.set(true);
  }

  editarProducto(p: ProductoAdmin): void {
    this.editandoId.set(p.id);
    this.imagenPreview.set(p.imagen ?? null);
    this.form.patchValue({
      nombre: p.nombre,
      descripcionCorta: p.descripcionCorta,
      precio: p.precio,
      categoria: p.categoria,
      icono: p.icono,
      etiquetas: [...p.etiquetas],
      stock: p.stock ?? 0,
      stockMinimo: p.stockMinimo ?? 5,
    });
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
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no puede superar 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  toggleEtiqueta(etiqueta: ProductoEtiqueta): void {
    const actuales = this.form.controls.etiquetas.value as ProductoEtiqueta[];
    const nuevas = actuales.includes(etiqueta)
      ? actuales.filter((e) => e !== etiqueta)
      : [...actuales, etiqueta];
    this.form.controls.etiquetas.setValue(nuevas);
  }

  tieneEtiqueta(etiqueta: ProductoEtiqueta): boolean {
    return (this.form.controls.etiquetas.value as ProductoEtiqueta[]).includes(etiqueta);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    const v = this.form.getRawValue();
    const id = this.editandoId() ?? this.svc.generateId();

    const existing = this.svc.productos().find((p) => p.id === id);
    const producto: ProductoAdmin = {
      id,
      slug: this.svc.slugify(v.nombre ?? ''),
      nombre: v.nombre ?? '',
      descripcionCorta: v.descripcionCorta ?? '',
      precio: v.precio ?? '',
      categoria: (v.categoria ?? 'clasicos') as CategoriaProducto,
      icono: v.icono || '🍧',
      emoji: v.icono ?? '🍧',
      imagen: this.imagenPreview() ?? undefined,
      idealPara: [],
      etiquetas: (v.etiquetas ?? []) as ProductoEtiqueta[],
      activo: existing?.activo ?? true,
      fechaCreacion: existing?.fechaCreacion ?? Date.now(),
      stock: v.stock ?? 0,
      stockMinimo: v.stockMinimo ?? 5,
    };

    this.svc.save(producto);
    this.guardando.set(false);
    this.cancelar();
  }

  eliminar(id: string): void {
    this.svc.delete(id);
    this.confirmarEliminar.set(null);
  }

  toggleActivo(id: string): void {
    this.svc.toggleActivo(id);
  }

  ajustarStock(id: string, delta: number): void {
    this.svc.updateStock(id, delta);
  }

  iniciarEditStock(p: ProductoAdmin): void {
    this.editandoStockId.set(p.id);
    this.stockTemporal.set(p.stock ?? 0);
  }

  confirmarStock(id: string): void {
    this.svc.setStock(id, this.stockTemporal());
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
