-- =============================================================================
-- LAB-Ux — Esquema MariaDB 11
-- Derivado de src/types/*.ts (todos los ID son INT UNSIGNED AUTO_INCREMENT)
-- Orden: tablas base -> tablas dependientes (FKs)
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- Engine: InnoDB
-- =============================================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. areas_investigacion
-- src/types/areaInvestigacion.ts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS areas_investigacion (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_areas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. usuarios
-- src/types/usuario.ts — RoleUser, StatusUser
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  nombre VARCHAR(150) NOT NULL,
  apellido VARCHAR(150) NULL,
  telefono VARCHAR(50) NULL,
  username VARCHAR(100) NULL,
  tipo_usuario ENUM('admin','alumno','profesor') NOT NULL DEFAULT 'alumno',
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  foto VARCHAR(500) NULL COMMENT 'ruta relativa en /uploads o URL externa',
  avatar VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_correo (correo),
  UNIQUE KEY uq_usuarios_username (username),
  KEY idx_usuarios_tipo (tipo_usuario),
  KEY idx_usuarios_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. usuarios — relaciones N:M y 1:N
-- src/types/formacionAcademica.ts, experienciaLaboral.ts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS formacion_academica (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ID_usuario INT UNSIGNED NOT NULL,
  institucion VARCHAR(255) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  descripcion TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ID_usuario) REFERENCES usuarios(ID) ON DELETE CASCADE,
  KEY idx_formacion_usuario (ID_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS experiencia_laboral (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ID_usuario INT UNSIGNED NOT NULL,
  empresa VARCHAR(255) NOT NULL,
  puesto VARCHAR(255) NOT NULL,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  descripcion TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ID_usuario) REFERENCES usuarios(ID) ON DELETE CASCADE,
  KEY idx_experiencia_usuario (ID_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario_area_investigacion (
  ID_usuario INT UNSIGNED NOT NULL,
  ID_area INT UNSIGNED NOT NULL,
  PRIMARY KEY (ID_usuario, ID_area),
  FOREIGN KEY (ID_usuario) REFERENCES usuarios(ID) ON DELETE CASCADE,
  FOREIGN KEY (ID_area) REFERENCES areas_investigacion(ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. proyectos
-- src/types/proyecto.ts — EstadoProyecto
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS proyectos (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(300) NOT NULL,
  tipo_estudio VARCHAR(150) NOT NULL,
  imagen VARCHAR(500) NULL,
  descripcion TEXT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  progreso TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0-100',
  estado ENUM('planificacion','en_progreso','completado','cancelado') NOT NULL DEFAULT 'planificacion',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (progreso BETWEEN 0 AND 100),
  KEY idx_proyectos_estado (estado),
  KEY idx_proyectos_fecha_inicio (fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS proyecto_area_investigacion (
  ID_proyecto INT UNSIGNED NOT NULL,
  ID_area INT UNSIGNED NOT NULL,
  PRIMARY KEY (ID_proyecto, ID_area),
  FOREIGN KEY (ID_proyecto) REFERENCES proyectos(ID) ON DELETE CASCADE,
  FOREIGN KEY (ID_area) REFERENCES areas_investigacion(ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS proyecto_colaborador (
  ID_proyecto INT UNSIGNED NOT NULL,
  ID_usuario INT UNSIGNED NOT NULL,
  PRIMARY KEY (ID_proyecto, ID_usuario),
  FOREIGN KEY (ID_proyecto) REFERENCES proyectos(ID) ON DELETE CASCADE,
  FOREIGN KEY (ID_usuario) REFERENCES usuarios(ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. eventos_noticias
-- src/types/eventoNoticia.ts — TipoEventoNoticia
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eventos_noticias (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(300) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha DATE NOT NULL,
  lugar VARCHAR(300) NOT NULL,
  tipo ENUM('evento','noticia','proximo_evento') NOT NULL,
  imagen VARCHAR(500) NULL,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ID_usuario INT UNSIGNED NOT NULL COMMENT 'creador',
  FOREIGN KEY (ID_usuario) REFERENCES usuarios(ID) ON DELETE RESTRICT,
  KEY idx_eventos_tipo (tipo),
  KEY idx_eventos_fecha (fecha),
  KEY idx_eventos_usuario (ID_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS evento_asistente (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ID_evento INT UNSIGNED NOT NULL,
  nombre_externo VARCHAR(255) NOT NULL,
  email_externo VARCHAR(255) NOT NULL,
  institucion_externa VARCHAR(255) NOT NULL,
  FOREIGN KEY (ID_evento) REFERENCES eventos_noticias(ID) ON DELETE CASCADE,
  KEY idx_asistente_evento (ID_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS evento_area_investigacion (
  ID_evento INT UNSIGNED NOT NULL,
  ID_area INT UNSIGNED NOT NULL,
  PRIMARY KEY (ID_evento, ID_area),
  FOREIGN KEY (ID_evento) REFERENCES eventos_noticias(ID) ON DELETE CASCADE,
  FOREIGN KEY (ID_area) REFERENCES areas_investigacion(ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS material_evento (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ID_evento_noticia INT UNSIGNED NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  nombre VARCHAR(300) NOT NULL,
  archivo VARCHAR(500) NOT NULL,
  FOREIGN KEY (ID_evento_noticia) REFERENCES eventos_noticias(ID) ON DELETE CASCADE,
  KEY idx_material_evento (ID_evento_noticia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. glosario
-- src/types/glosario.ts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS glosario (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  termino VARCHAR(300) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ID_usuario INT UNSIGNED NULL,
  FOREIGN KEY (ID_usuario) REFERENCES usuarios(ID) ON DELETE SET NULL,
  UNIQUE KEY uq_glosario_termino (termino),
  KEY idx_glosario_usuario (ID_usuario),
  FULLTEXT KEY ft_glosario (termino, descripcion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. metodologias_pruebas
-- src/types/metodologiaPrueba.ts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS metodologias_pruebas (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(300) NOT NULL,
  descripcion TEXT NULL,
  tipo ENUM('metodologia','prueba') NOT NULL,
  imagen VARCHAR(500) NULL,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_metodologia_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS metodologia_caracteristica (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ID_metodologia INT UNSIGNED NOT NULL,
  caracteristica VARCHAR(300) NOT NULL,
  descripcion TEXT NULL,
  FOREIGN KEY (ID_metodologia) REFERENCES metodologias_pruebas(ID) ON DELETE CASCADE,
  KEY idx_caracteristica_metodologia (ID_metodologia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. contenido_sitio
-- src/types/contenidoSitio.ts — TipoContenido, EstadoContenido
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contenido_sitio (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('banner','mision','vision','valores','otro') NOT NULL,
  titulo VARCHAR(300) NOT NULL,
  texto TEXT NULL,
  imagen VARCHAR(500) NULL,
  link_redireccion VARCHAR(1000) NULL,
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  orden INT NOT NULL DEFAULT 0,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_contenido_tipo (tipo),
  KEY idx_contenido_estado (estado),
  KEY idx_contenido_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. guias_tutoriales + recursos + áreas
-- src/types/guiaTutorial.ts — TipoRecurso
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guias_tutoriales (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(300) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ID_usuario INT UNSIGNED NOT NULL,
  categoria VARCHAR(150) NOT NULL,
  imagen VARCHAR(500) NULL,
  imagen_url VARCHAR(1000) NULL,
  FOREIGN KEY (ID_usuario) REFERENCES usuarios(ID) ON DELETE RESTRICT,
  KEY idx_guias_categoria (categoria),
  KEY idx_guias_usuario (ID_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS guia_recurso (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ID_guia INT UNSIGNED NOT NULL,
  tipo ENUM('link','video','pdf','imagen','otro') NOT NULL,
  recurso VARCHAR(1000) NOT NULL COMMENT 'nombre archivo o URL',
  recurso_url VARCHAR(1000) NULL,
  descripcion TEXT NULL,
  FOREIGN KEY (ID_guia) REFERENCES guias_tutoriales(ID) ON DELETE CASCADE,
  KEY idx_recurso_guia (ID_guia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS guia_area_investigacion (
  ID_guia INT UNSIGNED NOT NULL,
  ID_area INT UNSIGNED NOT NULL,
  PRIMARY KEY (ID_guia, ID_area),
  FOREIGN KEY (ID_guia) REFERENCES guias_tutoriales(ID) ON DELETE CASCADE,
  FOREIGN KEY (ID_area) REFERENCES areas_investigacion(ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. preguntas_frecuentes
-- src/types/preguntaFrecuente.ts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS preguntas_frecuentes (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pregunta TEXT NOT NULL,
  respuesta TEXT NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_faq_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. informacion_sitio (singleton, 1 fila)
-- src/types/informacionSitio.ts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS informacion_sitio (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_sitio VARCHAR(300) NOT NULL,
  descripcion TEXT NULL,
  lugar_fisico VARCHAR(500) NULL,
  telefono VARCHAR(50) NULL,
  email VARCHAR(255) NULL,
  url VARCHAR(1000) NULL,
  idioma VARCHAR(20) NULL DEFAULT 'es',
  icono VARCHAR(500) NULL,
  logo VARCHAR(500) NULL,
  horario VARCHAR(500) NULL,
  facebook VARCHAR(500) NULL,
  instagram VARCHAR(500) NULL,
  tiktok VARCHAR(500) NULL,
  twitter VARCHAR(500) NULL,
  linkedin VARCHAR(500) NULL,
  fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. solicitudes_contacto
-- src/types/solicitudContacto.ts — EstadoSolicitud
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS solicitudes_contacto (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  apellido VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  area_interes VARCHAR(255) NULL,
  mensaje TEXT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('nuevo','en_proceso','respondido','cerrado') NOT NULL DEFAULT 'nuevo',
  KEY idx_solicitud_estado (estado),
  KEY idx_solicitud_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
