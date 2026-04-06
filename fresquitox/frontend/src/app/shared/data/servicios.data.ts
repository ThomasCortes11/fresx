export type CategoriaServicio = 'residencial' | 'empresarial' | 'especializado';

export interface Servicio {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcionSeo: string;
  keywords: string;
  icono: string;
  idealPara: string[];
  contenido: string[];
  categoria: CategoriaServicio;
}

export interface CategoriaInfo {
  id: CategoriaServicio;
  titulo: string;
  subtitulo: string;
  icono: string;
}

export const CATEGORIAS: CategoriaInfo[] = [
  { id: 'residencial', titulo: 'Servicios Residenciales', subtitulo: 'Soluciones de plomería para tu hogar en Bogotá', icono: '🏠' },
  { id: 'empresarial', titulo: 'Servicios Empresariales', subtitulo: 'Mantenimiento y reparación para edificios y empresas', icono: '🏢' },
  { id: 'especializado', titulo: 'Servicios Especializados', subtitulo: 'Plomería profesional para sectores específicos', icono: '⚙️' },
];

export const SERVICIOS: Servicio[] = [
  // ═══════════════════════════════════════════════
  //  RESIDENCIALES
  // ═══════════════════════════════════════════════
  {
    slug: 'destaqueos-y-desagues',
    nombre: 'Destaqueos y Desagües',
    descripcionCorta: 'Desobstrucción profesional de desagües y sifones con sonda eléctrica y equipos de alta presión.',
    descripcionSeo: 'Destaqueos y desagües en Bogotá. Desobstrucción profesional de sifones, lavaplatos y cañerías con sonda eléctrica. Atención inmediata 24/7. SEP Soluciones.',
    keywords: 'destaqueos bogota, destaqueo desagues bogota, destape desagues bogota, desobstruccion desagues bogota, plomero destaqueos bogota, destaqueo sifones bogota, destaqueo cañerias bogota, servicio destaqueos bogota 24 horas',
    icono: '🔧',
    idealPara: ['Casas', 'Apartamentos', 'Fincas'],
    contenido: [
      'Desobstrucción profesional de desagües y sifones con sonda eléctrica y equipos de alta presión.',
      'Eliminamos taponamientos por grasa, cabellos, residuos sólidos y raíces en cualquier tipo de tubería residencial.',
      'Servicio rápido, limpio y con garantía. Atención inmediata en toda Bogotá.'
    ],
    categoria: 'residencial'
  },
  {
    slug: 'plomeria-sanitarios',
    nombre: 'Sanitarios',
    descripcionCorta: 'Instalación, reparación y destape de sanitarios. Solucionamos fugas, filtraciones y problemas de descarga.',
    descripcionSeo: 'Reparación e instalación de sanitarios en Bogotá. Solucionamos fugas, filtraciones y taponamientos. Plomeros certificados con atención inmediata. SEP Soluciones.',
    keywords: 'reparacion sanitarios bogota, instalacion sanitarios bogota, destape sanitarios bogota, plomero sanitarios bogota, arreglo sanitario bogota, sanitario tapado bogota, fuga sanitario bogota, cambio sanitario bogota',
    icono: '🚽',
    idealPara: ['Cambios de sanitario', 'Fugas en la base', 'Taponamientos'],
    contenido: [
      'Instalación, reparación y destape de sanitarios de todas las marcas y modelos.',
      'Solucionamos fugas en la base, problemas de descarga, filtraciones y taponamientos de forma rápida y limpia.',
      'Utilizamos repuestos originales y garantizamos cada trabajo realizado.'
    ],
    categoria: 'residencial'
  },
  {
    slug: 'plomeria-duchas',
    nombre: 'Duchas',
    descripcionCorta: 'Reparación e instalación de duchas, cabinas y grifería. Solucionamos goteos, baja presión y filtraciones.',
    descripcionSeo: 'Reparación e instalación de duchas en Bogotá. Solucionamos goteos, baja presión y filtraciones. Plomeros profesionales con garantía. SEP Soluciones.',
    keywords: 'reparacion duchas bogota, instalacion duchas bogota, plomero duchas bogota, goteo ducha bogota, baja presion ducha bogota, filtracion ducha bogota, cambio griferia ducha bogota, cabina ducha bogota',
    icono: '🚿',
    idealPara: ['Goteos persistentes', 'Baja presión', 'Cambio de grifería'],
    contenido: [
      'Reparación e instalación de duchas, cabinas y grifería de todas las marcas.',
      'Solucionamos goteos persistentes, problemas de baja presión, filtraciones en paredes y pisos.',
      'Instalamos duchas nuevas con acabado profesional y garantía completa.'
    ],
    categoria: 'residencial'
  },
  {
    slug: 'plomeria-lavamanos',
    nombre: 'Lavamanos',
    descripcionCorta: 'Instalación y reparación de lavamanos, griferías y sifones. Eliminamos goteos y taponamientos.',
    descripcionSeo: 'Reparación e instalación de lavamanos en Bogotá. Eliminamos goteos, taponamientos y filtraciones. Servicio profesional con garantía. SEP Soluciones.',
    keywords: 'reparacion lavamanos bogota, instalacion lavamanos bogota, plomero lavamanos bogota, goteo lavamanos bogota, destape lavamanos bogota, sifon lavamanos bogota, cambio griferia lavamanos bogota',
    icono: '🪥',
    idealPara: ['Goteos en grifería', 'Sifones tapados', 'Instalación nueva'],
    contenido: [
      'Instalación y reparación de lavamanos, griferías y sifones de baño.',
      'Eliminamos goteos, taponamientos y filtraciones con herramientas especializadas.',
      'Trabajo limpio, rápido y con garantía en toda Bogotá.'
    ],
    categoria: 'residencial'
  },
  {
    slug: 'plomeria-cocinas',
    nombre: 'Cocinas',
    descripcionCorta: 'Plomería integral para cocinas: lavaplatos, grifos, conexiones de gas y desagües.',
    descripcionSeo: 'Plomería para cocinas en Bogotá. Reparación de lavaplatos, grifos, conexiones y desagües. Atención inmediata con plomeros certificados. SEP Soluciones.',
    keywords: 'plomeria cocinas bogota, reparacion lavaplatos bogota, destape lavaplatos bogota, plomero cocina bogota, grifo cocina bogota, desague cocina bogota, instalacion lavaplatos bogota, fuga cocina bogota',
    icono: '🍳',
    idealPara: ['Lavaplatos', 'Grifos de cocina', 'Desagües'],
    contenido: [
      'Plomería integral para cocinas: reparación e instalación de lavaplatos, grifos, conexiones y desagües.',
      'Solucionamos fugas, taponamientos y problemas de presión en el área de cocina.',
      'Servicio profesional con garantía para hogares en toda Bogotá.'
    ],
    categoria: 'residencial'
  },
  {
    slug: 'plomeria-zonas-de-lavado',
    nombre: 'Zonas de Lavado',
    descripcionCorta: 'Instalación y reparación de conexiones para lavadoras, lavaderos y desagües en zonas de lavado.',
    descripcionSeo: 'Plomería para zonas de lavado en Bogotá. Instalación y reparación de conexiones para lavadoras, lavaderos y desagües. SEP Soluciones.',
    keywords: 'plomeria zona lavado bogota, conexion lavadora bogota, plomero zona lavado bogota, desague lavadora bogota, instalacion lavadero bogota, reparacion zona de ropas bogota, fuga lavadora bogota',
    icono: '👕',
    idealPara: ['Conexión de lavadoras', 'Lavaderos', 'Desagües de zona de ropas'],
    contenido: [
      'Instalación y reparación de conexiones para lavadoras, lavaderos y desagües en zonas de lavado.',
      'Garantizamos conexiones seguras y funcionales que evitan fugas e inundaciones.',
      'Servicio a domicilio para casas y apartamentos en Bogotá.'
    ],
    categoria: 'residencial'
  },
  {
    slug: 'plomeria-calentadores',
    nombre: 'Calentadores',
    descripcionCorta: 'Instalación, reparación y mantenimiento de calentadores de agua a gas y eléctricos.',
    descripcionSeo: 'Instalación y reparación de calentadores de agua en Bogotá. Calentadores a gas y eléctricos. Técnicos certificados con garantía. SEP Soluciones.',
    keywords: 'instalacion calentador bogota, reparacion calentador bogota, plomero calentadores bogota, calentador de agua bogota, mantenimiento calentador bogota, calentador gas bogota, calentador electrico bogota, cambio calentador bogota',
    icono: '🔥',
    idealPara: ['Calentadores a gas', 'Calentadores eléctricos', 'Mantenimiento preventivo'],
    contenido: [
      'Instalación, reparación y mantenimiento de calentadores de agua a gas y eléctricos de todas las marcas.',
      'Diagnóstico profesional, cambio de repuestos originales y puesta a punto.',
      'Técnicos certificados con garantía completa en toda Bogotá.'
    ],
    categoria: 'residencial'
  },
  {
    slug: 'deteccion-de-fugas',
    nombre: 'Detección de Fugas',
    descripcionCorta: 'Localizamos fugas ocultas con geófono digital y cámara industrial, sin demoler pisos ni paredes.',
    descripcionSeo: 'Detección de fugas de agua sin romper en Bogotá. Localizamos fugas ocultas con geófono digital y cámara industrial. Diagnóstico rápido, limpio y preciso. SEP Soluciones.',
    keywords: 'deteccion de fugas bogota, deteccion de fugas sin romper, deteccion de fugas agua bogota, deteccion de fugas bogota norte, deteccion de fugas chapinero, deteccion de fugas suba, plomero deteccion fugas bogota, empresa deteccion fugas bogota, servicio deteccion fugas bogota, geofono digital bogota, fugas ocultas bogota, filtraciones agua bogota',
    icono: '🔍',
    idealPara: ['Humedades', 'Filtraciones', 'Consumos anormales de agua'],
    contenido: [
      'Localizamos fugas ocultas con geófono digital y cámara industrial, sin demoler pisos ni paredes.',
      'Diagnóstico rápido, limpio y preciso que evita daños innecesarios y reduce significativamente los costos de reparación.',
      'Ideal para detectar humedades, filtraciones y consumos anormales de agua en hogares.'
    ],
    categoria: 'residencial'
  },
  {
    slug: 'tuberias-internas',
    nombre: 'Tuberías Internas',
    descripcionCorta: 'Reparación, cambio e instalación de tuberías internas de agua fría, caliente y desagüe.',
    descripcionSeo: 'Reparación e instalación de tuberías internas en Bogotá. Tuberías de agua fría, caliente y desagüe. Plomeros profesionales con garantía. SEP Soluciones.',
    keywords: 'reparacion tuberias internas bogota, cambio tuberias bogota, instalacion tuberias bogota, plomero tuberias bogota, tuberia agua fria bogota, tuberia agua caliente bogota, tuberia desague bogota, fuga tuberia bogota',
    icono: '🔩',
    idealPara: ['Tuberías rotas', 'Cambio de redes', 'Instalaciones nuevas'],
    contenido: [
      'Reparación, cambio e instalación de tuberías internas de agua fría, agua caliente y desagüe.',
      'Trabajamos con tubería PVC, CPVC, cobre y PPR para garantizar durabilidad y calidad.',
      'Diagnóstico preciso y trabajo limpio con garantía por escrito.'
    ],
    categoria: 'residencial'
  },

  // ═══════════════════════════════════════════════
  //  EMPRESARIALES
  // ═══════════════════════════════════════════════
  {
    slug: 'banos-y-zonas-comunes',
    nombre: 'Baños y Zonas Comunes',
    descripcionCorta: 'Mantenimiento y reparación de baños públicos, zonas comunes y áreas de servicio en edificios.',
    descripcionSeo: 'Plomería para baños y zonas comunes en Bogotá. Mantenimiento y reparación de sanitarios, lavamanos y redes en edificios y conjuntos. SEP Soluciones.',
    keywords: 'plomeria baños zonas comunes bogota, mantenimiento baños edificios bogota, reparacion baños conjuntos bogota, plomero baños empresas bogota, sanitarios zonas comunes bogota, plomeria edificios bogota',
    icono: '🚻',
    idealPara: ['Edificios de oficinas', 'Conjuntos residenciales', 'Centros empresariales'],
    contenido: [
      'Mantenimiento y reparación integral de baños públicos, zonas comunes y áreas de servicio en edificios.',
      'Atendemos sanitarios, lavamanos, orinales, grifería y redes de desagüe con mínima interrupción.',
      'Planes programados para garantizar el funcionamiento óptimo y la imagen de su edificio.'
    ],
    categoria: 'empresarial'
  },
  {
    slug: 'redes-hidraulicas-y-sanitarias',
    nombre: 'Redes Hidráulicas y Sanitarias',
    descripcionCorta: 'Instalación, reparación y mantenimiento de redes hidráulicas y sanitarias para edificaciones.',
    descripcionSeo: 'Redes hidráulicas y sanitarias en Bogotá. Instalación, reparación y mantenimiento para edificios y empresas. Ingenieros y plomeros certificados. SEP Soluciones.',
    keywords: 'redes hidraulicas bogota, redes sanitarias bogota, instalacion redes hidraulicas bogota, mantenimiento redes sanitarias bogota, plomeria redes edificios bogota, reparacion redes hidraulicas bogota, plomero redes sanitarias bogota',
    icono: '🏗️',
    idealPara: ['Edificios nuevos', 'Remodelaciones', 'Ampliaciones'],
    contenido: [
      'Instalación, reparación y mantenimiento de redes hidráulicas y sanitarias para edificaciones de todo tipo.',
      'Diseñamos y ejecutamos proyectos con materiales certificados y cumplimiento normativo.',
      'Equipo técnico de ingenieros y plomeros certificados con amplia experiencia en Bogotá.'
    ],
    categoria: 'empresarial'
  },
  {
    slug: 'areas-sociales-y-recreativas',
    nombre: 'Áreas Sociales y Recreativas',
    descripcionCorta: 'Plomería para piscinas, jacuzzis, zonas BBQ, salones sociales y áreas recreativas.',
    descripcionSeo: 'Plomería para áreas sociales y recreativas en Bogotá. Piscinas, jacuzzis, zonas BBQ y salones sociales. Mantenimiento profesional. SEP Soluciones.',
    keywords: 'plomeria areas sociales bogota, plomeria piscinas bogota, mantenimiento jacuzzi bogota, plomeria zonas bbq bogota, plomero salones sociales bogota, plomeria areas recreativas bogota, mantenimiento piscinas bogota',
    icono: '🏊',
    idealPara: ['Piscinas', 'Jacuzzis', 'Zonas BBQ', 'Salones sociales'],
    contenido: [
      'Plomería especializada para piscinas, jacuzzis, zonas BBQ, salones sociales y áreas recreativas.',
      'Mantenimiento preventivo y correctivo de sistemas hidráulicos en zonas comunes de conjuntos y clubes.',
      'Garantizamos funcionamiento óptimo y seguridad en todas las instalaciones.'
    ],
    categoria: 'empresarial'
  },
  {
    slug: 'sistemas-agua-potable-y-presurizacion',
    nombre: 'Sistemas de Agua Potable y Presurización',
    descripcionCorta: 'Instalación y mantenimiento de tanques de agua, bombas y sistemas de presurización para edificios.',
    descripcionSeo: 'Sistemas de agua potable y presurización en Bogotá. Instalación y mantenimiento de tanques, bombas y equipos de presión. SEP Soluciones.',
    keywords: 'sistemas agua potable bogota, presurizacion agua bogota, tanques agua edificios bogota, bombas agua bogota, sistema presion agua bogota, mantenimiento tanques bogota, instalacion bombas agua bogota, plomero presurizacion bogota',
    icono: '💧',
    idealPara: ['Tanques de almacenamiento', 'Bombas de presión', 'Edificios de altura'],
    contenido: [
      'Instalación y mantenimiento de tanques de agua, bombas y sistemas de presurización para edificios.',
      'Garantizamos presión constante y suministro continuo de agua potable en todas las plantas.',
      'Cumplimiento normativo y asesoría técnica para optimizar el consumo de agua.'
    ],
    categoria: 'empresarial'
  },
  {
    slug: 'parqueaderos-y-areas-tecnicas',
    nombre: 'Parqueaderos y Áreas Técnicas',
    descripcionCorta: 'Mantenimiento de drenajes, trampas de grasa, cuartos técnicos y redes de parqueaderos.',
    descripcionSeo: 'Plomería para parqueaderos y áreas técnicas en Bogotá. Drenajes, trampas de grasa y cuartos técnicos. Mantenimiento profesional. SEP Soluciones.',
    keywords: 'plomeria parqueaderos bogota, drenajes parqueaderos bogota, trampas de grasa bogota, cuartos tecnicos plomeria bogota, mantenimiento drenajes bogota, plomero areas tecnicas bogota, plomeria sotanos bogota',
    icono: '🅿️',
    idealPara: ['Parqueaderos subterráneos', 'Cuartos de máquinas', 'Trampas de grasa'],
    contenido: [
      'Mantenimiento especializado de drenajes, trampas de grasa, cuartos técnicos y redes de parqueaderos.',
      'Prevención de inundaciones y malos olores con limpieza programada y equipos profesionales.',
      'Servicio para conjuntos residenciales, edificios corporativos y centros comerciales.'
    ],
    categoria: 'empresarial'
  },
  {
    slug: 'mantenimiento-preventivo',
    nombre: 'Mantenimiento Preventivo',
    descripcionCorta: 'Planes de mantenimiento programado para redes hidráulicas, sanitarias y equipos de presurización.',
    descripcionSeo: 'Mantenimiento preventivo de plomería en Bogotá. Planes programados para redes hidráulicas, sanitarias y equipos. Contratos a medida. SEP Soluciones.',
    keywords: 'mantenimiento preventivo plomeria bogota, planes mantenimiento plomeria bogota, contrato mantenimiento plomeria bogota, mantenimiento hidraulico preventivo bogota, mantenimiento programado plomeria bogota, plomeria preventiva empresas bogota',
    icono: '📋',
    idealPara: ['Contratos mensuales', 'Inspecciones periódicas', 'Reducción de emergencias'],
    contenido: [
      'Planes de mantenimiento programado para redes hidráulicas, sanitarias y equipos de presurización.',
      'Inspecciones periódicas que detectan problemas antes de que se conviertan en emergencias costosas.',
      'Contratos a medida con reportes técnicos y seguimiento continuo para su tranquilidad.'
    ],
    categoria: 'empresarial'
  },

  // ═══════════════════════════════════════════════
  //  ESPECIALIZADOS
  // ═══════════════════════════════════════════════
  {
    slug: 'plomeria-restaurantes',
    nombre: 'Restaurantes',
    descripcionCorta: 'Plomería especializada para restaurantes: trampas de grasa, redes de cocina industrial y desagües.',
    descripcionSeo: 'Plomería para restaurantes en Bogotá. Trampas de grasa, redes de cocina industrial, desagües y cumplimiento normativo. SEP Soluciones.',
    keywords: 'plomeria restaurantes bogota, trampa de grasa restaurantes bogota, plomero restaurante bogota, desague cocina industrial bogota, plomeria cocina industrial bogota, mantenimiento plomeria restaurantes bogota, limpieza trampas grasa bogota',
    icono: '🍽️',
    idealPara: ['Cocinas industriales', 'Trampas de grasa', 'Cumplimiento sanitario'],
    contenido: [
      'Plomería especializada para restaurantes: instalación y mantenimiento de trampas de grasa, redes de cocina industrial y desagües.',
      'Garantizamos cumplimiento de la normativa sanitaria vigente y funcionamiento continuo.',
      'Planes de mantenimiento programado para evitar cierres por emergencias hidráulicas.'
    ],
    categoria: 'especializado'
  },
  {
    slug: 'plomeria-centros-comerciales',
    nombre: 'Centros Comerciales',
    descripcionCorta: 'Mantenimiento hidráulico integral para centros comerciales: baños públicos, fuentes y redes generales.',
    descripcionSeo: 'Plomería para centros comerciales en Bogotá. Baños públicos, fuentes, redes generales y mantenimiento hidráulico integral. SEP Soluciones.',
    keywords: 'plomeria centros comerciales bogota, mantenimiento hidraulico centro comercial bogota, plomero centro comercial bogota, baños publicos centro comercial bogota, redes hidraulicas centro comercial bogota',
    icono: '🏬',
    idealPara: ['Baños públicos', 'Fuentes decorativas', 'Redes generales de agua'],
    contenido: [
      'Mantenimiento hidráulico integral para centros comerciales: baños públicos, fuentes decorativas y redes generales.',
      'Atención rápida con mínima interrupción para locales y visitantes.',
      'Equipos especializados para atender grandes superficies y alta demanda de servicios.'
    ],
    categoria: 'especializado'
  },
  {
    slug: 'plomeria-oficinas-y-empresas',
    nombre: 'Oficinas y Empresas',
    descripcionCorta: 'Plomería profesional para oficinas y empresas: baños, cocinas, redes y mantenimiento programado.',
    descripcionSeo: 'Plomería para oficinas y empresas en Bogotá. Baños, cocinas, redes hidráulicas y mantenimiento programado. Contratos a medida. SEP Soluciones.',
    keywords: 'plomeria oficinas bogota, plomero empresas bogota, mantenimiento plomeria oficinas bogota, plomeria corporativa bogota, plomeria edificios oficinas bogota, reparacion baños oficina bogota',
    icono: '💼',
    idealPara: ['Edificios corporativos', 'Oficinas', 'Coworkings'],
    contenido: [
      'Plomería profesional para oficinas y empresas: mantenimiento de baños, cocinas y redes hidráulicas.',
      'Contratos a medida que garantizan respuesta inmediata y cero interrupciones operativas.',
      'Atención discreta y profesional adaptada al horario de su empresa.'
    ],
    categoria: 'especializado'
  },
  {
    slug: 'plomeria-colegios-y-universidades',
    nombre: 'Colegios y Universidades',
    descripcionCorta: 'Mantenimiento hidráulico para instituciones educativas: baños, laboratorios, cafeterías y zonas deportivas.',
    descripcionSeo: 'Plomería para colegios y universidades en Bogotá. Mantenimiento de baños, laboratorios, cafeterías y zonas deportivas. SEP Soluciones.',
    keywords: 'plomeria colegios bogota, plomeria universidades bogota, plomero instituciones educativas bogota, mantenimiento hidraulico colegios bogota, plomeria laboratorios bogota, plomeria cafeterias colegios bogota',
    icono: '🎓',
    idealPara: ['Baños estudiantiles', 'Laboratorios', 'Cafeterías', 'Zonas deportivas'],
    contenido: [
      'Mantenimiento hidráulico especializado para instituciones educativas: baños, laboratorios, cafeterías y zonas deportivas.',
      'Trabajamos en horarios que no afectan las actividades académicas.',
      'Planes preventivos que garantizan seguridad e higiene para estudiantes y personal.'
    ],
    categoria: 'especializado'
  },
  {
    slug: 'plomeria-clinicas-y-hospitales',
    nombre: 'Clínicas y Hospitales',
    descripcionCorta: 'Plomería hospitalaria: redes de agua potable, desagües especiales y cumplimiento normativo sanitario.',
    descripcionSeo: 'Plomería para clínicas y hospitales en Bogotá. Redes de agua potable, desagües especiales y cumplimiento normativo sanitario. SEP Soluciones.',
    keywords: 'plomeria clinicas bogota, plomeria hospitales bogota, plomero hospital bogota, redes agua potable clinica bogota, desagues hospitalarios bogota, mantenimiento hidraulico hospital bogota, plomeria sanitaria hospital bogota',
    icono: '🏥',
    idealPara: ['Redes de agua potable', 'Desagües especiales', 'Cumplimiento normativo'],
    contenido: [
      'Plomería hospitalaria especializada: redes de agua potable, desagües especiales y sistemas de alta exigencia.',
      'Cumplimos estrictamente la normativa sanitaria vigente para instituciones de salud.',
      'Atención prioritaria con protocolos de bioseguridad y mínima interrupción operativa.'
    ],
    categoria: 'especializado'
  }
];
