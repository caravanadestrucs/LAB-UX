// TEMPORAL demo pública (NO usar en admin): fallback solo si el backend no responde.
// Cuando el backend vuelva, estos datos se reemplazan por fetch real.
export const TEMPORAL_DEMO = true;
export const DEMO_BADGE = "Datos de demostración — backend no disponible";

import { Evento, Proyecto, ContenidoSitio, Valor, Glosario, User, MetodologiaPrueba, PreguntaFrecuente, GuiaTutorial } from "@/types";
// Datos de ejemplo para el carrusel
export const slides: ContenidoSitio[] = [
    {
      ID: 1,
      tipo:"banner",
      titulo: "Investigación UX en la UNCA",
      texto: "Descubrí cómo evaluamos la usabilidad con usuarios reales en Catamarca",
      imagen: "bg-secondary/90",
      estado: "activo",
      fecha_creacion: "2024-01-01",
    },
    {
      ID: 2,
      tipo: "banner",
      titulo: "Formación en usabilidad",
      texto: "Talleres y pruebas abiertas para estudiantes y equipos de la UNCA",
      imagen: "bg-secondary/90",
      estado: "activo",
      fecha_creacion: "2024-01-01",
    },
    {
      ID: 3,
      tipo:"banner",
      titulo: "Transferencia a la comunidad",
      texto: "Acompañamos a organismos y pymes de Catamarca con evidencia de uso",
      imagen: "bg-accent/90",
      estado: "activo",
      fecha_creacion: "2024-01-01",
    },
  ]

export const Mision: ContenidoSitio ={
    ID: 1,
    tipo: "mision",
    titulo: "Nuestra Misión",
    texto: "Investigar la experiencia de uso con usuarios reales, formar estudiantes y equipos de la UNCA en métodos de usabilidad y transferir evidencia práctica a organismos y pymes de Catamarca.",
    imagen: "/placeholder.svg?height=400&width=600",
    estado: "activo",
    fecha_creacion: "2024-01-01",
}
export const Vision: ContenidoSitio = {
    ID: 2,
    tipo: "vision",
    titulo: "Nuestra Visión",
    texto: "Ser el laboratorio de referencia en usabilidad del NOA: investigación abierta con la UNCA, formación continua y diseños centrados en las personas de Catamarca.",
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
    texto: "Investigamos con honestidad y ética: datos reales de uso, consentimiento informado y resultados abiertos para la UNCA.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 2,
    tipo: "valores",
    imagen: "M13 10V3L4 14h7v7l9-11h-7z",
    titulo: "Innovación",
    texto: "Probamos ideas con usuarios de Catamarca en ciclos cortos: observar, prototipar y volver a probar.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 3,
    tipo: "valores",
    imagen: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    titulo: "Colaboración",
    texto: "Estudiantes, docentes y comunidad trabajan juntos en cada test: todas las miradas suman evidencia.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 4,
    tipo: "valores",
    imagen: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    titulo: "Excelencia",
    texto: "Rigor en cada sesión: guion, métricas claras y devolución útil para quien participa.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 5,
    tipo: "valores",
    imagen: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    titulo: "Responsabilidad",
    texto: "Cuidamos tus datos y tu tiempo: sesiones breves, aviso previo y resultados compartidos.",
    fecha_creacion: "2024-01-01",
    estado: "activo"
  },
  {
    ID: 6,
    tipo: "valores",
    imagen: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.5",
    titulo: "Sostenibilidad",
    texto: "Conocimiento abierto para Catamarca: guías y hallazgos que quedan en la UNCA.",
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
    email: "equipo.labux@unca.edu.ar",
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
export const proyectos = [
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
export const eventos = [
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
export const noticias = [
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
export const proximosEventos = [
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
      email: "lab-ux@unca.edu.ar",
      horario: "Lunes a Viernes de 9:00 a 17:00",
      redes: [
        {
          nombre: "Sitio UNCA",
          url: "https://www.unca.edu.ar/",
          icono: "globe-icon.svg",
        },
      ]
    }
  }

// ── TEMPORAL público (shape NUEVO de types, sin divergencias viejas) ──
export const bannersTEMPORAL: ContenidoSitio[] = slides;

export const equipoTEMPORAL: User[] = [
  {
    ID: 901,
    correo: "docente.unca@unca.edu.ar",
    password: "",
    nombre: "Docente",
    apellido: "UNCA",
    tipo_usuario: "profesor",
    estado: "activo",
    avatar: "/placeholder.svg",
    areas_investigacion: [
      { ID: 1, nombre: "Usabilidad", ID_usuario: 901, ID_area: 1, area_nombre: "Usabilidad" },
    ],
    formacion_academica: [
      { ID: 1, ID_usuario: 901, institucion: "UNCA — Catamarca", titulo: "Docente investigadora" },
    ],
  },
  {
    ID: 902,
    correo: "equipo.unca@unca.edu.ar",
    password: "",
    nombre: "Equipo",
    apellido: "Lab",
    tipo_usuario: "admin",
    estado: "activo",
    avatar: "/placeholder.svg",
    areas_investigacion: [
      { ID: 2, nombre: "Investigación UX", ID_usuario: 902, ID_area: 2, area_nombre: "Investigación UX" },
    ],
    formacion_academica: [
      { ID: 2, ID_usuario: 902, institucion: "UNCA — Catamarca", titulo: "Coordinación de tests" },
    ],
  },
  {
    ID: 903,
    correo: "alumno.unca@unca.edu.ar",
    password: "",
    nombre: "Estudiante",
    apellido: "UNCA",
    tipo_usuario: "alumno",
    estado: "activo",
    avatar: "/placeholder.svg",
    areas_investigacion: [
      { ID: 3, nombre: "Accesibilidad", ID_usuario: 903, ID_area: 3, area_nombre: "Accesibilidad" },
    ],
    formacion_academica: [
      { ID: 3, ID_usuario: 903, institucion: "UNCA — Catamarca", titulo: "Tester en formación" },
    ],
  },
];

export const proyectosTEMPORAL: Proyecto[] = [
  {
    ID: 901,
    nombre: "Usabilidad de trámites UNCA",
    tipo_estudio: "Test con usuarios",
    imagen: "/placeholder.svg",
    descripcion: "Evaluamos con estudiantes el trámite de inscripción para simplificarlo.",
    fecha_inicio: "2026-01-15",
    fecha_fin: "2026-06-30",
    progreso: 40,
    estado: "en_progreso",
    fecha_creacion: "2026-01-10",
    fecha_actualizacion: "2026-01-10",
    areas_investigacion: [{ ID_area: 1, area_nombre: "Usabilidad" }],
    colaboradores: [{ ID_usuario: 901, nombre: "Docente", apellido: "UNCA" }],
  },
  {
    ID: 902,
    nombre: "Accesibilidad en aulas virtuales",
    tipo_estudio: "Heurísticas + lectores",
    imagen: "/placeholder.svg",
    descripcion: "Revisamos contraste, foco y navegación por teclado en el campus virtual.",
    fecha_inicio: "2026-02-01",
    fecha_fin: "2026-07-31",
    progreso: 25,
    estado: "en_progreso",
    fecha_creacion: "2026-02-01",
    fecha_actualizacion: "2026-02-01",
    areas_investigacion: [{ ID_area: 2, area_nombre: "Accesibilidad" }],
    colaboradores: [{ ID_usuario: 902, nombre: "Equipo", apellido: "Lab" }],
  },
  {
    ID: 903,
    nombre: "Lenguaje claro en comunicados",
    tipo_estudio: "Test de comprensión",
    imagen: "/placeholder.svg",
    descripcion: "Probamos avisos de la UNCA con estudiantes para que se entiendan a la primera.",
    fecha_inicio: "2025-09-01",
    fecha_fin: "2025-12-20",
    progreso: 100,
    estado: "completado",
    fecha_creacion: "2025-09-01",
    fecha_actualizacion: "2025-12-20",
    areas_investigacion: [{ ID_area: 3, area_nombre: "Contenidos" }],
    colaboradores: [{ ID_usuario: 903, nombre: "Estudiante", apellido: "UNCA" }],
  },
];

export const metodologiasTEMPORAL: MetodologiaPrueba[] = [
  {
    ID: 901,
    nombre: "Entrevista contextual",
    descripcion: "Conversamos con vos en tu lugar de estudio para entender cómo resolvés un trámite.",
    tipo: "metodologia",
    fecha_creacion: "2026-01-10",
    caracteristicas: [
      { ID: 1, ID_metodologia: 901, caracteristica: "Guion breve de 20 minutos" },
      { ID: 2, ID_metodologia: 901, caracteristica: "Registro con consentimiento" },
    ],
  },
  {
    ID: 902,
    nombre: "Evaluación heurística",
    descripcion: "Revisamos una pantalla con principios de usabilidad antes de testear con usuarios.",
    tipo: "metodologia",
    fecha_creacion: "2026-01-10",
    caracteristicas: [
      { ID: 3, ID_metodologia: 902, caracteristica: "10 principios de Nielsen" },
      { ID: 4, ID_metodologia: 902, caracteristica: "Reporte con severidad" },
    ],
  },
  {
    ID: 903,
    nombre: "Test moderado en laboratorio",
    descripcion: "Te proponemos tareas en el Lab UNCA mientras observamos dónde dudás.",
    tipo: "prueba",
    fecha_creacion: "2026-01-10",
    caracteristicas: [
      { ID: 5, ID_metodologia: 903, caracteristica: "Sesión de 30 minutos" },
      { ID: 6, ID_metodologia: 903, caracteristica: "Pensar en voz alta" },
    ],
  },
  {
    ID: 904,
    nombre: "Test remoto no moderado",
    descripcion: "Participá desde tu casa con instrucciones paso a paso.",
    tipo: "prueba",
    fecha_creacion: "2026-01-10",
    caracteristicas: [
      { ID: 7, ID_metodologia: 904, caracteristica: "Sin instalar nada" },
      { ID: 8, ID_metodologia: 904, caracteristica: "Devolución por correo" },
    ],
  },
];

export const faqsTEMPORAL: PreguntaFrecuente[] = [
  {
    ID: 901,
    pregunta: "¿Qué es el Laboratorio de Usabilidad de la UNCA?",
    respuesta: "Un espacio de la UNCA en Catamarca donde probamos trámites, aulas virtuales y comunicados con usuarios reales.",
    orden: 1,
    fecha_creacion: "2026-01-10",
  },
  {
    ID: 902,
    pregunta: "¿Cómo puedo ser tester?",
    respuesta: "Escribinos a lab-ux@unca.edu.ar con tu carrera e interés. Te avisamos cuando abrimos una sesión.",
    orden: 2,
    fecha_creacion: "2026-01-10",
  },
  {
    ID: 903,
    pregunta: "¿Cuánto dura una sesión?",
    respuesta: "Entre 20 y 40 minutos. Siempre avisamos antes y podés retirarte cuando quieras.",
    orden: 3,
    fecha_creacion: "2026-01-10",
  },
  {
    ID: 904,
    pregunta: "¿Qué pasa con mis datos?",
    respuesta: "Solo usamos tus respuestas para mejorar el diseño. Pedimos consentimiento y nunca publicamos datos personales.",
    orden: 4,
    fecha_creacion: "2026-01-10",
  },
];

export const guiasTEMPORAL: GuiaTutorial[] = [
  {
    ID: 901,
    titulo: "Cómo participar en una prueba",
    descripcion: "Qué esperar antes, durante y después de un test en el Lab UNCA.",
    fecha_publicacion: "2026-01-10",
    ID_usuario: 901,
    categoria: "Participar",
    recursos: [
      { ID: 1, ID_guia: 901, tipo: "pdf", recurso: "guia-participar.pdf", recurso_url: "https://www.unca.edu.ar/guia-participar.pdf", descripcion: "Guía en PDF" },
      { ID: 2, ID_guia: 901, tipo: "link", recurso: "https://www.unca.edu.ar/", recurso_url: "https://www.unca.edu.ar/", descripcion: "Sitio UNCA" },
    ],
    areas_investigacion: [{ ID_area: 1, area_nombre: "Usabilidad" }],
  },
  {
    ID: 902,
    titulo: "Heurísticas en una página",
    descripcion: "Los 10 puntos que revisamos antes de cada test.",
    fecha_publicacion: "2026-01-10",
    ID_usuario: 901,
    categoria: "Métodos",
    recursos: [
      { ID: 3, ID_guia: 902, tipo: "pdf", recurso: "heuristicas.pdf", recurso_url: "https://www.unca.edu.ar/heuristicas.pdf", descripcion: "Checklist PDF" },
    ],
    areas_investigacion: [{ ID_area: 2, area_nombre: "Accesibilidad" }],
  },
  {
    ID: 903,
    titulo: "Consentimiento informado",
    descripcion: "Qué firmás y por qué antes de cada sesión.",
    fecha_publicacion: "2026-01-10",
    ID_usuario: 902,
    categoria: "Ética",
    recursos: [
      { ID: 4, ID_guia: 903, tipo: "pdf", recurso: "consentimiento.pdf", recurso_url: "https://www.unca.edu.ar/consentimiento.pdf", descripcion: "Modelo de consentimiento" },
      { ID: 5, ID_guia: 903, tipo: "link", recurso: "https://www.unca.edu.ar/", recurso_url: "https://www.unca.edu.ar/", descripcion: "Más info UNCA" },
    ],
    areas_investigacion: [{ ID_area: 3, area_nombre: "Ética" }],
  },
];

export const glosarioTEMPORAL: Glosario[] = [
  { ID: 901, termino: "Usabilidad", descripcion: "Qué tan fácil te resulta lograr tu objetivo con un diseño.", fecha_creacion: "2026-01-10" },
  { ID: 902, termino: "Accesibilidad", descripcion: "Que cualquier persona pueda usar el diseño, con o sin apoyos.", fecha_creacion: "2026-01-10" },
  { ID: 903, termino: "Heurística", descripcion: "Regla práctica para detectar problemas de uso antes del test.", fecha_creacion: "2026-01-10" },
  { ID: 904, termino: "Prototipo", descripcion: "Versión de prueba para observar cómo la usás antes de programar.", fecha_creacion: "2026-01-10" },
];

export const eventosTEMPORAL: Evento[] = [
  {
    ID: 901,
    titulo: "Taller abierto de tests",
    descripcion: "Vení a probar un trámite de la UNCA y contanos dónde te trabás.",
    fecha: "2026-06-10T16:00:00",
    lugar: "Campus UNCA — Catamarca",
    tipo: "evento",
    imagen: "/placeholder.svg",
    fecha_creacion: "2026-01-10 10:00:00",
    ID_usuario: 901,
    asistentes: [],
    areas_investigacion: [{ ID_area: 1, area_nombre: "Usabilidad" }],
  },
];

export const noticiasTEMPORAL: Evento[] = [
  {
    ID: 902,
    titulo: "Sumamos testers estudiantes",
    descripcion: "Abrimos la convocatoria 2026 para participar en pruebas del Lab UNCA.",
    fecha: "2026-02-10T10:00:00",
    lugar: "Campus UNCA — Catamarca",
    tipo: "noticia",
    imagen: "/placeholder.svg",
    fecha_creacion: "2026-02-10 10:00:00",
    ID_usuario: 901,
    asistentes: [],
    areas_investigacion: [{ ID_area: 1, area_nombre: "Usabilidad" }],
  },
];

export const proximosEventosTEMPORAL: Evento[] = [
  {
    ID: 903,
    titulo: "Puertas abiertas del Lab",
    descripcion: "Recorré el laboratorio y probá una demo de 10 minutos.",
    fecha: "2026-07-05T10:00:00",
    lugar: "Campus UNCA — Catamarca",
    tipo: "proximo_evento",
    imagen: "/placeholder.svg",
    fecha_creacion: "2026-01-10 10:00:00",
    ID_usuario: 901,
    asistentes: [],
    areas_investigacion: [{ ID_area: 1, area_nombre: "Usabilidad" }],
  },
];