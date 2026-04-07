export type CategoriaProducto = 'clasicos' | 'naturales' | 'premium';

export interface Servicio {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcionSeo: string;
  keywords: string;
  icono: string;
  idealPara: string[];
  contenido: string[];
  categoria: CategoriaProducto;
  precio?: string;
  emoji?: string;
}

export interface CategoriaInfo {
  id: CategoriaProducto;
  titulo: string;
  subtitulo: string;
  icono: string;
}

export const CATEGORIAS: CategoriaInfo[] = [
  { id: 'clasicos', titulo: 'Clásicos Fresquitox', subtitulo: 'Los favoritos de siempre, preparados al instante', icono: '🍧' },
  { id: 'naturales', titulo: 'Línea Natural', subtitulo: 'Frutas frescas, cero conservantes, sabor real', icono: '🍋' },
  { id: 'premium', titulo: 'Línea Premium', subtitulo: 'Experiencias únicas para ocasiones especiales', icono: '✨' },
];

export const SERVICIOS: Servicio[] = [
  // ═══════════════════════════════════
  //  CLÁSICOS
  // ═══════════════════════════════════
  {
    slug: 'granizados',
    nombre: 'Granizados',
    descripcionCorta: 'Hielo triturado con siropes artesanales de frutas naturales. El clásico Fresquitox que conquistó Chapinero.',
    descripcionSeo: 'Granizados artesanales en Bogotá. Hielo triturado con siropes de frutas naturales. Pide a domicilio o visítanos en Chapinero. Fresquitox.',
    keywords: 'granizados bogota, granizados artesanales, granizados chapinero, granizados a domicilio bogota, mejor granizado bogota',
    icono: '🍧',
    emoji: '🍧',
    idealPara: ['Tardes calurosas', 'Reuniones con amigos', 'Antojo rápido'],
    contenido: [
      'Nuestros granizados son el alma de Fresquitox. Preparados al momento con hielo triturado fino y siropes artesanales hechos con frutas 100% naturales.',
      'Tenemos más de 15 sabores disponibles: fresa, mango, maracuyá, lulo, mora, limón, cereza, uva, tamarindo, guanábana, y combinaciones exclusivas que solo encuentras aquí.',
      'Cada granizado se prepara frente a ti para que veas la frescura en acción. Puedes personalizar el nivel de dulce y agregarle toppings como leche condensada, gomitas o frutas picadas.',
      'Disponible en tres tamaños: Personal (12oz), Mediano (16oz) y Jumbo (24oz). Perfecto para una persona o para compartir.'
    ],
    categoria: 'clasicos',
    precio: 'Desde $6.000'
  },
  {
    slug: 'raspados',
    nombre: 'Raspados',
    descripcionCorta: 'Hielo raspado suave con capas de sabor, frutas frescas y toppings irresistibles. Textura única.',
    descripcionSeo: 'Raspados artesanales en Bogotá. Hielo raspado con frutas frescas y toppings. Pide a domicilio. Fresquitox.',
    keywords: 'raspados bogota, raspados artesanales, raspados chapinero, raspados a domicilio bogota, mejor raspado bogota',
    icono: '🧊',
    emoji: '🧊',
    idealPara: ['Experiencia refrescante', 'Compartir en pareja', 'Después del gym'],
    contenido: [
      'Los raspados Fresquitox tienen una textura única: hielo raspado finamente que se deshace en tu boca mientras absorbes capas de sabor.',
      'A diferencia del granizado, el raspado es más suave y ligero. Ideal para quienes buscan algo menos intenso pero igual de refrescante.',
      'Nuestros raspados vienen con frutas frescas picadas, sirope natural y la opción de agregar leche condensada, crema chantilly o salsa de chocolate.',
      'Un clásico callejero elevado a nivel premium. La textura perfecta para un día cualquiera en Bogotá.'
    ],
    categoria: 'clasicos',
    precio: 'Desde $7.000'
  },
  {
    slug: 'jugos-naturales',
    nombre: 'Jugos Naturales',
    descripcionCorta: 'Frutas frescas licuadas al instante. Sin azúcar añadida, sin conservantes. Pura fruta.',
    descripcionSeo: 'Jugos naturales en Bogotá. Frutas frescas licuadas al instante sin conservantes. Domicilio en Bogotá. Fresquitox.',
    keywords: 'jugos naturales bogota, jugos frescos bogota, jugo de naranja bogota, jugos sin azucar bogota, jugos a domicilio bogota',
    icono: '🍊',
    emoji: '🍊',
    idealPara: ['Desayunos saludables', 'Post-entrenamiento', 'Cualquier hora del día'],
    contenido: [
      'Jugos 100% naturales preparados al instante con frutas frescas seleccionadas del día. Sin azúcar añadida, sin conservantes, sin colorantes.',
      'Ofrecemos más de 20 opciones: naranja, mandarina, mango, fresa, mora, lulo, guanábana, maracuyá, piña, sandía, y combinaciones funcionales con jengibre, limón y menta.',
      'Puedes elegir con agua o con leche, y ajustar el dulce a tu gusto. También tenemos opciones con endulzantes naturales como stevia o miel.',
      'Nuestras frutas llegan cada mañana del mercado para garantizar máxima frescura. Eso es Fresquitox: fresco de verdad.'
    ],
    categoria: 'naturales',
    precio: 'Desde $5.000'
  },
  {
    slug: 'limonadas',
    nombre: 'Limonadas',
    descripcionCorta: 'Limonadas artesanales con hierbabuena, coco, cerezada y más. Frescura en cada sorbo.',
    descripcionSeo: 'Limonadas artesanales en Bogotá. Limonada de coco, cerezada, hierbabuena y más. Frescas y naturales. Fresquitox.',
    keywords: 'limonadas bogota, limonada artesanal, limonada de coco bogota, limonada cerezada bogota, limonadas naturales bogota',
    icono: '🍋',
    emoji: '🍋',
    idealPara: ['Almuerzos', 'Eventos', 'Cualquier momento'],
    contenido: [
      'Nuestras limonadas son un homenaje a la tradición colombiana. Preparadas con limones frescos exprimidos al momento y combinaciones únicas.',
      'Limonada natural, de coco, cerezada, de hierbabuena, de maracuyá, frozen, y nuestra exclusiva limonada rosada con frutos rojos.',
      'Cada limonada se prepara con agua purificada y hielo cristalino. El dulce lo ajustamos a tu gusto o puedes pedirla sin azúcar.',
      'La opción perfecta para acompañar tu comida o simplemente para refrescarte en cualquier momento del día. Tamaños desde 12oz hasta 1 litro para compartir.'
    ],
    categoria: 'naturales',
    precio: 'Desde $4.500'
  },
  {
    slug: 'smoothies',
    nombre: 'Smoothies',
    descripcionCorta: 'Batidos cremosos de frutas con base de yogurt o leche vegetal. Energía natural en cada vaso.',
    descripcionSeo: 'Smoothies naturales en Bogotá. Batidos de frutas con yogurt y superfoods. Saludables y deliciosos. Fresquitox.',
    keywords: 'smoothies bogota, batidos frutas bogota, smoothie saludable bogota, smoothie proteina bogota, batidos naturales bogota',
    icono: '🥤',
    emoji: '🥤',
    idealPara: ['Pre/post entreno', 'Snack saludable', 'Desayuno rápido'],
    contenido: [
      'Smoothies cremosos y nutritivos preparados con frutas frescas y bases saludables. La opción ideal para quienes buscan sabor y nutrición.',
      'Bases disponibles: yogurt natural, leche de almendras, leche de coco o agua. Puedes agregar proteína, avena, chía, espinaca o mantequilla de maní.',
      'Combinaciones estrella: Tropical Power (mango, piña, coco), Berry Blast (frutos rojos, banano), Green Machine (espinaca, manzana, jengibre), y Protein Punch (banano, avena, proteína, cacao).',
      'Preparados al instante, sin polvos ni concentrados. Solo ingredientes reales que puedes ver y sentir en cada sorbo.'
    ],
    categoria: 'naturales',
    precio: 'Desde $9.000'
  },
  {
    slug: 'cocteleria-sin-alcohol',
    nombre: 'Coctelería Sin Alcohol',
    descripcionCorta: 'Mocktails premium con frutas frescas, siropes artesanales y presentación de bar. Para brindar sin alcohol.',
    descripcionSeo: 'Coctelería sin alcohol en Bogotá. Mocktails premium con frutas frescas para eventos y celebraciones. Fresquitox.',
    keywords: 'mocktails bogota, cocteles sin alcohol bogota, bebidas premium bogota, cocteles frutas bogota, cocteleria eventos bogota',
    icono: '🍹',
    emoji: '🍹',
    idealPara: ['Eventos corporativos', 'Fiestas', 'Cenas especiales'],
    contenido: [
      'Nuestra línea de coctelería sin alcohol lleva la experiencia Fresquitox al siguiente nivel. Mocktails premium con presentación de bar profesional.',
      'Mojito de fresa, Piña Colada tropical, Spritz de maracuyá, Sangría de frutas, Margarita de mango, y creaciones exclusivas del mes.',
      'Servidas en cristalería premium con garnish fresco, hielo artesanal y decoración de frutas. Perfectas para eventos donde quieres algo especial sin alcohol.',
      'Disponibles para eventos, fiestas y celebraciones. También puedes pedirlas en nuestro punto en Chapinero o a domicilio.'
    ],
    categoria: 'premium',
    precio: 'Desde $12.000'
  },
  {
    slug: 'estacion-de-refrescos',
    nombre: 'Estación de Refrescos',
    descripcionCorta: 'Servicio completo de barra de refrescos para eventos: cumpleaños, empresariales, bodas y más.',
    descripcionSeo: 'Estación de refrescos para eventos en Bogotá. Barra de granizados, jugos y smoothies para fiestas y corporativos. Fresquitox.',
    keywords: 'barra refrescos eventos bogota, estacion bebidas fiestas, catering refrescos bogota, granizados para eventos',
    icono: '🎪',
    emoji: '🎪',
    idealPara: ['Cumpleaños', 'Eventos corporativos', 'Bodas', 'Ferias'],
    contenido: [
      'Llevamos la experiencia Fresquitox a tu evento con nuestra Estación de Refrescos. Una barra completa con todo el sabor y la actitud de nuestra marca.',
      'Incluye: barra temática Fresquitox, personal capacitado, vasos y servilletas brandeadas, menú personalizado de bebidas, y montaje/desmontaje.',
      'Paquetes desde 50 hasta 500+ personas. Ideal para cumpleaños, eventos corporativos, bodas, ferias, activaciones de marca y cualquier celebración.',
      'Cotización personalizada según tus necesidades. Contáctanos por WhatsApp para armar el paquete perfecto para tu evento.'
    ],
    categoria: 'premium',
    precio: 'Desde $350.000'
  },
  {
    slug: 'fresquitox-con-licor',
    nombre: 'Fresquitox con Licor',
    descripcionCorta: 'Nuestros clásicos granizados y raspados con un shot de tu licor favorito. Solo para mayores de 18.',
    descripcionSeo: 'Granizados y raspados con licor en Bogotá. Cocteles frozen artesanales. Solo mayores de 18. Fresquitox.',
    keywords: 'granizados con licor bogota, cocteles frozen bogota, raspados con alcohol bogota, bebidas con licor bogota',
    icono: '🥂',
    emoji: '🥂',
    idealPara: ['Noches de viernes', 'Celebraciones', 'After office'],
    contenido: [
      'La versión adulta de tus Fresquitox favoritos. Los mismos granizados y raspados que amas, ahora con un shot de licor premium.',
      'Opciones: Granizado de fresa con vodka, Raspado de mango con ron, Limonada frozen con ginebra, Margarita frozen de maracuyá, y especiales del mes.',
      'Preparados con las mismas frutas frescas y siropes artesanales, más licores de calidad. Nada de mezclas artificiales.',
      'Disponibles únicamente para mayores de 18 años. Solo en nuestro punto físico de Chapinero y en eventos privados.'
    ],
    categoria: 'premium',
    precio: 'Desde $15.000'
  }
];
