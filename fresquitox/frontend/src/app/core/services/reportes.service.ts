import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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

const KEY = 'fq_reportes';

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly platformId = inject(PLATFORM_ID);
  private get isBrowser() { return isPlatformBrowser(this.platformId); }

  readonly movimientos = signal<Movimiento[]>(this.load());

  private load(): Movimiento[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Movimiento[]) : [];
    } catch { return []; }
  }

  private save(list: Movimiento[]): void {
    if (this.isBrowser) localStorage.setItem(KEY, JSON.stringify(list));
    this.movimientos.set(list);
  }

  agregar(m: Omit<Movimiento, 'id'>): void {
    this.save([{ id: `r${Date.now()}`, ...m }, ...this.movimientos()]);
  }

  eliminar(id: string): void {
    this.save(this.movimientos().filter(m => m.id !== id));
  }

  reload(): void {
    this.movimientos.set(this.load());
  }

  // ── Filtros ───────────────────────────────────────────────────────────────
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

  // Devuelve todos los meses que tienen al menos un movimiento
  mesesDisponibles(movs: Movimiento[]): { anio: number; mes: number; label: string }[] {
    const set = new Set<string>();
    for (const m of movs) {
      const d = new Date(m.fecha);
      set.add(`${d.getFullYear()}-${d.getMonth()}`);
    }
    // Siempre incluir el mes actual y el anterior
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

  // ── Computed helpers ──────────────────────────────────────────────────────
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
