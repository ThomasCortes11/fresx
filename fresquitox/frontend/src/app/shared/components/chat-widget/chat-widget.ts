import {
  Component, inject, signal, computed, ElementRef, viewChild,
  afterNextRender, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChatbotService, ChatMessage, FaqItem } from '../../../core/services/chatbot.service';

const WHATSAPP = 'https://wa.me/573213728768';

@Component({
  selector: 'app-chat-widget',
  imports: [],
  templateUrl: './chat-widget.html',
  styleUrl:    './chat-widget.scss',
})
export class ChatWidget {
  private readonly svc        = inject(ChatbotService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly bodyRef = viewChild<ElementRef<HTMLDivElement>>('chatBody');

  readonly abierto    = signal(false);
  readonly escribiendo = signal(false);
  readonly inputText  = signal('');
  readonly mensajes   = signal<ChatMessage[]>([]);
  readonly sugerencias = computed(() => this.svc.sugerencias());
  readonly mostrarSugerencias = computed(() =>
    this.mensajes().length === 0 || this.mensajes().every(m => m.role === 'bot')
  );

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.svc.reload();
        // Mensaje de bienvenida al abrir
      }
    });
  }

  toggleChat(): void {
    this.abierto.update(v => !v);
    if (this.abierto() && this.mensajes().length === 0) {
      this.pushBotMsg('¡Hola! 👋 Soy el asistente de **Fresquitox**. ¿En qué te puedo ayudar?');
    }
  }

  enviar(texto?: string): void {
    const msg = (texto ?? this.inputText()).trim();
    if (!msg || this.escribiendo()) return;
    this.inputText.set('');
    this.pushMsg({ role: 'user', texto: msg });
    this.escribiendo.set(true);

    if (this.svc.aiActiva() && this.svc.apiKey()) {
      void this.responderConIA(msg);
    } else {
      this.responderLocal(msg);
    }
  }

  private responderLocal(msg: string): void {
    setTimeout(() => {
      this.escribiendo.set(false);
      const result = this.svc.responder(msg);
      if (result) {
        this.pushBotMsg(result.faq.respuesta);
      } else {
        this.pushBotMsg(
          'Esa pregunta me queda grande sin la IA activa. 😅\nEscríbenos por WhatsApp y te respondemos al instante.',
          true
        );
      }
    }, 600 + Math.random() * 400);
  }

  private async responderConIA(msg: string): Promise<void> {
    const historial = this.mensajes()
      .filter(m => m.role === 'user' || m.role === 'bot')
      .slice(-10)
      .map(m => ({
        role: (m.role === 'bot' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: this.cleanText(m.texto),
      }));

    try {
      const respuesta = await this.svc.preguntarIA(historial);
      this.escribiendo.set(false);
      this.pushBotMsg(respuesta);
    } catch {
      this.escribiendo.set(false);
      this.responderLocal(msg);
    }
  }

  preguntarSugerida(faq: FaqItem): void {
    this.enviar(faq.pregunta);
  }

  irWhatsapp(): void {
    window.open(WHATSAPP + '?text=Hola%2C+necesito+ayuda+con+un+pedido', '_blank', 'noopener');
  }

  private pushBotMsg(texto: string, conBotonWA = false): void {
    this.pushMsg({ role: 'bot', texto: conBotonWA ? texto + '\n__WA__' : texto });
  }

  private pushMsg(m: Omit<ChatMessage, 'id' | 'ts'>): void {
    this.mensajes.update(list => [...list, { ...m, id: `${Date.now()}`, ts: Date.now() }]);
    setTimeout(() => this.scrollBottom(), 50);
  }

  private scrollBottom(): void {
    const el = this.bodyRef()?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  limpiar(): void { this.mensajes.set([]); }

  hasWA(texto: string): boolean { return texto.includes('__WA__'); }
  cleanText(texto: string): string { return texto.replace('__WA__', '').trim(); }

  renderMarkdown(texto: string): string {
    return this.cleanText(texto)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.enviar(); }
  }
}
