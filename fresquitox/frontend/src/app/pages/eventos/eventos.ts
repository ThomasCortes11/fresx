import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { CONTACT_INFO } from '../../shared/constants/contact-info';
import { EventosService, Evento } from '../../core/services/eventos.service';

export type { Evento };

@Component({
  selector: 'app-eventos',
  imports: [RouterLink, FormsModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss'
})
export default class Eventos implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly eventosSvc = inject(EventosService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly contact = CONTACT_INFO;

  filtroActivo = 'todos';

  // ── Reservation modal
  modalOpen = false;
  modalEvento: Evento | null = null;
  reserva = { nombre: '', telefono: '', personas: 2, mensaje: '' };
  reservaEnviada = false;
  enviando = false;

  readonly eqBars = Array.from({ length: 40 }, () => +(Math.random() * 0.8).toFixed(2));

  readonly tipos = [
    { key: 'todos',          label: 'Todos',          emoji: '🎉' },
    { key: 'dj',             label: 'DJ Sets',         emoji: '🎧' },
    { key: 'musica-en-vivo', label: 'Música en Vivo',  emoji: '🎸' },
    { key: 'karaoke',        label: 'Karaoke',         emoji: '🎤' },
    { key: 'especial',       label: 'Especiales',      emoji: '✨' },
  ];

  private readonly DIAS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  private readonly MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  get eventosFiltrados(): Evento[] {
    const activos = this.eventosSvc.eventosActivos();
    if (this.filtroActivo === 'todos') return activos;
    return activos.filter(e => e.tipo === this.filtroActivo);
  }

  get eventoDestacado(): Evento | null {
    return this.eventosSvc.eventoDestacado();
  }

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.eventosSvc.reload().subscribe();
      }
      this.initScrollAnimations();
    });
  }

  setFiltro(key: string): void {
    this.filtroActivo = key;
  }

  formatFecha(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    return d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  formatFechaLarga(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  getDiaSemana(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    return this.DIAS[d.getDay()];
  }

  getDia(fecha: string): string {
    return new Date(fecha + 'T12:00:00').getDate().toString();
  }

  getMes(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    return this.MESES[d.getMonth()];
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Eventos y M\u00fasica en Vivo | Fresquitox Chapinero',
      description: 'Cronograma de eventos en Fresquitox: DJ sets, m\u00fasica en vivo, karaoke y noches especiales. Refrescos artesanales y buena vibra en Chapinero, Bogot\u00e1.',
      keywords: 'eventos fresquitox, dj chapinero, musica en vivo bogota, karaoke chapinero, eventos bogota, bar chapinero',
      canonicalUrl: '/eventos'
    });

    this.seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'EventSeries',
        'name': 'Eventos Fresquitox',
        'description': 'Eventos semanales de m\u00fasica en vivo, DJ y karaoke en Fresquitox Chapinero',
        'location': {
          '@type': 'Place',
          'name': 'Fresquitox Chapinero',
          'address': { '@type': 'PostalAddress', 'addressLocality': 'Bogot\u00e1', 'addressRegion': 'Cundinamarca', 'addressCountry': 'CO' }
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://www.fresquitox.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Eventos', 'item': 'https://www.fresquitox.com/eventos' }
        ]
      }
    ]);
  }

  abrirReserva(evento: Evento): void {
    this.modalEvento = evento;
    this.reservaEnviada = false;
    this.enviando = false;
    this.reserva = { nombre: '', telefono: '', personas: 2, mensaje: '' };
    this.modalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarReserva(): void {
    this.modalOpen = false;
    this.modalEvento = null;
    document.body.style.overflow = '';
  }

  enviarReserva(): void {
    if (!this.reserva.nombre.trim() || !this.reserva.telefono.trim()) return;
    this.enviando = true;

    // Build WhatsApp message
    const evento = this.modalEvento!;
    const msg = `🎟️ *RESERVA FRESQUITOX*%0A`
      + `━━━━━━━━━━━━━━━━%0A`
      + `🎵 *Evento:* ${evento.titulo}%0A`
      + `📅 *Fecha:* ${this.formatFechaLarga(evento.fecha)}%0A`
      + `🕐 *Hora:* ${evento.hora}%0A`
      + `━━━━━━━━━━━━━━━━%0A`
      + `👤 *Nombre:* ${this.reserva.nombre}%0A`
      + `📱 *Tel:* ${this.reserva.telefono}%0A`
      + `👥 *Personas:* ${this.reserva.personas}%0A`
      + (this.reserva.mensaje ? `💬 *Nota:* ${this.reserva.mensaje}%0A` : '')
      + `━━━━━━━━━━━━━━━━%0A`
      + `Enviado desde fresquitox.com`;

    const url = `https://wa.me/${this.contact.phoneFormatted.replace('+', '')}?text=${msg}`;

    setTimeout(() => {
      this.enviando = false;
      this.reservaEnviada = true;
      window.open(url, '_blank');
    }, 800);
  }

  private initScrollAnimations(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    this.el.nativeElement.querySelectorAll('[data-animate]').forEach((el: Element) => observer.observe(el));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
