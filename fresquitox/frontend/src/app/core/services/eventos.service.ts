import { Injectable, signal, PLATFORM_ID, inject, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type TipoEvento = 'dj' | 'musica-en-vivo' | 'karaoke' | 'especial';

export interface Evento {
  id: string;
  titulo: string;
  fecha: string;       // YYYY-MM-DD
  hora: string;        // ej. "7:00 PM - 11:00 PM"
  tipo: TipoEvento;
  artista: string;
  descripcion: string;
  emoji: string;
  destacado: boolean;
  activo: boolean;
}

const KEY = 'fq_eventos';
const VER_KEY = 'fq_eventos_v';
const CURRENT_VER = '1';

const EVENTOS_DEFAULT: Evento[] = [
  {
    id: 'ev1',
    titulo: 'Noche de DJ — Tropical House',
    fecha: '2026-06-07',
    hora: '7:00 PM - 11:00 PM',
    tipo: 'dj',
    artista: 'DJ Fresqui',
    descripcion: 'Beats tropicales mezclados con lo mejor del house mientras disfrutas granizados con licor bajo las luces.',
    emoji: '🎧',
    destacado: true,
    activo: true,
  },
  {
    id: 'ev2',
    titulo: 'Acústico en Vivo — Vallenato Fusión',
    fecha: '2026-06-13',
    hora: '6:00 PM - 9:00 PM',
    tipo: 'musica-en-vivo',
    artista: 'Los Refrescantes',
    descripcion: 'Vallenato fusionado con pop y bossa nova. Música suave para acompañar tus jugos y smoothies al atardecer.',
    emoji: '🎸',
    destacado: false,
    activo: true,
  },
  {
    id: 'ev3',
    titulo: 'Karaoke Night — ¡Canta y Refresca!',
    fecha: '2026-06-20',
    hora: '7:00 PM - 10:00 PM',
    tipo: 'karaoke',
    artista: 'Micrófono abierto',
    descripcion: 'Sube al escenario, canta tu favorita y gana granizados gratis. El público vota por el mejor.',
    emoji: '🎤',
    destacado: false,
    activo: true,
  },
  {
    id: 'ev4',
    titulo: 'Noche Especial — Lanzamiento Nuevos Sabores',
    fecha: '2026-06-27',
    hora: '5:00 PM - 10:00 PM',
    tipo: 'especial',
    artista: 'Equipo Fresquitox',
    descripcion: 'Sé de los primeros en probar nuestros nuevos sabores de temporada. Degustación gratuita, DJ en vivo y sorpresas.',
    emoji: '✨',
    destacado: true,
    activo: true,
  },
];

@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly platformId = inject(PLATFORM_ID);
  private get isBrowser() { return isPlatformBrowser(this.platformId); }

  readonly eventos = signal<Evento[]>(this.load());

  readonly eventosActivos = computed(() =>
    this.eventos().filter(e => e.activo).sort((a, b) => a.fecha.localeCompare(b.fecha))
  );

  readonly eventoDestacado = computed(() =>
    this.eventosActivos().find(e => e.destacado) ?? this.eventosActivos()[0] ?? null
  );

  private load(): Evento[] {
    if (!this.isBrowser) return EVENTOS_DEFAULT;
    try {
      const ver = localStorage.getItem(VER_KEY);
      if (ver !== CURRENT_VER) {
        const raw = localStorage.getItem(KEY);
        const stored: Evento[] = raw ? (JSON.parse(raw) as Evento[]) : [];
        const defaultIds = new Set(EVENTOS_DEFAULT.map(e => e.id));
        const custom = stored.filter(e => !defaultIds.has(e.id));
        const merged = [...EVENTOS_DEFAULT, ...custom];
        localStorage.setItem(KEY, JSON.stringify(merged));
        localStorage.setItem(VER_KEY, CURRENT_VER);
        return merged;
      }
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Evento[]) : EVENTOS_DEFAULT;
    } catch { return EVENTOS_DEFAULT; }
  }

  private save(list: Evento[]): void {
    if (this.isBrowser) {
      localStorage.setItem(KEY, JSON.stringify(list));
      localStorage.setItem(VER_KEY, CURRENT_VER);
    }
    this.eventos.set(list);
  }

  agregar(data: Omit<Evento, 'id'>): void {
    this.save([...this.eventos(), { ...data, id: `ev${Date.now()}` }]);
  }

  actualizar(id: string, data: Partial<Evento>): void {
    this.save(this.eventos().map(e => e.id === id ? { ...e, ...data } : e));
  }

  eliminar(id: string): void {
    this.save(this.eventos().filter(e => e.id !== id));
  }

  toggleActivo(id: string): void {
    this.save(this.eventos().map(e => e.id === id ? { ...e, activo: !e.activo } : e));
  }

  toggleDestacado(id: string): void {
    // Solo un evento puede ser destacado a la vez
    this.save(this.eventos().map(e => ({ ...e, destacado: e.id === id ? !e.destacado : false })));
  }

  reload(): void { this.eventos.set(this.load()); }

  readonly TIPOS: { key: TipoEvento; label: string; emoji: string }[] = [
    { key: 'dj',           label: 'DJ Set',        emoji: '🎧' },
    { key: 'musica-en-vivo', label: 'Música en Vivo', emoji: '🎸' },
    { key: 'karaoke',      label: 'Karaoke',        emoji: '🎤' },
    { key: 'especial',     label: 'Especial',        emoji: '✨' },
  ];
}
