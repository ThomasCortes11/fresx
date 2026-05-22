import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface FaqItem {
  id: string;
  pregunta: string;      // Texto que ve el admin
  respuesta: string;     // Respuesta del bot
  keywords: string[];    // Palabras clave para el matching
  activa: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  texto: string;
  ts: number;
}

const KEY      = 'fq_faqs';
const KEY_CFG  = 'fq_chatbot_cfg';
const FAQ_VER  = 'fq_faqs_v';
const CURRENT_VER = '4'; // incrementar cuando cambien los FAQS_DEFAULT

const FAQS_DEFAULT: FaqItem[] = [
  // ── Saludo / bienvenida ──────────────────────────────────────────────────
  {
    id: 'f0', activa: true,
    pregunta: 'Saludo / hola / buenas',
    respuesta: '¡Hola! Bienvenido a **Fresquitox** 👋 ¿En qué te puedo ayudar? Puedo contarte sobre nuestros productos, horarios, domicilios, eventos y más.',
    keywords: ['hola', 'buenas', 'buenos', 'buen', 'hey', 'saludos', 'ey', 'ola', 'hi', 'hello', 'que tal', 'como estas', 'bienvenido'],
  },
  // ── Horario ──────────────────────────────────────────────────────────────
  {
    id: 'f1', activa: true,
    pregunta: '¿Cuál es el horario de atención?',
    respuesta: 'Estamos abiertos **todos los días de 10:00 am a 10:00 pm**. ¡Te esperamos! 🕙',
    keywords: ['horario', 'hora', 'abierto', 'cierre', 'abren', 'cierran', 'atienden', 'atencion', 'apertura', 'cuando abren', 'hasta que hora', 'que horas'],
  },
  // ── Domicilios ───────────────────────────────────────────────────────────
  {
    id: 'f2', activa: true,
    pregunta: '¿Hacen domicilios?',
    respuesta: 'Sí, hacemos **domicilios** en Chapinero, Usaquén, Teusaquillo y más zonas de Bogotá. Escríbenos al WhatsApp para confirmar cobertura. 🛵',
    keywords: ['domicilio', 'delivery', 'envio', 'envío', 'llevan', 'reparto', 'mandan', 'traen', 'despachan', 'a domicilio', 'despacho', 'envian'],
  },
  // ── Tiempo de entrega ────────────────────────────────────────────────────
  {
    id: 'f8', activa: true,
    pregunta: '¿Cuánto demora el domicilio?',
    respuesta: 'Los domicilios tardan entre **20 y 45 minutos** según la zona. Te avisamos si hay demoras. ⏱️',
    keywords: ['demora', 'tarda', 'tardanza', 'cuanto demora', 'cuanto tarda', 'tiempo entrega', 'espera', 'rapido', 'entrega rapida', 'cuanto espero', 'minutos entrega'],
  },
  // ── Pedidos ──────────────────────────────────────────────────────────────
  {
    id: 'f3', activa: true,
    pregunta: '¿Cómo hago un pedido?',
    respuesta: 'Puedes pedir de tres formas:\n1. **WhatsApp** 📱 +57 321 372 8768\n2. **Escaneando el QR** de tu mesa si estás en el local\n3. **En el sitio** entrando a /productos',
    keywords: ['pedir', 'pedido', 'orden', 'comprar', 'ordenar', 'solicitar', 'como pido', 'como ordeno', 'quiero pedir', 'hacer pedido', 'encargar'],
  },
  // ── Pago ─────────────────────────────────────────────────────────────────
  {
    id: 'f4', activa: true,
    pregunta: '¿Cuáles son los métodos de pago?',
    respuesta: 'Aceptamos:\n💵 Efectivo\n📲 Transferencia bancaria\n🟡 Nequi\n🔵 Daviplata\n\n¡Sin complicaciones!',
    keywords: ['pago', 'pagar', 'metodo', 'método', 'efectivo', 'nequi', 'daviplata', 'transferencia', 'tarjeta', 'como pago', 'pse', 'bancolombia'],
  },
  // ── Productos / menú ─────────────────────────────────────────────────────
  {
    id: 'f5', activa: true,
    pregunta: '¿Qué productos tienen?',
    respuesta: 'Tenemos tres líneas:\n🍧 **Clásicos Fresquitox** — granizados y refrescos de siempre\n🍋 **Línea Natural** — frutas frescas, cero conservantes\n✨ **Línea Premium** — experiencias únicas para ocasiones especiales\n\nVer catálogo completo en /productos',
    keywords: ['producto', 'productos', 'menu', 'menú', 'carta', 'ofrecen', 'venden', 'granizado', 'granizados', 'jugo', 'jugos', 'refresco', 'refrescos', 'bebida', 'bebidas', 'linea', 'línea', 'natural', 'premium', 'clasico', 'catalogo', 'catálogo', 'que tienen', 'que venden'],
  },
  // ── Precios ──────────────────────────────────────────────────────────────
  {
    id: 'f10', activa: true,
    pregunta: '¿Cuáles son los precios?',
    respuesta: 'Los precios van desde **$6.000** en adelante según el producto. Consulta todos los precios en /productos 👀',
    keywords: ['precio', 'precios', 'costo', 'costos', 'cuanto vale', 'cuanto cuesta', 'valor', 'tarifa', 'cuanto es', 'cuanto cobran', 'barato', 'economico'],
  },
  // ── Ubicación ────────────────────────────────────────────────────────────
  {
    id: 'f7', activa: true,
    pregunta: '¿Dónde están ubicados?',
    respuesta: 'Estamos en **Chapinero, Bogotá**. Escríbenos al WhatsApp para la dirección exacta o visita nuestra página de contacto. 📍',
    keywords: ['ubicacion', 'ubicación', 'donde', 'dónde', 'direccion', 'dirección', 'local', 'barrio', 'chapinero', 'bogota', 'sede', 'tienda', 'local fisico', 'donde quedan'],
  },
  // ── Eventos ──────────────────────────────────────────────────────────────
  {
    id: 'f6', activa: true,
    pregunta: '¿Atienden eventos?',
    respuesta: '¡Sí! Hacemos **eventos corporativos, cumpleaños, bodas y ferias**. Cotiza por WhatsApp o en nuestra página de eventos. 🎉',
    keywords: ['evento', 'eventos', 'corporativo', 'cumpleanos', 'cumpleaños', 'boda', 'feria', 'fiesta', 'celebracion', 'celebración', 'grado', 'graduacion', 'empresa', 'empresarial'],
  },
  // ── Música en vivo ───────────────────────────────────────────────────────
  {
    id: 'f9', activa: true,
    pregunta: '¿Tienen música en vivo?',
    respuesta: 'Sí, los **viernes y sábados** tenemos música en vivo. 🎶 Revisa la programación en nuestra página de eventos.',
    keywords: ['musica', 'música', 'vivo', 'banda', 'artista', 'show', 'concierto', 'viernes', 'sabado', 'sábado', 'tocada', 'programacion', 'programación'],
  },
  // ── WhatsApp / contacto ──────────────────────────────────────────────────
  {
    id: 'f11', activa: true,
    pregunta: '¿Cuál es el WhatsApp / contacto?',
    respuesta: 'Puedes escribirnos al **+57 321 372 8768** por WhatsApp. También por Instagram **@fresquitoxx** o al correo sempiternoxtv@gmail.com 📲',
    keywords: ['whatsapp', 'numero', 'número', 'telefono', 'teléfono', 'contacto', 'llamar', 'escribir', 'instagram', 'redes', 'correo', 'email', 'comunicar', 'hablar'],
  },
  // ── Personalización ─────────────────────────────────────────────────────
  {
    id: 'f12', activa: true,
    pregunta: '¿Pueden personalizar pedidos?',
    respuesta: '¡Claro! Puedes pedirnos combinaciones especiales, ajustes de sabor o porciones personalizadas. Cuéntanos qué quieres por WhatsApp. 🎨',
    keywords: ['personalizar', 'personalizado', 'especial', 'combinacion', 'combinación', 'sabor', 'ajustar', 'cambiar', 'sin azucar', 'sin', 'personaliza'],
  },
  // ── Instagram / redes ────────────────────────────────────────────────────
  {
    id: 'f13', activa: true,
    pregunta: '¿Tienen Instagram?',
    respuesta: '¡Sí! Síguenos en Instagram como **@fresquitoxx** para ver nuestras novedades, sabores del día y eventos. 📸',
    keywords: ['instagram', 'ig', 'redes sociales', 'tiktok', 'facebook', 'seguir', 'cuenta', 'fresquitoxx'],
  },
  // ── Quiénes somos / marca ────────────────────────────────────────────────
  {
    id: 'f15', activa: true,
    pregunta: '¿Quiénes son? / ¿Qué es Fresquitox?',
    respuesta: '**Fresquitox** es una marca de granizados y bebidas naturales nacida en Chapinero, Bogotá. Hacemos refrescos con fruta fresca real, cero conservantes y mucha actitud. Tenemos línea clásica, natural y premium. 🍋 ¿Quieres conocer nuestro menú?',
    keywords: ['quienes', 'ustedes', 'marca', 'empresa', 'negocio', 'fresquitox', 'historia', 'quienes son', 'que es', 'sobre ustedes', 'nosotros', 'cuéntame', 'cuentame', 'hablame', 'háblame'],
  },
  // ── Gracias / despedida ──────────────────────────────────────────────────
  {
    id: 'f14', activa: true,
    pregunta: 'Gracias / hasta luego',
    respuesta: '¡Con gusto! 😊 Si tienes más preguntas, aquí estaré. ¡Hasta pronto y que disfrutes tu Fresquitox!',
    keywords: ['gracias', 'gracia', 'thanks', 'perfecto', 'listo', 'ok', 'okay', 'entendido', 'adios', 'adiós', 'hasta luego', 'chao', 'bye', 'nos vemos', 'excelente'],
  },
];

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly platformId = inject(PLATFORM_ID);
  private get isBrowser() { return isPlatformBrowser(this.platformId); }

  readonly faqs     = signal<FaqItem[]>(this.loadFaqs());
  // La key viene del environment (gitignoreado). El dashboard puede sobreescribirla.
  readonly apiKey   = signal<string>(this.loadCfg('apiKey') || environment.deepseekApiKey || '');
  // IA activa por defecto si hay key en el environment
  readonly aiActiva = signal<boolean>(
    this.loadCfg('aiActiva') !== '' ? this.loadCfg('aiActiva') === 'true' : !!environment.deepseekApiKey
  );

  // ── Config persistence ───────────────────────────────────────────────────
  private loadCfg(key: string): string {
    if (!this.isBrowser) return '';
    try {
      const raw = localStorage.getItem(KEY_CFG);
      return raw ? (JSON.parse(raw) as Record<string, string>)[key] ?? '' : '';
    } catch { return ''; }
  }

  private saveCfg(data: Record<string, string>): void {
    if (!this.isBrowser) return;
    try {
      const current = JSON.parse(localStorage.getItem(KEY_CFG) ?? '{}') as Record<string, string>;
      localStorage.setItem(KEY_CFG, JSON.stringify({ ...current, ...data }));
    } catch { /* noop */ }
  }

  setApiKey(key: string): void  { this.apiKey.set(key);  this.saveCfg({ apiKey: key }); }
  setAiActiva(v: boolean): void { this.aiActiva.set(v);  this.saveCfg({ aiActiva: String(v) }); }

  private loadFaqs(): FaqItem[] {
    if (!this.isBrowser) return FAQS_DEFAULT;
    try {
      const ver = localStorage.getItem(FAQ_VER);
      if (ver !== CURRENT_VER) {
        // Nueva versión de defaults: merge conservando FAQs personalizadas del admin
        const raw = localStorage.getItem(KEY);
        const stored: FaqItem[] = raw ? (JSON.parse(raw) as FaqItem[]) : [];
        const defaultIds = new Set(FAQS_DEFAULT.map(f => f.id));
        // Mantener FAQs custom (id no en defaults) y reemplazar las defaults
        const custom = stored.filter(f => !defaultIds.has(f.id));
        const merged = [...FAQS_DEFAULT, ...custom];
        localStorage.setItem(KEY, JSON.stringify(merged));
        localStorage.setItem(FAQ_VER, CURRENT_VER);
        return merged;
      }
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as FaqItem[]) : FAQS_DEFAULT;
    } catch { return FAQS_DEFAULT; }
  }

  private saveFaqs(list: FaqItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(KEY, JSON.stringify(list));
      localStorage.setItem(FAQ_VER, CURRENT_VER);
    }
    this.faqs.set(list);
  }

  // ── Admin CRUD ──────────────────────────────────────────────────────────
  agregarFaq(pregunta: string, respuesta: string, keywords: string[]): void {
    const nueva: FaqItem = { id: `f${Date.now()}`, pregunta, respuesta, keywords, activa: true };
    this.saveFaqs([...this.faqs(), nueva]);
  }

  actualizarFaq(id: string, data: Partial<FaqItem>): void {
    this.saveFaqs(this.faqs().map(f => f.id === id ? { ...f, ...data } : f));
  }

  eliminarFaq(id: string): void {
    this.saveFaqs(this.faqs().filter(f => f.id !== id));
  }

  toggleFaq(id: string): void {
    this.saveFaqs(this.faqs().map(f => f.id === id ? { ...f, activa: !f.activa } : f));
  }

  reload(): void {
    this.faqs.set(this.loadFaqs());
    this.apiKey.set(this.loadCfg('apiKey') || environment.deepseekApiKey || '');
    const stored = this.loadCfg('aiActiva');
    this.aiActiva.set(stored !== '' ? stored === 'true' : !!environment.deepseekApiKey);
  }

  // ── Stop words — palabras comunes que no aportan semántica ───────────────
  private readonly STOP = new Set([
    'que','qué','como','cómo','son','los','las','una','uno','hay','les',
    'nos','mis','tus','sus','por','para','del','con','sin','más','mas',
    'muy','tal','vez','soy','eres','esta','este','esto','eso','esa',
    'esos','esas','pero','bien','mal','hola','hay','ser','han','has',
    'haz','nos','fue','era','sea','tan','aun','aún','asi','así','ya',
    'cuando','donde','dónde','cuál','cual','cuáles','cuales','quién',
    'quien','quienes','todos','todo','toda','todas','aquí','ahi','ahí',
    'allá','alla','algo','algun','algún','algunos','algunas','nada',
    'nadie','nunca','siempre','antes','después','despues','ahora',
    'ayer','hoy','mañana','manana','luego','entonces','tambien','también',
    'tampoco','porque','porqué','aunque','mientras','durante','sobre',
    'entre','hasta','desde','hacia','ante','bajo','contra','mediante',
  ]);

  // ── Matching engine ───────────────────────────────────────────────────────
  responder(input: string): { faq: FaqItem; score: number } | null {
    const words = this.normalizar(input)
      .split(/\s+/)
      .filter(w => w.length > 2 && !this.STOP.has(w));

    if (words.length === 0) return null;

    let best: { faq: FaqItem; score: number } | null = null;

    for (const faq of this.faqs().filter(f => f.activa)) {
      const haystack = faq.keywords
        .flatMap(k => this.normalizar(k).split(/\s+/))
        .filter(k => k.length > 2 && !this.STOP.has(k));

      let score = 0;
      for (const word of words) {
        if (haystack.some(k => k === word || k.startsWith(word) || word.startsWith(k))) score++;
      }

      // Umbral de confianza: al menos el 40% de las palabras del usuario deben coincidir.
      // Evita que preguntas largas con solo 1 palabra en común den respuesta incorrecta.
      const confidence = score / words.length;
      if (score > 0 && confidence >= 0.4 && (!best || score > best.score)) {
        best = { faq, score };
      }
    }

    return best ?? null;
  }

  // Sugerencias de preguntas frecuentes para mostrar al inicio
  sugerencias(): FaqItem[] {
    return this.faqs().filter(f => f.activa).slice(0, 4);
  }

  // ── DeepSeek AI ──────────────────────────────────────────────────────────
  private buildSystemPrompt(): string {
    const faqsText = this.faqs()
      .filter(f => f.activa)
      .map(f => `• ${f.pregunta}: ${f.respuesta}`)
      .join('\n');

    return `Eres el asistente virtual de Fresquitox, una tienda de granizados, jugos naturales y bebidas artesanales ubicada en Chapinero, Bogotá, Colombia.

## Tu personalidad
- Amable, cercano y con energía positiva. Hablas como un colombiano joven pero profesional.
- Usas emojis con moderación (1-2 por mensaje máximo).
- Respondes de forma clara y útil, nunca robótica.
- Si la pregunta tiene que ver con Fresquitox, respóndela bien. Si no tiene nada que ver, redirige amablemente.

## Información del negocio
- **WhatsApp:** +57 321 372 8768 (principal canal de pedidos y consultas)
- **Instagram:** @fresquitoxx
- **Correo:** sempiternoxtv@gmail.com
- **Horario:** Todos los días de 10:00 am a 10:00 pm
- **Ubicación:** Chapinero, Bogotá

## Líneas de producto
- **Clásicos Fresquitox:** granizados y refrescos de siempre, sabores tradicionales
- **Línea Natural:** frutas frescas de temporada, cero conservantes, cero artificiales. Jugos, smoothies, limonadas naturales
- **Línea Premium:** experiencias únicas, combinaciones especiales para ocasiones especiales, presentaciones exclusivas

## Cómo comprar
1. Por **WhatsApp** al +57 321 372 8768 (más rápido, atención personalizada)
2. **Escaneando el QR** de la mesa si estás en el local
3. **En el sitio web** en /productos (carrito y pedido directo)

## Métodos de pago
Efectivo, Nequi, Daviplata, transferencia bancaria. No manejamos tarjetas débito/crédito aún.

## Domicilios
Cubrimos Chapinero, Usaquén, Teusaquillo, Suba y zonas cercanas. Tiempo estimado: 20–45 minutos. Para confirmar cobertura de tu zona, escribe al WhatsApp.

## Eventos
Hacemos montajes para eventos corporativos, cumpleaños, bodas, ferias y reuniones. Precio según el tipo y tamaño del evento. Cotizaciones por WhatsApp.

## Música en vivo
Viernes y sábados hay música en vivo en el local. Ver programación en /eventos.

## Preguntas frecuentes configuradas por el admin
${faqsText}

## Instrucciones
- Responde siempre en español.
- Sé específico: si preguntan cómo comprar la Línea Premium, explica los canales con detalle, no solo digas "ver catálogo".
- Si el cliente quiere hacer un pedido, dales el WhatsApp y anímales a escribir.
- Si no tienes información exacta (como el precio de un producto específico), di que pueden consultar en /productos o por WhatsApp.
- Máximo 5-6 líneas por respuesta. Si necesitas listar cosas, usa viñetas cortas.`;
  }

  async preguntarIA(historial: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
    const key = this.apiKey();
    if (!key) throw new Error('Sin API key');

    const resp = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: this.buildSystemPrompt() }, ...historial],
        max_tokens: 250,
        temperature: 0.6,
      }),
    });

    if (!resp.ok) throw new Error(`DeepSeek ${resp.status}`);
    const data = await resp.json() as { choices: { message: { content: string } }[] };
    return data.choices[0]?.message?.content?.trim() ?? 'Sin respuesta';
  }

  private normalizar(s: string): string {
    return s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ');
  }
}
