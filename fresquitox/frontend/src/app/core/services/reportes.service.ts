import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API } from '../config/api-endpoints';

export type TipoMovimiento = 'ingreso' | 'gasto';

export type CategoriaGasto =
  | 'ingredientes'
  | 'suministros'
  | 'servicios'
  | 'personal'
  | 'arriendo'
  | 'marketing'
  | 'otro';

export interface Movimiento {
  id: string;
  tipo: TipoMovimiento;
  concepto: string;
  monto: number;
  categoria: CategoriaGasto | 'venta';
  fecha: number;
  notas: string;
}

export const CATEGORIAS_GASTO: { id: CategoriaGasto; label: string }[] = [
  { id: 'ingredientes', label: 'Ingredientes' },
  { id: 'suministros',  label: 'Suministros' },
  { id: 'servicios',    label: 'Servicios / Utilities' },
  { id: 'personal',     label: 'Personal' },
  { id: 'arriendo',     label: 'Arriendo' },
  { id: 'marketing',    label: 'Marketing' },
  { id: 'otro',         label: 'Otro' },
];

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private get isBrowser() { return isPlatformBrowser(this.platformId); }

  readonly movimientos = signal<Movimiento[]>([]);
  readonly error = signal<string | null>(null);

  constructor() {
    if (this.isBrowser) this.reload().subscribe();
  }

  reload(): Observable<void> {
    return this.http.get<Movimiento[]>(API.movimientos).pipe(
      tap((list) => {
        this.movimientos.set(list);
        this.error.set(null);
      }),
      catchError((err) => {
        console.error('[ReportesService]', err);
        this.movimientos.set([]);
        this.error.set('No se pudo cargar reportes');
        return of([]);
      }),
      map(() => void 0)
    );
  }

  agregar(m: Omit<Movimiento, 'id'>): void {
    this.http.post<Movimiento>(API.movimientos, m).subscribe({
      next: (mov) => this.movimientos.update((list) => [mov, ...list]),
      error: (err) => console.error('[ReportesService] agregar', err),
    });
  }

  eliminar(id: string): void {
    this.http.delete(API.movimiento(id)).subscribe({
      next: () => this.movimientos.update((list) => list.filter((x) => x.id !== id)),
      error: (err) => console.error('[ReportesService] eliminar', err),
    });
  }

  filtrarPorPeriodo(movs: Movimiento[], periodo: 'hoy' | 'semana' | 'todo'): Movimiento[] {
    if (periodo === 'todo') return movs;
    const ahora = Date.now();
    const corte: Record<string, number> = {
      hoy:    ahora - 86_400_000,
      semana: ahora - 7 * 86_400_000,
    };
    return movs.filter(m => m.fecha >= corte[periodo]);
  }

  filtrarPorMes(movs: Movimiento[], anio: number, mes: number): Movimiento[] {
    return movs.filter(m => {
      const d = new Date(m.fecha);
      return d.getFullYear() === anio && d.getMonth() === mes;
    });
  }

  mesesDisponibles(movs: Movimiento[]): { anio: number; mes: number; label: string }[] {
    const set = new Set<string>();
    for (const m of movs) {
      const d = new Date(m.fecha);
      set.add(`${d.getFullYear()}-${d.getMonth()}`);
    }
    const now = new Date();
    set.add(`${now.getFullYear()}-${now.getMonth()}`);
    const prev = new Date(now.getFullYear(), now.getMonth() - 1);
    set.add(`${prev.getFullYear()}-${prev.getMonth()}`);

    return [...set]
      .map(s => {
        const [a, m] = s.split('-').map(Number);
        return { anio: a, mes: m, label: this.labelMes(a, m) };
      })
      .sort((a, b) => b.anio - a.anio || b.mes - a.mes);
  }

  labelMes(anio: number, mes: number): string {
    const nombres = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                     'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return `${nombres[mes]} ${anio}`;
  }

  mesAnterior(anio: number, mes: number): { anio: number; mes: number } {
    return mes === 0 ? { anio: anio - 1, mes: 11 } : { anio, mes: mes - 1 };
  }

  resumen(movs: Movimiento[]) {
    const ingresos = movs.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0);
    const gastos   = movs.filter(m => m.tipo === 'gasto').reduce((s, m) => s + m.monto, 0);
    return { ingresos, gastos, balance: ingresos - gastos };
  }

  gastosPorCategoria(movs: Movimiento[]) {
    const gastos = movs.filter(m => m.tipo === 'gasto');
    const totalGastos = gastos.reduce((s, m) => s + m.monto, 0);
    const mapa = new Map<string, number>();
    for (const g of gastos) {
      mapa.set(g.categoria, (mapa.get(g.categoria) ?? 0) + g.monto);
    }
    return [...mapa.entries()]
      .map(([cat, monto]) => ({
        cat,
        label: CATEGORIAS_GASTO.find(c => c.id === cat)?.label ?? cat,
        monto,
        pct: totalGastos > 0 ? Math.round((monto / totalGastos) * 100) : 0,
      }))
      .sort((a, b) => b.monto - a.monto);
  }

  formatCOP(n: number): string {
    return '$' + Math.abs(n).toLocaleString('es-CO');
  }
}
