import { Component, OnInit, inject, afterNextRender, DestroyRef, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { CONTACT_INFO } from '../../shared/constants/contact-info';

export interface Evento {
  id: number;
  titulo: string;
  fecha: string;
  hora: string;
  tipo: 'dj' | 'musica-en-vivo' | 'karaoke' | 'especial';
  artista: string;
  descripcion: string;
  emoji: string;
  destacado?: boolean;
}

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
  readonly contact = CONTACT_INFO;

  filtroActivo = 'todos';

  // ── Reservation modal
  modalOpen = false;
  modalEvento: Evento | null = null;
  reserva = { nombre: '', telefono: '', personas: 2, mensaje: '' };
  reservaEnviada = false;
  enviando = false;

  // Equalizer bar animation delays
  readonly eqBars = Array.from({ length: 40 }, (_, i) => +(Math.random() * 0.8).toFixed(2));

  readonly tipos = [
    { key: 'todos', label: 'Todos', emoji: '\uD83C\uDF89' },
    { key: 'dj', label: 'DJ Sets', emoji: '\uD83C\uDFA7' },
    { key: 'musica-en-vivo', label: 'M\u00fasica en Vivo', emoji: '\uD83C\uDFB8' },
    { key: 'karaoke', label: 'Karaoke', emoji: '\uD83C\uDFA4' },
    { key: 'especial', label: 'Especiales', emoji: '\u2B50' }
  ];

  readonly eventos: Evento[] = [
    {
      id: 1,
      titulo: 'Noche de DJ \u2014 Tropical House',
      fecha: '2025-07-12',
      hora: '7:00 PM - 11:00 PM',
      tipo: 'dj',
      artista: 'DJ Fresqui',
      descripcion: 'Beats tropicales mezclados con lo mejor del house mientras disfrutas granizados con licor bajo las luces.',
      emoji: '\uD83C\uDFA7',
      destacado: true
    },
    {
      id: 2,
      titulo: 'Ac\u00fastico en Vivo \u2014 Vallenato Fusi\u00f3n',
      fecha: '2025-07-15',
      hora: '6:00 PM - 9:00 PM',
      tipo: 'musica-en-vivo',
      artista: 'Los Refrescantes',
      descripcion: 'Vallenato fusionado con pop y bossa nova. M\u00fasica suave para acompa\u00f1ar tus jugos y smoothies al atardecer.',
      emoji: '\uD83C\uDFB8'
    },
    {
      id: 3,
      titulo: 'Karaoke Night \u2014 \u00a1Canta y Refresca!',
      fecha: '2025-07-18',
      hora: '7:00 PM - 10:00 PM',
      tipo: 'karaoke',
      artista: 'Micr\u00f3fono abierto',
      descripcion: 'Sube al escenario, canta tu favorita y gana granizados gratis. El p\u00fablico vota por el mejor.',
      emoji: '\uD83C\uDFA4'
    },
    {
      id: 4,
      titulo: 'DJ Set \u2014 Reggaeton Old School',
      fecha: '2025-07-20',
      hora: '8:00 PM - 12:00 AM',
      tipo: 'dj',
      artista: 'DJ IceCold',
      descripcion: 'Los cl\u00e1sicos del reggaeton que movieron una generaci\u00f3n. Perreo y granizados con licor toda la noche.',
      emoji: '\uD83C\uDFA7'
    },
    {
      id: 5,
      titulo: 'Noche Especial \u2014 Lanzamiento Nuevos Sabores',
      fecha: '2025-07-25',
      hora: '5:00 PM - 10:00 PM',
      tipo: 'especial',
      artista: 'Equipo Fresquitox',
      descripcion: 'S\u00e9 de los primeros en probar nuestros nuevos sabores de temporada. Degustaci\u00f3n gratuita, DJ en vivo y sorpresas.',
      emoji: '\u2B50',
      destacado: true
    },
    {
      id: 6,
      titulo: 'M\u00fasica en Vivo \u2014 Salsa & Son',
      fecha: '2025-07-27',
      hora: '6:30 PM - 9:30 PM',
      tipo: 'musica-en-vivo',
      artista: 'Son de Chapinero',
      descripcion: 'Salsa en vivo para bailar con limonadas frescas. Trae tu pareja o ven solo \u2014 la salsa une a todos.',
      emoji: '\uD83C\uDFBA'
    },
    {
      id: 7,
      titulo: 'Karaoke Tem\u00e1tico \u2014 Solo Canciones de Amor',
      fecha: '2025-08-01',
      hora: '7:00 PM - 10:00 PM',
      tipo: 'karaoke',
      artista: 'Micr\u00f3fono abierto',
      descripcion: 'Dedicatorias musicales y smoothies para dos. El viernes m\u00e1s rom\u00e1ntico del mes en Fresquitox.',
      emoji: '\uD83D\uDC95'
    },
    {
      id: 8,
      titulo: 'Fiesta de Aniversario Fresquitox',
      fecha: '2025-08-10',
      hora: '4:00 PM - 12:00 AM',
      tipo: 'especial',
      artista: 'M\u00faltiples artistas',
      descripcion: 'Celebramos otro a\u00f1o refrescando Bogot\u00e1. DJ sets, m\u00fasica en vivo, karaoke, productos gratis y muchas sorpresas.',
      emoji: '\uD83C\uDF82',
      destacado: true
    }
  ];

  private readonly DIAS = ['Dom', 'Lun', 'Mar', 'Mi\u00e9', 'Jue', 'Vie', 'S\u00e1b'];
  private readonly MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  get eventosFiltrados(): Evento[] {
    if (this.filtroActivo === 'todos') return this.eventos;
    return this.eventos.filter(e => e.tipo === this.filtroActivo);
  }

  get eventoDestacado(): Evento | undefined {
    return this.eventos.find(e => e.destacado);
  }

  constructor() {
    afterNextRender(() => this.initScrollAnimations());
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
