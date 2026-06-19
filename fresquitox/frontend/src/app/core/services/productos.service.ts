import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API } from '../config/api-endpoints';
import { CategoriaProducto } from '../../shared/data/servicios.data';

export type ProductoEtiqueta = 'nuevo' | 'oferta' | 'popular' | 'limitado';

export interface ProductoAdmin {
  id: string;
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcionSeo?: string;
  keywords?: string;
  contenido?: string[];
  precio: string;
  categoria: CategoriaProducto;
  imagen?: string;
  icono: string;
  emoji: string;
  idealPara: string[];
  etiquetas: ProductoEtiqueta[];
  activo: boolean;
  fechaCreacion: number;
  stock: number;
  stockMinimo: number;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  readonly productos = signal<ProductoAdmin[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) this.reload().subscribe();
  }

  reload(): Observable<void> {
    this.cargando.set(true);
    return this.http.get<ProductoAdmin[]>(API.productos).pipe(
      tap((list) => {
        this.productos.set(list);
        this.error.set(null);
        this.cargando.set(false);
      }),
      catchError((err) => {
        console.error('[ProductosService]', err);
        this.productos.set([]);
        this.error.set('No se pudo cargar productos');
        this.cargando.set(false);
        return of([]);
      }),
      map(() => void 0)
    );
  }

  loadActivos(): Observable<ProductoAdmin[]> {
    return this.http.get<ProductoAdmin[]>(API.productosActivos).pipe(
      tap((list) => this.productos.set(list)),
      catchError((err) => {
        console.error('[ProductosService] activos', err);
        return of([]);
      })
    );
  }

  getBySlug(slug: string): Observable<ProductoAdmin | null> {
    return this.http.get<ProductoAdmin>(API.productoBySlug(slug)).pipe(
      catchError((err) => {
        console.error('[ProductosService] slug', err);
        return of(null);
      })
    );
  }

  updateStock(id: string, delta: number): void {
    this.http.patch<ProductoAdmin>(API.productoStock(id), { delta }).subscribe({
      next: (p) => this.productos.update((list) => list.map((x) => (x.id === p.id ? p : x))),
      error: (err) => console.error('[ProductosService] stock', err),
    });
  }

  setStock(id: string, cantidad: number): void {
    this.http.patch<ProductoAdmin>(API.productoStock(id), { cantidad }).subscribe({
      next: (p) => this.productos.update((list) => list.map((x) => (x.id === p.id ? p : x))),
      error: (err) => console.error('[ProductosService] stock', err),
    });
  }

  getActivos(): ProductoAdmin[] {
    return this.productos().filter((p) => p.activo);
  }

  save(producto: ProductoAdmin): void {
    this.http.post<ProductoAdmin>(API.productos, producto).subscribe({
      next: (saved) => {
        this.productos.update((list) => {
          const idx = list.findIndex((p) => p.id === saved.id);
          return idx >= 0 ? list.map((p, i) => (i === idx ? saved : p)) : [saved, ...list];
        });
        this.reload().subscribe();
      },
      error: (err) => console.error('[ProductosService] save', err),
    });
  }

  delete(id: string): void {
    this.http.delete(API.producto(id)).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[ProductosService] delete', err),
    });
  }

  toggleActivo(id: string): void {
    this.http.patch<ProductoAdmin>(API.productoToggle(id), {}).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[ProductosService] toggle', err),
    });
  }

  generateId(): string {
    return `fq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  slugify(nombre: string, id?: string): string {
    const base = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const suffix = id?.split('-').pop() ?? Date.now().toString(36);
    return `admin-${base}-${suffix}`;
  }
}
