export interface BlogPost {
  slug: string;
  titulo: string;
  extracto: string;
  descripcionSeo: string;
  keywords: string;
  fecha: string;
  imagen: string;
  contenido: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'mejores-granizados-bogota',
    titulo: 'Los Mejores Granizados Artesanales de Bogot\u00e1',
    extracto: 'Descubre por qu\u00e9 los granizados Fresquitox son los favoritos de Chapinero y toda Bogot\u00e1.',
    descripcionSeo: 'Gu\u00eda de los mejores granizados artesanales en Bogot\u00e1. Sabores, preparaci\u00f3n y d\u00f3nde encontrarlos. Fresquitox Chapinero.',
    keywords: 'granizados bogota, mejores granizados, granizados artesanales chapinero, fresquitox granizados',
    fecha: '2025-06-15',
    imagen: '/images/blog/granizados.webp',
    contenido: [
      'Los granizados artesanales han sido parte de la cultura bogotana durante d\u00e9cadas. En Fresquitox, hemos llevado esta tradici\u00f3n a un nivel completamente nuevo, combinando t\u00e9cnicas artesanales con sabores innovadores que rompen esquemas.',
      'Nuestros granizados se preparan con hielo cristalino finamente triturado y jarabes artesanales hechos en casa con frutas frescas, sin colorantes artificiales ni conservantes. Cada vaso es una obra de arte: capas de color vibrante que se funden en una explosi\u00f3n de sabor.',
      'Entre nuestros sabores m\u00e1s populares est\u00e1n el cl\u00e1sico de fresa con leche condensada, el tropical de maracuy\u00e1 con mango, y nuestro especial Fresquitox que combina tres frutas de temporada. Tambi\u00e9n ofrecemos versiones con licor para los amantes de los c\u00f3cteles helados.',
      'Vis\u00edtanos en nuestro punto f\u00edsico de Chapinero o p\u00eddelo a domicilio en toda Bogot\u00e1. Los granizados Fresquitox son el refresco perfecto para cualquier momento del d\u00eda, ya sea una tarde calurosa o una noche de fiesta con amigos.'
    ]
  },
  {
    slug: 'beneficios-jugos-naturales',
    titulo: 'Beneficios de los Jugos Naturales para tu Salud',
    extracto: 'Conoce las ventajas de incluir jugos 100% naturales en tu rutina diaria.',
    descripcionSeo: 'Beneficios para la salud de tomar jugos naturales sin conservantes. Frutas frescas, vitaminas y energ\u00eda. Fresquitox jugos naturales Bogot\u00e1.',
    keywords: 'jugos naturales bogota, beneficios jugos naturales, jugos frescos bogota, vitaminas jugos frutas',
    fecha: '2025-06-01',
    imagen: '/images/blog/jugos.webp',
    contenido: [
      'En un mundo lleno de bebidas procesadas y azucaradas, volver a lo natural es una decisi\u00f3n inteligente. Los jugos 100% naturales ofrecen vitaminas, minerales y antioxidantes que tu cuerpo necesita para funcionar al m\u00e1ximo.',
      'En Fresquitox preparamos cada jugo al momento con frutas frescas seleccionadas. No usamos concentrados, conservantes ni az\u00facares a\u00f1adidos. El resultado es un jugo vivo, lleno de color y sabor real que tu cuerpo agradece.',
      'Nuestro men\u00fa de jugos incluye opciones cl\u00e1sicas como naranja, mandarina y lim\u00f3n, adem\u00e1s de combinaciones con guayaba, mango, lulo, mora y frutas de temporada. Cada combinaci\u00f3n est\u00e1 pensada para equilibrar sabor y beneficios nutricionales.',
      'Incluir un jugo natural al d\u00eda puede mejorar tu digesti\u00f3n, fortalecer tu sistema inmune, mejorar la piel y darte energ\u00eda genuina sin los crashes del caf\u00e9 o las bebidas energ\u00e9ticas. Tu cuerpo lo notar\u00e1 desde la primera semana.'
    ]
  },
  {
    slug: 'eventos-fresquitox-chapinero',
    titulo: 'Eventos en Vivo en Fresquitox Chapinero',
    extracto: 'M\u00fasica, DJ, karaoke y refrescos: todo lo que pasa en nuestras noches de Chapinero.',
    descripcionSeo: 'Eventos, m\u00fasica en vivo, DJ sets y karaoke en Fresquitox Chapinero, Bogot\u00e1. Cronograma de eventos y noches especiales.',
    keywords: 'eventos chapinero bogota, musica en vivo chapinero, dj bogota, karaoke chapinero, noches chapinero',
    fecha: '2025-05-20',
    imagen: '/images/blog/eventos.webp',
    contenido: [
      'Fresquitox no es solo refrescos. Nuestro punto en Chapinero se ha convertido en uno de los lugares m\u00e1s vibrantes para disfrutar de m\u00fasica en vivo, DJ sets y noches de karaoke mientras saboreas los mejores granizados de Bogot\u00e1.',
      'Cada semana organizamos eventos tem\u00e1ticos: desde noches de tropical house con DJ Fresqui, hasta ac\u00fasticos de vallenato fusi\u00f3n con artistas locales. Nuestras noches de karaoke son legendarias \u2014 sube al escenario, canta tu favorita y podr\u00eddas ganar granizados gratis.',
      'Tambi\u00e9n ofrecemos el espacio y servicio completo para eventos privados. Si est\u00e1s planeando un cumplea\u00f1os, reuni\u00f3n corporativa o cualquier celebraci\u00f3n, podemos armar una estaci\u00f3n de refrescos con DJ incluido. Cont\u00e1ctanos por WhatsApp para cotizar.',
      'Consulta nuestro cronograma actualizado en la secci\u00f3n de Eventos del sitio web o s\u00edguenos en Instagram para enterarte de fechas, artistas invitados y sorpresas de \u00faltima hora. En Fresquitox, cada noche es diferente.'
    ]
  }
];
