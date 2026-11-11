// Home
import { EventoNoticia, Proyecto, ContenidoSitio, Valor, Glosario } from "@/types";
// Datos de ejemplo para el carrusel
export const slides = [
    {
      ID: 1,
      tipo:"banner",
      titulo: "Soluciones innovadoras para tu negocio",
      texto: "Descubre cómo podemos ayudarte a crecer y alcanzar tus objetivos",
      imagen: "bg-secondary/90",
      estado: "Activo",
      fecha_creacion: "2024-01-01",
    },
    {
      ID: 2,
      tipo: "banner",
      titulo: "Productos de alta calidad",
      texto: "Diseñados para satisfacer las necesidades más exigentes del mercado",
      imagen: "bg-secondary/90",
      estado: "Activo",
      fecha_creacion: "2024-01-01",
    },
    {
      ID: 3,
      tipo:"banner",
      titulo: "Servicio personalizado",
      texto: "Atención dedicada para cada uno de nuestros clientes",
      imagen: "bg-accent/90",
      estado: "Activo",
      fecha_creacion: "2024-01-01",
    },
  ]

export const Mision: ContenidoSitio ={
    ID: 1,
    tipo: "mision",
    titulo: "Nuestra Misión",
    texto: "Proporcionar soluciones innovadoras y de alta calidad que transformen la manera en que nuestros clientes interactúan con la tecnología, facilitando su crecimiento y éxito en un mundo digital en constante evolución. Nos comprometemos a ofrecer un servicio excepcional, mantener los más altos estándares éticos y contribuir positivamente a las comunidades en las que operamos.",
    imagen: "/placeholder.svg?height=400&width=600",
    estado: "activo",
    fecha_creacion: "2024-01-01",
}
export const Vision: ContenidoSitio = {
    ID: 2,
    tipo: "vision",
    titulo: "Nuestra Visión",
    texto: "Ser un referente internacional en la investigación de usabilidad y experiencia de usuario, contribuyendo al desarrollo de tecnologías centradas en las personas y formando profesionales capaces de diseñar soluciones que mejoren la calidad de vida de los usuarios.",
    imagen: "/placeholder.svg?height=400&width=600",
    estado:"activo",
    fecha_creacion: "2024-01-01",
}

export const Valores: Valor[] = [
  {
    ID: 1,
    tipo: "valores",
    imagen: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    titulo: "Integridad",
    texto: "Actuamos con honestidad, transparencia y ética en todas nuestras interacciones, manteniendo los más altos estándares de conducta profesional.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 2,
    tipo: "valores",
    imagen: "M13 10V3L4 14h7v7l9-11h-7z",
    titulo: "Innovación",
    texto: "Fomentamos la creatividad y el pensamiento disruptivo, buscando constantemente nuevas formas de resolver problemas y crear valor para nuestros clientes.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 3,
    tipo: "valores",
    imagen: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    titulo: "Colaboración",
    texto: "Trabajamos juntos como un equipo unificado, valorando la diversidad de perspectivas y habilidades para lograr resultados excepcionales.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 4,
    tipo: "valores",
    imagen: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    titulo: "Excelencia",
    texto: "Nos esforzamos por alcanzar los más altos niveles de calidad en todo lo que hacemos, superando constantemente las expectativas de nuestros clientes.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 5,
    tipo: "valores",
    imagen: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    titulo: "Responsabilidad",
    texto: "Asumimos la responsabilidad de nuestras acciones y decisiones, cumpliendo nuestros compromisos con clientes, empleados y comunidades.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 6,
    tipo: "valores",
    imagen: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.5",
    titulo: "Sostenibilidad",
    texto: "Nos comprometemos a operar de manera sostenible, minimizando nuestro impacto ambiental y contribuyendo positivamente al bienestar social y económico.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  }
];
export const team = [
  {
    id: 1,
    nombre: "Dr. Carlos Mendoza",
    role: "Profesor de Matemáticas",
    bio: "Doctor en Matemáticas Aplicadas con 15 años de experiencia en educación superior.",
    foto: "/placeholder.svg?height=300&width=300",
    email: " juan.perez@universidad.edu",
    oficina: "Edificio de Ciencias, Sala 305",
    formacion: [
      "Doctorado en Ciencias Computacionales; Universidad Nacional, 2010-2014",
      "Maestría en Inteligencia Artificial; Universidad Tecnológica, 2008-2010",
      "Licenciatura en Ingeniería Informática, Universidad Estatal, 2004-2008"
    ],
    publicaciones: [
      "Avances en Algoritmos de Aprendizaje Profundo, Revista de IA, 2022",
      "Optimización de Redes Neuronales para Procesamiento de Lenguaje Natural, Conferencia Internacional de Computación, 2020",
      "Métodos Eficientes para Análisis de Grandes Volúmenes de Datos, Journal of Data Science, 2018"
    ]
  },
]
//Investigacion
/////Proyectos 
// Datos de ejemplo
export const proyectos: Proyecto[] = [
  {
    ID: 101,
    nombre: "Sistema de Evaluación UX para Apps de Salud",
    tipo_estudio: "Investigación UX en Salud Digital",
    imagen: "/placeholder.svg",
    descripcion: "Desarrollo de un framework para evaluar experiencia de usuario en aplicaciones de telemedicina",
    fecha_inicio: "2024-03-15",
    fecha_fin: "2024-09-30",
    progreso: 35,
    estado: "en_progreso",
    fecha_creacion: "2024-01-10",
    fecha_actualizacion: "2024-05-20",
    proyecto_areas_investigacion: [
      { ID_proyecto: 101, ID_area: 12 }, // Salud Digital
      { ID_proyecto: 101, ID_area: 3 }   // UX Research
    ],
    proyecto_colaboradores: [
      { 
        ID_proyecto: 101, 
        ID_usuario: 15,
        rol: "Líder de Investigación",
        nombre_externo: undefined,
        email_externo: undefined,
        institucion_externa: undefined
      },
      {
        ID_proyecto: 101,
        nombre_externo: "Dra. Valeria Campos",
        email_externo: "v.campos@hospital.org",
        institucion_externa: "Hospital Central",
        rol: "Asesora Médica"
      }
    ]
  },
  {
    ID: 102,
    nombre: "Analítica de Comportamiento en Plataformas Educativas",
    tipo_estudio: "Estudio de Analytics",
    imagen: "/placeholder.svg",
    descripcion: "Recolección y análisis de datos de interacción en LMS para mejorar engagement",
    fecha_inicio: "2024-01-10",
    fecha_fin: "2024-12-15",
    progreso: 60,
    estado: "en_progreso",
    fecha_creacion: "2023-11-20",
    fecha_actualizacion: "2024-06-10",
    proyecto_areas_investigacion: [
      { ID_proyecto: 102, ID_area: 7 },  // Educación
      { ID_proyecto: 102, ID_area: 9 },  // Analítica Web
      { ID_proyecto: 102, ID_area: 4 }   // Machine Learning
    ],
    proyecto_colaboradores: [
      {
        ID_proyecto: 102,
        ID_usuario: 22,
        rol: "Data Scientist"
      },
      {
        ID_proyecto: 102,
        ID_usuario: 8,
        rol: "UX Analyst"
      }
    ]
  },
  {
    ID: 103,
    nombre: "Guía de Accesibilidad para Fintech 2024",
    tipo_estudio: "Benchmark de Accesibilidad",
    descripcion: "Estudio comparativo de componentes accesibles en apps financieras",
    fecha_inicio: "2024-06-01",
    fecha_fin: "2024-08-30",
    progreso: 10,
    estado: "planificacion",
    fecha_creacion: "2024-04-15",
    fecha_actualizacion: "2024-05-28",
    proyecto_areas_investigacion: [
      { ID_proyecto: 103, ID_area: 5 },  // Fintech
      { ID_proyecto: 103, ID_area: 2 }   // Accesibilidad
    ],
    proyecto_colaboradores: [
      {
        ID_proyecto: 103,
        ID_usuario: 3,
        rol: "Especialista en Accesibilidad"
      },
      {
        ID_proyecto: 103,
        nombre_externo: "Lic. Omar Fernández",
        email_externo: "o.fernandez@fintech-advisors.com",
        institucion_externa: "Fintech Advisors",
        rol: "Consultor Sectorial"
      }
    ]
  },
  {
    ID: 104,
    nombre: "Impacto de IA Generativa en Diseño de Interfaces",
    tipo_estudio: "Investigación Experimental",
    imagen: "/placeholder.svg",
    descripcion: "Evaluación de herramientas como Figma AI y Galileo AI en flujos de diseño",
    fecha_inicio: "2023-09-01",
    fecha_fin: "2024-02-28",
    progreso: 100,
    estado: "completado",
    fecha_creacion: "2023-07-10",
    fecha_actualizacion: "2024-03-05",
    proyecto_areas_investigacion: [
      { ID_proyecto: 104, ID_area: 11 }, // IA
      { ID_proyecto: 104, ID_area: 1 }   // UI Design
    ],
    proyecto_colaboradores: [
      {
        ID_proyecto: 104,
        ID_usuario: 7,
        rol: "Investigador Principal"
      },
      {
        ID_proyecto: 104,
        ID_usuario: 12,
        rol: "Diseñador UI"
      },
      {
        ID_proyecto: 104,
        nombre_externo: "Dr. Alan Turing",
        email_externo: "investigacion@ai-lab.edu",
        institucion_externa: "AI Research Lab",
        rol: "Asesor Científico"
      }
    ]
  },
  {
    ID: 105,
    nombre: "Sistema de Design Tokens para Gobierno",
    tipo_estudio: "Desarrollo de Sistema de Diseño",
    descripcion: "Creación de biblioteca de tokens para estandarizar interfaces en portales públicos",
    fecha_inicio: "2024-04-01",
    fecha_fin: "2024-11-30",
    progreso: 45,
    estado: "en_progreso",
    fecha_creacion: "2024-02-18",
    fecha_actualizacion: "2024-06-15",
    proyecto_areas_investigacion: [
      { ID_proyecto: 105, ID_area: 8 },  // Gobierno Digital
      { ID_proyecto: 105, ID_area: 6 }   // Sistemas de Diseño
    ],
    proyecto_colaboradores: [
      {
        ID_proyecto: 105,
        ID_usuario: 9,
        rol: "Design Systems Lead"
      },
      {
        ID_proyecto: 105,
        ID_usuario: 17,
        rol: "Frontend Architect"
      }
    ]
  }
];
//metodologias 
// Datos de ejemplo - Metodologías
export const metodologias = [
  {
    nombre: "Investigación Cualitativa",
    descripcion:
      "Enfoque que busca comprender en profundidad las experiencias, comportamientos y percepciones de los usuarios a través de métodos como entrevistas, grupos focales y observación.",
    aplicaciones: [
      "Entrevistas a usuarios",
      "Grupos focales",
      "Estudios observacionales",
      "Análisis de diarios de usuario",
    ],
  },
  {
    nombre: "Investigación Cuantitativa",
    descripcion:
      "Metodología basada en la recolección y análisis de datos numéricos para identificar patrones, tendencias y correlaciones en el comportamiento del usuario.",
    aplicaciones: [
      "Encuestas a gran escala",
      "Análisis de métricas de uso",
      "Tests A/B",
      "Análisis estadístico de comportamiento",
    ],
  },
  {
    nombre: "Diseño Centrado en el Usuario (DCU)",
    descripcion:
      "Proceso iterativo que coloca al usuario final en el centro de cada etapa del diseño, desde la conceptualización hasta la implementación.",
    aplicaciones: [
      "Creación de personas y escenarios",
      "Prototipado iterativo",
      "Evaluación continua con usuarios reales",
      "Diseño participativo",
    ],
  },
  {
    nombre: "Design Thinking",
    descripcion:
      "Enfoque de resolución de problemas centrado en el humano que integra las necesidades de las personas, las posibilidades tecnológicas y los requisitos para el éxito empresarial.",
    aplicaciones: [
      "Talleres de ideación",
      "Prototipado rápido",
      "Empatía con el usuario",
      "Definición de problemas complejos",
    ],
  },
  {
    nombre: "Lean UX",
    descripcion:
      "Metodología que aplica principios de Lean Startup al diseño de experiencia de usuario, enfocándose en ciclos rápidos de aprendizaje y validación.",
    aplicaciones: [
      "Creación de MVP (Producto Mínimo Viable)",
      "Validación temprana de conceptos",
      "Iteraciones rápidas basadas en feedback",
      "Reducción de documentación innecesaria",
    ],
  },
  {
    nombre: "Investigación Contextual",
    descripcion:
      "Método de investigación cualitativa que estudia a los usuarios en su entorno natural mientras realizan tareas reales.",
    aplicaciones: [
      "Observación en el contexto de uso",
      "Entrevistas en el lugar de trabajo",
      "Análisis de flujos de trabajo reales",
      "Identificación de necesidades no articuladas",
    ],
  },
  {
    nombre: "Análisis Competitivo",
    descripcion:
      "Evaluación sistemática de productos o servicios competidores para identificar fortalezas, debilidades y oportunidades de diferenciación.",
    aplicaciones: [
      "Benchmarking de características",
      "Análisis de experiencia de usuario de competidores",
      "Identificación de brechas en el mercado",
      "Inspiración para innovación",
    ],
  },
]
export const tiposPruebas = [
  {
    nombre: "Pruebas de Usabilidad en Laboratorio",
    descripcion:
      "Las pruebas de usabilidad en laboratorio son evaluaciones controladas donde los usuarios realizan tareas específicas mientras los investigadores observan y registran su comportamiento.",
    caracteristicas: [
      "Entorno controlado para minimizar distracciones",
      "Equipamiento especializado como eye-trackers",
      "Posibilidad de grabar sesiones para análisis posterior",
      "Moderador presente para guiar la sesión",
    ],
    imagen: "/placeholder.svg?height=300&width=600",
  },
  {
    nombre: "Pruebas Remotas No Moderadas",
    descripcion:
      "Las pruebas remotas no moderadas permiten a los usuarios completar tareas en su propio entorno sin la presencia de un moderador, lo que proporciona resultados más naturales.",
    caracteristicas: [
      "Mayor alcance geográfico de participantes",
      "Costos reducidos de implementación",
      "Entorno natural del usuario",
      "Posibilidad de realizar pruebas asincrónicas",
    ],
    imagen: "/placeholder.svg?height=300&width=600",
  },
  {
    nombre: "Pruebas A/B",
    descripcion:
      "Las pruebas A/B comparan dos versiones de una página o elemento para determinar cuál tiene mejor rendimiento en términos de conversión u otros objetivos.",
    caracteristicas: [
      "Basadas en datos cuantitativos",
      "Ideal para optimizar elementos específicos",
      "Requiere tráfico suficiente para obtener resultados estadísticamente significativos",
      "Permite iteraciones rápidas basadas en resultados",
    ],
    imagen: "/placeholder.svg?height=300&width=600",
  },
  {
    nombre: "Evaluación Heurística",
    descripcion:
      "La evaluación heurística es un método donde expertos en usabilidad evalúan una interfaz según principios establecidos para identificar problemas potenciales.",
    caracteristicas: [
      "No requiere participación de usuarios finales",
      "Rápida implementación y resultados",
      "Basada en principios y mejores prácticas establecidas",
      "Complementa bien otras metodologías de prueba",
    ],
    imagen: "/placeholder.svg?height=300&width=600",
  },
]
//glosario 

// Datos de ejemplo
  export const terminos: Glosario[] = [
    {
      ID: 1,
      termino: "Accesibilidad",
      descripcion:
        "Grado en que un producto, dispositivo, servicio o entorno está disponible para todos los usuarios, independientemente de sus capacidades o limitaciones.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 2,
      termino: "Arquitectura de Información",
      descripcion:
        "Estructura y organización de contenidos en un sitio web o aplicación para facilitar la navegación y comprensión por parte del usuario.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 3,
      termino: "Affordance",
      descripcion:
        "Cualidad de un objeto o entorno que permite a un individuo realizar una acción. En diseño, se refiere a cómo los elementos comunican su función.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 4,
      termino: "Consistencia",
      descripcion:
        "Principio de diseño que busca mantener patrones similares en elementos, comportamientos y estilos a lo largo de una interfaz para facilitar el aprendizaje y uso.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 5,
      termino: "Diseño Responsivo",
      descripcion:
        "Enfoque de diseño que busca que las páginas web se adapten al tamaño de pantalla y dispositivo en que se visualizan.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 6,
      termino: "Experiencia de Usuario (UX)",
      descripcion:
        "Conjunto de factores y elementos relativos a la interacción del usuario con un entorno o dispositivo, generando una percepción positiva o negativa.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 7,
      termino: "Interfaz de Usuario (UI)",
      descripcion:
        "Medio con que el usuario puede comunicarse con una máquina, equipo o computadora, y comprende todos los puntos de contacto entre el usuario y el equipo.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 8,
      termino: "Mapa de Calor (Heatmap)",
      descripcion:
        "Representación gráfica de datos donde los valores individuales están representados por colores, mostrando áreas de mayor interacción o atención.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 9,
      termino: "Navegabilidad",
      descripcion:
        "Facilidad con que un usuario puede desplazarse por todas las páginas que componen un sitio web y ubicarse dentro de él.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 10,
      termino: "Persona",
      descripcion:
        "Representación ficticia de un usuario ideal basada en datos reales y comportamientos observados, utilizada como guía en el proceso de diseño.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 11,
      termino: "Prototipo",
      descripcion:
        "Modelo preliminar de un producto que permite probar conceptos y procesos antes de invertir en el desarrollo completo.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
    {
      ID: 12,
      termino: "Test A/B",
      descripcion:
        "Método de comparación donde dos versiones de una página o elemento se muestran a diferentes usuarios para determinar cuál tiene mejor rendimiento.",
      fecha_creacion: undefined,
      ID_usuario: undefined,
    },
  ];
//difusion
export const eventos: EventoNoticia[] = [
  {
    ID: 1,
    titulo: "Conferencia de Inteligencia Artificial",
    descripcion: "Evento anual sobre los últimos avances en IA y machine learning",
    fecha: "2023-11-15T18:00:00",
    lugar: "Auditorio Principal, Campus Central",
    tipo: "evento",
    imagen: "/placeholder.svg",
    materiales: "Presentaciones, Códigos de ejemplo",
    fecha_creacion: "2023-09-10T10:30:00",
    ID_usuario: 5,
    asistentes: [
      {
        ID_evento: 1,
        ID_usuario: 10,
        nombre_externo: undefined,
        email_externo: undefined,
        institucion_externa: undefined
      },
      {
        ID_evento: 1,
        ID_usuario: undefined,
        nombre_externo: "María González",
        email_externo: "maria.gonzalez@externo.com",
        institucion_externa: "Universidad Nacional"
      }
    ],
    areas_investigacion: [
      { ID_evento: 1, ID_area: 3 },
      { ID_evento: 1, ID_area: 7 }
    ]
  },
  {
    ID: 2,
    titulo: "Taller de Desarrollo Web Moderno",
    descripcion: "Taller práctico sobre React, Next.js y TypeScript",
    fecha: "2023-12-05T16:00:00",
    lugar: "Laboratorio de Computación 3",
    tipo: "evento",
    imagen: "/placeholder.svg",
    fecha_creacion: "2023-10-20T14:15:00",
    ID_usuario: 8,
    asistentes: [
      {
        ID_evento: 2,
        ID_usuario: 12,
        nombre_externo: undefined,
        email_externo: undefined,
        institucion_externa: undefined
      }
    ],
    areas_investigacion: [
      { ID_evento: 2, ID_area: 5 }
    ]
  },
  {
    ID: 3,
    titulo: "Hackathon de Innovación Tecnológica",
    descripcion: "Competencia de desarrollo de soluciones tecnológicas en 48 horas",
    fecha: "2024-02-20T09:00:00",
    lugar: "Centro de Innovación",
    tipo: "evento",
    imagen: "/placeholder.svg",
    materiales: "Guía del participante, APIs disponibles",
    fecha_creacion: "2023-11-01T11:20:00",
    ID_usuario: 3,
    asistentes: [
      {
        ID_evento: 3,
        ID_usuario: 15,
        nombre_externo: undefined,
        email_externo: undefined,
        institucion_externa: undefined
      },
      {
        ID_evento: 3,
        ID_usuario: undefined,
        nombre_externo: "Carlos Mendoza",
        email_externo: "carlos.mendoza@otrauni.edu",
        institucion_externa: "Instituto Tecnológico"
      },
      {
        ID_evento: 3,
        ID_usuario: undefined,
        nombre_externo: "Ana Lucía Ramírez",
        email_externo: "a.ramirez@empresa.com",
        institucion_externa: "Tech Solutions Inc."
      }
    ],
    areas_investigacion: [
      { ID_evento: 3, ID_area: 2 },
      { ID_evento: 3, ID_area: 4 },
      { ID_evento: 3, ID_area: 8 }
    ]
  }
];
export const noticias: EventoNoticia[] = [
  {
    ID: 4,
    titulo: "Investigadora gana premio internacional",
    descripcion: "La Dra. Laura Sánchez recibió el premio por su trabajo en nanotecnología",
    fecha: "2023-10-05T00:00:00",
    tipo: "noticia",
    imagen: "/placeholder.svg",
    fecha_creacion: "2023-10-06T08:45:00",
    ID_usuario: 2,
    areas_investigacion: [
      { ID_evento: 4, ID_area: 6 }
    ]
  },
  {
    ID: 5,
    titulo: "Nuevo laboratorio de robótica inaugurado",
    descripcion: "El centro cuenta ahora con equipos de última generación para investigación en robótica",
    tipo: "noticia",
    imagen: "/placeholder.svg",
    fecha_creacion: "2023-09-15T16:30:00",
    ID_usuario: 7
  },
  {
    ID: 6,
    titulo: "Convenio con empresa líder en tecnología",
    descripcion: "Se firmó un acuerdo de colaboración para investigación conjunta y prácticas profesionales",
    fecha: "2023-11-01T00:00:00",
    tipo: "noticia",
    fecha_creacion: "2023-11-02T09:10:00",
    ID_usuario: 4,
    areas_investigacion: [
      { ID_evento: 6, ID_area: 1 },
      { ID_evento: 6, ID_area: 9 }
    ]
  }
];
export const proximosEventos: EventoNoticia[] = [
  {
    ID: 7,
    titulo: "Congreso Internacional de Ciencias de Datos 2024",
    descripcion: "Evento que reunirá a los principales expertos mundiales en ciencia de datos",
    fecha: "2024-05-20T09:00:00",
    lugar: "Centro de Convenciones",
    tipo: "proximo_evento",
    imagen: "/placeholder.svg",
    fecha_creacion: "2023-10-25T11:20:00",
    ID_usuario: 6,
    asistentes: [
      {
        ID_evento: 7,
        ID_usuario: 9,
        nombre_externo: undefined,
        email_externo: undefined,
        institucion_externa: undefined
      }
    ],
    areas_investigacion: [
      { ID_evento: 7, ID_area: 3 },
      { ID_evento: 7, ID_area: 10 }
    ]
  },
  {
    ID: 8,
    titulo: "Seminario de Ciberseguridad Avanzada",
    descripcion: "Seminario especializado para profesionales de seguridad informática",
    fecha: "2024-03-15T14:00:00",
    lugar: "Aula Magna",
    tipo: "proximo_evento",
    imagen: "/placeholder.svg",
    materiales: "Requisitos: Traer computadora portátil",
    fecha_creacion: "2023-11-05T10:15:00",
    ID_usuario: 1
  },
  {
    ID: 9,
    titulo: "Feria de Empleo Tecnológico",
    descripcion: "Las principales empresas del sector buscarán talento entre nuestros estudiantes",
    fecha: "2024-04-10T10:00:00",
    lugar: "Plaza Central del Campus",
    tipo: "proximo_evento",
    fecha_creacion: "2023-10-30T13:40:00",
    ID_usuario: 11,
    asistentes: [
      {
        ID_evento: 9,
        ID_usuario: undefined,
        nombre_externo: "Roberto Jiménez",
        email_externo: "r.jimenez@recursoshumanos.com",
        institucion_externa: "TechCorp International"
      },
      {
        ID_evento: 9,
        ID_usuario: undefined,
        nombre_externo: "Sofía Hernández",
        email_externo: "s.hernandez@talento.digital",
        institucion_externa: "Digital Talent Agency"
      }
    ]
  }
];
//support
export const preguntasFrecuentes = [
  { 
    id: 1,
    pregunta: "¿Cómo puedo crear una cuenta?",
    respuesta: " Para crear una cuenta, haz clic en el botón Registrarse en la esquina superior derecha de nuestra página principal. Completa el formulario con tu información personal y sigue las instrucciones para verificar tu correo electrónico."
  },
  {
    id: 2,
    pregunta: "¿Cómo puedo restablecer mi contraseña?",
    respuesta: "Si has olvidado tu contraseña, haz clic en '¿Olvidaste tu contraseña?' en la página de inicio de sesión. Ingresa tu correo electrónico y recibirás un enlace para restablecer tu contraseña."
  },
  {
    id:3,
    pregunta: "¿Cuáles son los requisitos técnicos para usar la plataforma?",
    respuesta: "Nuestra plataforma es compatible con los navegadores más recientes como Chrome, Firefox, Safari y Edge. Recomendamos tener una conexión a internet estable y un dispositivo con al menos 4GB de RAM para una mejor experiencia."
  },
  {
    id: 4,
    pregunta: "¿Cómo puedo contactar al soporte técnico?",
    respuesta: "Puedes contactar a nuestro equipo de soporte técnico enviando un correo a"
  },
  {
    id: 5,
    pregunta: "¿Cómo puedo actualizar mi información de perfil?",
    respuesta: "Para actualizar tu información de perfil, inicia sesión en tu cuenta y ve a la sección 'Mi Perfil'. Allí podrás editar tu nombre, correo electrónico, foto de perfil y otros detalles. Asegúrate de guardar los cambios antes de salir."
  }
]
//guias 
export const guides = [
    {
      id: "usabilidad",
      title: "Cómo participar en una prueba de usabilidad",
      description: "Aprende los pasos para participar efectivamente en nuestras pruebas de usabilidad.",
      summary:"Esta guía te mostrará cómo prepararte para una prueba de usabilidad, qué esperar durante la sesión y cómo proporcionar retroalimentación valiosa.",
      titleTwo: "Preparación para la prueba",
      descriptionTwo: "Antes de participar en una prueba de usabilidad, es importante que te familiarices con el propósito general de la sesión. No necesitas tener conocimientos previos sobre el producto que vas a probar, ya que el objetivo es evaluar la facilidad de uso para nuevos usuarios.",
      titleThree: "Durante la sesión",
      descriptionThree: "Durante la prueba, se te pedirá que completes una serie de tareas mientras expresas en voz alta tus pensamientos. Esto nos ayuda a entender tu proceso mental mientras interactúas con el producto. Recuerda que estamos evaluando el producto, no a ti, así que no hay respuestas incorrectas.",
      titleFour: "Tipos de pruebas de usabilidad",
      steps: {
        step1: "Pruebas moderadas: Un facilitador te guiará a través del proceso y podrá responder preguntas.",
        step2: "Pruebas no moderadas: Completarás las tareas por tu cuenta siguiendo instrucciones escritas.",
        step3: "Pruebas remotas: Participarás desde tu ubicación a través de software de videoconferencia.",
        step4: "Pruebas presenciales: Asistirás a nuestro laboratorio de usabilidad para la sesión.",
      },
      titleFive:"Después de la prueba",
      descriptionFive: "Una vez finalizada la prueba, tendrás la oportunidad de proporcionar comentarios adicionales sobre tu experiencia. Tu retroalimentación es crucial para ayudarnos a mejorar el producto.",
    },
    {
      id: "evaluacion-ux",
      title: "Cómo realizar una evaluación UX",
      description: "Guía completa para realizar evaluaciones de experiencia de usuario efectivas.",
      summary: "Aprende metodologías, herramientas y mejores prácticas para evaluar la experiencia de usuario de un producto o servicio digital.",
      titleTwo: "Planificación de la evaluación",
      descriptionTwo: "Antes de comenzar, define claramente los objetivos de tu evaluación UX. ¿Qué aspectos específicos del producto quieres evaluar? ¿Estás buscando problemas generales de usabilidad o te enfocas en flujos de usuario específicos?",
      titleThree: "Métodos de evaluación",
      steps: {
        step1: "Evaluación heurística: Análisis basado en principios establecidos de usabilidad.",
        step2: "Recorrido cognitivo: Simular el proceso mental de los usuarios al completar tareas.",
        step3: "Pruebas de usabilidad: Observar a usuarios reales interactuando con el producto.",
        step4: "Análisis de datos: Examinar métricas de uso para identificar patrones y problemas."
      },
      titleFour: "Herramientas recomendadas",
      descriptionFour: "Dependiendo del método elegido, puedes utilizar herramientas como Hotjar para mapas de calor, Lookback para pruebas de usabilidad remotas, o Google Analytics para análisis de datos.",
      titleFive: "Documentación y presentación",
      descriptionFive: "Documenta tus hallazgos de manera clara y organizada. Prioriza los problemas según su impacto en la experiencia del usuario y la dificultad de implementación. Presenta recomendaciones concretas para abordar cada problema identificado."
    },
    {
      id: "investigacion",
      title: "Introducción a la investigación de usuarios",
      description: "Conceptos básicos para comenzar con la investigación de usuarios.",
      summary: "Descubre cómo planificar, conducir y analizar investigaciones de usuarios para mejorar tus productos digitales.",
      titleTwo: "¿Por qué investigar a los usuarios?",
      descriptionTwo: "La investigación de usuarios te permite comprender las necesidades, comportamientos y motivaciones de tus usuarios. Esto te ayuda a tomar decisiones de diseño basadas en datos reales en lugar de suposiciones.",
      titleThree: "Métodos de investigación",
      steps: {
        step1: "Entrevistas: Conversaciones uno a uno para comprender en profundidad las experiencias y opiniones.",
        step2: "Encuestas: Recopilación de datos a gran escala para identificar tendencias y patrones.",
        step3: "Estudios de campo: Observación de usuarios en su entorno natural.",
        step4: "Pruebas de usabilidad: Evaluación de la facilidad de uso de un producto.",
        step5: "Card sorting: Método para entender cómo los usuarios organizan y categorizan la información."
      },
      titleFour: "Planificación de la investigación",
      descriptionFour: "Define claramente tus objetivos de investigación y las preguntas que quieres responder. Selecciona los métodos más adecuados según tus recursos y necesidades. Recluta participantes que representen a tu público objetivo.",
      titleFive: "Análisis y aplicación",
      descriptionFive: "Analiza los datos recopilados para identificar patrones y hallazgos clave. Traduce estos hallazgos en recomendaciones accionables para el diseño y desarrollo del producto."
    },
    {
      id: "principios-diseno",
      title: "Principios de diseño centrado en el usuario",
      description: "Fundamentos del diseño UX centrado en las necesidades del usuario.",
      summary: "Aprende los principios clave que guían el diseño centrado en el usuario y cómo aplicarlos en tus proyectos.",
      titleTwo: "Empatía con el usuario",
      descriptionTwo: "El diseño centrado en el usuario comienza con la empatía. Debes comprender profundamente las necesidades, objetivos, frustraciones y contextos de uso de tus usuarios para crear soluciones que realmente les sirvan.",
      titleThree: "Principios fundamentales",
      steps: {
        step1: "Visibilidad: Los usuarios deben poder ver claramente qué acciones están disponibles.",
        step2: "Retroalimentación: Las acciones deben proporcionar respuestas claras e inmediatas.",
        step3: "Consistencia: Los elementos similares deben funcionar de manera similar.",
        step4: "Prevención de errores: Diseñar para minimizar errores y facilitar su recuperación.",
        step5: "Reconocimiento sobre recuerdo: Hacer visible la información relevante en lugar de obligar al usuario a recordarla.",
        step6: "Flexibilidad y eficiencia: Permitir que tanto novatos como expertos utilicen el sistema eficientemente."
      },
      titleFour: "Proceso iterativo",
      descriptionFour: "El diseño centrado en el usuario es un proceso iterativo que implica investigación, diseño, pruebas y refinamiento continuo basado en la retroalimentación de los usuarios.",
      titleFive: "Inclusividad y accesibilidad",
      descriptionFive: "Un buen diseño centrado en el usuario considera la diversidad de capacidades, contextos y necesidades de todos los posibles usuarios, incluyendo aquellos con discapacidades."
    },
    {
      id: "prototipos",
      title: "Creación de prototipos efectivos",
      description: "Técnicas para crear prototipos que comuniquen claramente tus ideas de diseño.",
      summary: "Esta guía cubre diferentes niveles de fidelidad, herramientas de prototipado y consejos para crear prototipos efectivos.",
      titleTwo: "Niveles de fidelidad",
      descriptionTwo: "Los prototipos pueden variar desde bocetos simples en papel (baja fidelidad) hasta versiones interactivas detalladas que se asemejan al producto final (alta fidelidad). El nivel adecuado depende de la etapa del proyecto y el propósito del prototipo.",
      tittleThree: "Tipos de prototipos",
      steps: {
        step1: "Prototipos en papel: Rápidos y económicos, ideales para las primeras etapas de ideación.",
        step2: "Wireframes: Representaciones esquemáticas que muestran la estructura y jerarquía del contenido.",
        step3: "Prototipos clickeables: Permiten la interacción básica para probar flujos de navegación.",
        step4: "Prototipos de alta fidelidad: Representan con precisión el aspecto visual y la interactividad del producto final."
      },
      titleFour: "Herramientas recomendadas",
      descriptionFour: "Existen numerosas herramientas para crear prototipos, como Figma, Adobe XD, Sketch, InVision y Axure. La elección depende de tus necesidades específicas y preferencias personales.",
      titleFive: "Mejores prácticas",
      descriptionFive: "Mantén el enfoque en los objetivos del prototipo. No intentes resolver todos los problemas a la vez. Itera rápidamente basándote en la retroalimentación. Recuerda que el propósito del prototipo es probar ideas, no crear un producto perfecto."
    },
    
  ]
  export const contacto = {
    campos:[
      {
        nombre: "Nombre",
        tipo: "text",
        requerido: true,
        placeholder: "Ingresa tu nombre completo",
      },
      {
        nombre: "Correo Electrónico",
        tipo: "email",
        requerido: true,
        placeholder: "Ingresa tu correo electrónico",
      },
      {
        nombre: "Asunto",
        tipo: "text",
        requerido: true,
        placeholder: "Escribe el asunto de tu mensaje",
      },
      {
        nombre: "Mensaje",
        tipo: "textarea",
        requerido: true,
        placeholder: "Escribe tu mensaje aquí",
      },
    ],
    datos :
    {
      email: "labUX@unca.edu.mx",
      horario: "Lunes a Viernes de 9:00 a 17:00",
      redes: [
        {
          nombre: "Facebook",
          url: "https://www.facebook.com/labUXUNCA",
          icono: "facebook-icon.svg",
        },
        {
          nombre: "Twitter",
          url: "https://twitter.com/labUXUNCA",
          icono: "twitter-icon.svg",
        },
        {
          nombre: "Instagram",
          url: "https://www.instagram.com/labUXUNCA",
          icono: "instagram-icon.svg",
        },
      ]
    }
  }