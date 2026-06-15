export const categories = [
  { id: "all", label: "Todos" },
  { id: "courses", label: "Cursos" },
  { id: "packs", label: "Packs" },
  { id: "ebooks", label: "Ebooks" },
  { id: "templates", label: "Plantillas" },
  { id: "assets", label: "Recursos" },
];

export const productTypes = [
  { id: "course", label: "Curso" },
  { id: "pack", label: "Pack" },
  { id: "ebook", label: "Ebook" },
  { id: "template", label: "Plantilla" },
  { id: "asset", label: "Recurso" },
];

export const collections = [
  {
    id: "continue",
    title: "Seguir viendo",
    subtitle: "Retoma exactamente donde lo dejaste.",
  },
  {
    id: "recommended",
    title: "Recomendados para ti",
    subtitle: "Contenidos alineados con tu uso más reciente.",
  },
  {
    id: "latest",
    title: "Novedades",
    subtitle: "Nuevos materiales añadidos a la biblioteca.",
  },
];

export const legalPages = [
  {
    slug: "terms",
    title: "Términos de uso",
    summary: "Normas generales de uso de la plataforma, acceso y responsabilidades.",
  },
  {
    slug: "privacy",
    title: "Política de privacidad",
    summary: "Cómo tratamos, almacenamos y protegemos tus datos.",
  },
];

const lesson = (id, title, duration, completed = false) => ({
  id,
  title,
  duration,
  completed,
});

const module = (id, title, lessons) => ({
  id,
  title,
  lessons,
});

export const productCatalog = [
  {
    id: "prompt-masterclass",
    slug: "prompt-masterclass",
    title: "Masterclass de prompts",
    type: "course",
    category: "courses",
    access: "owned",
    badge: "Nuevo",
    featured: true,
    locked: false,
    duration: "6h 40m",
    itemCount: 18,
    lessonsCount: 18,
    author: "VBM Devs",
    description:
      "Curso estructurado para crear imágenes consistentes con IA en distintos nichos, desde el briefing hasta el refinado final.",
    cover: "/images/ai-prompt-packs-hero.png",
    tags: ["IA", "prompts", "workflow", "creación"],
    progress: 72,
    rating: 4.9,
    modules: [
      module("fundamentals", "Fundamentos", [
        lesson("l1", "Vista general de la biblioteca", "18 min", true),
        lesson("l2", "Estructura de un buen prompt", "22 min", true),
        lesson("l3", "Ajustes por nicho", "20 min", false),
      ]),
      module("production", "Producción", [
        lesson("l4", "Dirección visual", "26 min", false),
        lesson("l5", "Referencias y estilo", "24 min", false),
        lesson("l6", "Iteración rápida", "19 min", false),
      ]),
    ],
  },
  {
    id: "social-visual-pack",
    slug: "social-visual-pack",
    title: "Pack visual social",
    type: "pack",
    category: "packs",
    access: "owned",
    badge: "Continuar",
    featured: true,
    locked: false,
    duration: "2h 15m",
    itemCount: 24,
    lessonsCount: 12,
    author: "VBM Devs",
    description:
      "Secuencia de prompts para Instagram, stories y campañas con una identidad visual más actual y coherente.",
    cover:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["social", "brand", "instagram", "stories"],
    progress: 48,
    rating: 4.8,
    modules: [
      module("content", "Contenido", [
        lesson("l7", "Feed y carrusel", "16 min", true),
        lesson("l8", "Stories que convierten", "14 min", true),
        lesson("l9", "Portadas y destacados", "12 min", false),
      ]),
    ],
  },
  {
    id: "luxury-editorial-set",
    slug: "luxury-editorial-set",
    title: "Set editorial premium",
    type: "pack",
    category: "packs",
    access: "locked",
    badge: "Premium",
    featured: false,
    locked: true,
    duration: "1h 50m",
    itemCount: 20,
    lessonsCount: 10,
    author: "VBM Devs",
    description:
      "Dirección editorial para moda, viajes, lujo y lifestyle con un acabado más cinematográfico.",
    cover:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tags: ["lujo", "editorial", "fashion", "lifestyle"],
    progress: 0,
    rating: 4.7,
    modules: [
      module("editorial", "Editorial", [
        lesson("l10", "Composición premium", "20 min", false),
        lesson("l11", "Ambiente y mood", "18 min", false),
      ]),
    ],
  },
  {
    id: "business-ads-kit",
    slug: "business-ads-kit",
    title: "Kit de anuncios para negocio",
    type: "template",
    category: "templates",
    access: "owned",
    badge: "Top",
    featured: true,
    locked: false,
    duration: "3h 05m",
    itemCount: 32,
    lessonsCount: 14,
    author: "VBM Devs",
    description:
      "Plantillas y prompts para anuncios, creatividades y materiales comerciales con foco en conversión.",
    cover:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    tags: ["negocio", "ads", "plantillas", "conversión"],
    progress: 100,
    rating: 4.9,
    modules: [
      module("ads", "Creatividades", [
        lesson("l12", "Ángulos de oferta", "15 min", true),
        lesson("l13", "Variantes para pruebas", "17 min", true),
        lesson("l14", "Optimización de copy", "18 min", true),
      ]),
    ],
  },
  {
    id: "ebook-system",
    slug: "ebook-system",
    title: "Ebook del sistema de prompts",
    type: "ebook",
    category: "ebooks",
    access: "owned",
    badge: "Ebook",
    featured: false,
    locked: false,
    duration: "45m",
    itemCount: 1,
    lessonsCount: 6,
    author: "VBM Devs",
    description:
      "Guía directa para organizar una biblioteca de prompts y crear un sistema reutilizable.",
    cover:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    tags: ["ebook", "sistema", "organización"],
    progress: 18,
    rating: 4.6,
    modules: [
      module("ebook", "Lectura guiada", [
        lesson("l15", "Estructura del sistema", "12 min", true),
        lesson("l16", "Biblioteca y etiquetas", "10 min", false),
      ]),
    ],
  },
  {
    id: "assets-lab",
    slug: "assets-lab",
    title: "Laboratorio de recursos",
    type: "asset",
    category: "assets",
    access: "locked",
    badge: "Nuevo",
    featured: false,
    locked: true,
    duration: "1h 10m",
    itemCount: 48,
    lessonsCount: 8,
    author: "VBM Devs",
    description:
      "Paquete de recursos, imágenes y complementos para acelerar la producción de nuevos productos.",
    cover:
      "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1200&q=80",
    tags: ["recursos", "materiales", "descargas"],
    progress: 0,
    rating: 4.5,
    modules: [
      module("library", "Recursos", [
        lesson("l17", "Archivos base", "14 min", false),
        lesson("l18", "Complementos", "18 min", false),
      ]),
    ],
  },
];
