import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CategoriaProducto } from '../../shared/data/servicios.data';

export type ProductoEtiqueta = 'nuevo' | 'oferta' | 'popular' | 'limitado';

export interface ProductoAdmin {
  id: string;
  slug: string;
  nombre: string;
  descripcionCorta: string;
  precio: string;
  categoria: CategoriaProducto;
  imagen?: string;
  icono: string;
  emoji: string;
  idealPara: string[];
  etiquetas: ProductoEtiqueta[];
  activo: boolean;
  fechaCreacion: number;
}

const STORAGE_KEY = 'fq_admin_productos';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly productos = signal<ProductoAdmin[]>([]);

  constructor() {
    this.productos.set(this.loadFromStorage());
  }

  getActivos(): ProductoAdmin[] {
    return this.productos().filter((p) => p.activo);
  }

  save(producto: ProductoAdmin): void {
    const lista = this.productos();
    const idx = lista.findIndex((p) => p.id === producto.id);
    const updated =
      idx >= 0
        ? lista.map((p) => (p.id === producto.id ? producto : p))
        : [...lista, producto];
    this.persist(updated);
  }

  delete(id: string): void {
    this.persist(this.productos().filter((p) => p.id !== id));
  }

  toggleActivo(id: string): void {
    this.persist(
      this.productos().map((p) =>
        p.id === id ? { ...p, activo: !p.activo } : p
      )
    );
  }

  generateId(): string {
    return `fq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  slugify(nombre: string): string {
    return `admin-${nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}`;
  }

  private persist(lista: ProductoAdmin[]): void {
    this.productos.set(lista);
    this.saveToStorage(lista);
  }

  private loadFromStorage(): ProductoAdmin[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ProductoAdmin[]) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(lista: ProductoAdmin[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {
      // storage full — silently ignore
    }
  }
}
