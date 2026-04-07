export interface Zona {
  slug: string;
  nombre: string;
  descripcionSeo: string;
  keywords: string;
  barrios: string[];
  tiempoRespuesta: string;
  destacado: string;
  contenido: string[];
  esFisico?: boolean;
}

export const ZONAS: Zona[] = [
  {
    slug: 'chapinero',
    nombre: 'Chapinero',
    descripcionSeo: 'Fresquitox en Chapinero, Bogot\u00e1. Nuestro punto f\u00edsico en el coraz\u00f3n de Chapinero. Granizados, raspados, jugos naturales y m\u00e1s.',
    keywords: 'fresquitox chapinero, granizados chapinero, refrescos chapinero bogota, jugos naturales chapinero',
    barrios: ['Chic\u00f3', 'Zona G', 'Zona T', 'Chapinero Central', 'Rosales'],
    tiempoRespuesta: 'Punto f\u00edsico',
    destacado: '\ud83d\udccd Nuestro punto f\u00edsico \u2014 Vis\u00edtanos',
    esFisico: true,
    contenido: [
      'Chapinero es el hogar de Fresquitox. Aqu\u00ed naci\u00f3 todo: en una esquina del barrio, con una carreta, hielo y frutas frescas.',
      'Hoy tenemos nuestro punto f\u00edsico en el coraz\u00f3n de Chapinero, donde puedes venir a probar nuestros granizados, raspados, jugos, limonadas y toda la carta.',
      'Adem\u00e1s, hacemos domicilios express dentro de Chapinero en menos de 20 minutos. Si est\u00e1s en la Zona G, Zona T, Chic\u00f3, Rosales o Chapinero Central, tu pedido llega vol\u00e1ndote.',
      'Tambi\u00e9n atendemos eventos en la zona: fiestas privadas, eventos corporativos y activaciones de marca. Cont\u00e1ctanos por WhatsApp para cotizar.'
    ]
  },
  {
    slug: 'usaquen',
    nombre: 'Usaqu\u00e9n',
    descripcionSeo: 'Domicilios Fresquitox en Usaqu\u00e9n, Bogot\u00e1. Granizados, jugos naturales y refrescos artesanales a tu puerta.',
    keywords: 'fresquitox usaquen, domicilios refrescos usaquen, granizados usaquen bogota',
    barrios: ['Santa B\u00e1rbara', 'Cedritos', 'La Carolina', 'Country Club'],
    tiempoRespuesta: '30\u201345 min',
    destacado: 'Zona residencial del norte',
    contenido: [
      'Llevamos Fresquitox a toda la localidad de Usaqu\u00e9n. Desde Santa B\u00e1rbara hasta Cedritos, tu pedido llega fresco y a tiempo.',
      'Tiempo estimado de entrega: 30 a 45 minutos. Pide por WhatsApp y te confirmamos en segundos.',
      'Men\u00fa completo disponible: granizados, raspados, jugos naturales, limonadas, smoothies y l\u00ednea premium.',
      'Para pedidos de eventos o cantidades grandes en Usaqu\u00e9n, cont\u00e1ctanos con 24 horas de anticipaci\u00f3n.'
    ]
  },
  {
    slug: 'suba',
    nombre: 'Suba',
    descripcionSeo: 'Domicilios Fresquitox en Suba, Bogot\u00e1. Refrescos artesanales, granizados y jugos a domicilio.',
    keywords: 'fresquitox suba, domicilios refrescos suba, granizados suba bogota',
    barrios: ['Niza', 'Colina Campestre', 'Spring', 'Alhambra'],
    tiempoRespuesta: '35\u201350 min',
    destacado: 'La localidad m\u00e1s poblada de Bogot\u00e1',
    contenido: [
      'Cubrimos toda Suba con domicilios de refrescos artesanales. Desde Niza hasta Tibabuyes, el sabor Fresquitox llega a tu puerta.',
      'Tiempo estimado: 35 a 50 minutos dependiendo de tu ubicaci\u00f3n exacta en Suba.',
      'Todo nuestro men\u00fa est\u00e1 disponible para domicilio. Pide por WhatsApp y te enviamos la carta actualizada.',
      'Tambi\u00e9n atendemos pedidos corporativos y eventos en Suba. Escr\u00edbenos para cotizar.'
    ]
  },
  {
    slug: 'kennedy',
    nombre: 'Kennedy',
    descripcionSeo: 'Domicilios Fresquitox en Kennedy, Bogot\u00e1. Granizados, jugos y refrescos a domicilio.',
    keywords: 'fresquitox kennedy, domicilios refrescos kennedy, granizados kennedy bogota',
    barrios: ['Tintal', 'Castilla', 'Am\u00e9ricas', 'Timiza'],
    tiempoRespuesta: '40\u201355 min',
    destacado: 'Sur de Bogot\u00e1 con sabor',
    contenido: [
      'Fresquitox llega a Kennedy con todo su sabor. Domicilios disponibles en Tintal, Castilla, Am\u00e9ricas, Timiza y alrededores.',
      'Pedidos por WhatsApp con confirmaci\u00f3n instant\u00e1nea. Tiempo estimado: 40\u201355 minutos.',
      'Men\u00fa completo con granizados, raspados, jugos naturales, limonadas y smoothies.',
      'Para eventos y pedidos grandes en Kennedy, cont\u00e1ctanos con anticipaci\u00f3n.'
    ]
  },
  {
    slug: 'engativa',
    nombre: 'Engativ\u00e1',
    descripcionSeo: 'Domicilios Fresquitox en Engativ\u00e1, Bogot\u00e1. Refrescos naturales a tu puerta.',
    keywords: 'fresquitox engativa, domicilios refrescos engativa, granizados engativa bogota',
    barrios: ['Minuto de Dios', 'Boyac\u00e1 Real', 'Ferias', '\u00c1lamos'],
    tiempoRespuesta: '35\u201350 min',
    destacado: 'Zona occidental de Bogot\u00e1',
    contenido: [
      'Cubrimos Engativ\u00e1 con domicilios de refrescos Fresquitox. Desde Minuto de Dios hasta \u00c1lamos.',
      'Tiempo estimado: 35 a 50 minutos. Pide por WhatsApp.',
      'Men\u00fa completo disponible para domicilio y eventos.',
      'Tambi\u00e9n hacemos pedidos corporativos para oficinas y empresas en la zona.'
    ]
  },
  {
    slug: 'teusaquillo',
    nombre: 'Teusaquillo',
    descripcionSeo: 'Domicilios Fresquitox en Teusaquillo, Bogot\u00e1. Refrescos artesanales cerca del centro.',
    keywords: 'fresquitox teusaquillo, domicilios refrescos teusaquillo, granizados teusaquillo',
    barrios: ['Galer\u00edas', 'Parkway', 'La Soledad', 'Quinta Paredes'],
    tiempoRespuesta: '25\u201340 min',
    destacado: 'Centro cultural de Bogot\u00e1',
    contenido: [
      'Teusaquillo est\u00e1 cerca de nuestro punto en Chapinero, as\u00ed que los domicilios llegan r\u00e1pido.',
      'Cubrimos Galer\u00edas, Parkway, La Soledad, Quinta Paredes y todo el sector.',
      'Tiempo estimado: 25 a 40 minutos. Ideal para oficinas y universidades de la zona.',
      'Pide por WhatsApp y te confirmamos al instante.'
    ]
  },
  {
    slug: 'fontibon',
    nombre: 'Fontib\u00f3n',
    descripcionSeo: 'Domicilios Fresquitox en Fontib\u00f3n, Bogot\u00e1. Granizados y refrescos artesanales.',
    keywords: 'fresquitox fontibon, domicilios refrescos fontibon, granizados fontibon bogota',
    barrios: ['Fontib\u00f3n Centro', 'Modelia', 'Capellania', 'Villemar'],
    tiempoRespuesta: '40\u201355 min',
    destacado: 'Zona aeroportuaria',
    contenido: [
      'Llevamos Fresquitox a Fontib\u00f3n. Modelia, Fontib\u00f3n Centro, Capellania y m\u00e1s.',
      'Tiempo estimado: 40\u201355 minutos. Pedidos por WhatsApp.',
      'Men\u00fa completo disponible. Domicilios y eventos.',
      'Tambi\u00e9n atendemos empresas y oficinas en la zona con pedidos corporativos.'
    ]
  },
  {
    slug: 'barrios-unidos',
    nombre: 'Barrios Unidos',
    descripcionSeo: 'Domicilios Fresquitox en Barrios Unidos, Bogot\u00e1. Refrescos naturales y granizados.',
    keywords: 'fresquitox barrios unidos, domicilios refrescos barrios unidos',
    barrios: ['Doce de Octubre', 'Siete de Agosto', 'Andes', 'Jos\u00e9 Joaqu\u00edn Vargas'],
    tiempoRespuesta: '25\u201340 min',
    destacado: 'Cerca de Chapinero',
    contenido: [
      'Barrios Unidos est\u00e1 pegado a nuestro punto f\u00edsico. Domicilios s\u00faper r\u00e1pidos.',
      'Cubrimos todo: Doce de Octubre, Siete de Agosto, Andes y m\u00e1s.',
      'Tiempo estimado: 25\u201340 minutos.',
      'Pide por WhatsApp y disfruta Fresquitox en tu casa.'
    ]
  }
];
