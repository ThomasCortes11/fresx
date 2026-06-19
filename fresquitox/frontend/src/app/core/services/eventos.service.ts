import { Injectable, signal, PLATFORM_ID, inject, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API } from '../config/api-endpoints';

export type TipoEvento = 'dj' | 'musica-en-vivo' | 'karaoke' | 'especial';

export interface Evento {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  tipo: TipoEvento;
  artista: string;
  descripcion: string;
  emoji: string;
  destacado: boolean;
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private get isBrowser() { return isPlatformBrowser(this.platformId); }

  readonly eventos = signal<Evento[]>([]);
  readonly error = signal<string | null>(null);

  readonly eventosActivos = computed(() =>
    this.eventos().filter(e => e.activo).sort((a, b) => a.fecha.localeCompare(b.fecha))
  );

  readonly eventoDestacado = computed(() =>
    this.eventosActivos().find(e => e.destacado) ?? this.eventosActivos()[0] ?? null
  );

  constructor() {
    if (this.isBrowser) this.reload().subscribe();
  }

  reload(): Observable<void> {
    return this.http.get<Evento[]>(API.eventos).pipe(
      tap((list) => {
        this.eventos.set(list);
        this.error.set(null);
      }),
      catchError((err) => {
        console.error('[EventosService]', err);
        this.eventos.set([]);
        this.error.set('No se pudo cargar eventos');
        return of([]);
      }),
      map(() => void 0)
    );
  }

  agregar(data: Omit<Evento, 'id'>): void {
    this.http.post<Evento>(API.eventos, data).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[EventosService] agregar', err),
    });
  }

  actualizar(id: string, data: Partial<Evento>): void {
    this.http.patch<Evento>(API.evento(id), data).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[EventosService] actualizar', err),
    });
  }

  eliminar(id: string): void {
    this.http.delete(API.evento(id)).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[EventosService] eliminar', err),
    });
  }

  toggleActivo(id: string): void {
    this.http.patch<Evento>(API.eventoToggleActivo(id), {}).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[EventosService] toggleActivo', err),
    });
  }

  toggleDestacado(id: string): void {
    this.http.patch<Evento>(API.eventoToggleDestacado(id), {}).subscribe({
      next: () => this.reload().subscribe(),
      error: (err) => console.error('[EventosService] toggleDestacado', err),
    });
  }

  readonly TIPOS: { key: TipoEvento; label: string; emoji: string }[] = [
    { key: 'dj',           label: 'DJ Set',        emoji: '🎧' },
    { key: 'musica-en-vivo', label: 'Música en Vivo', emoji: '🎸' },
    { key: 'karaoke',      label: 'Karaoke',        emoji: '🎤' },
    { key: 'especial',     label: 'Especial',        emoji: '✨' },
  ];
}
