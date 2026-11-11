-- =============================================================================
-- LAB-Ux — Seed mínimo (idempotente con INSERT IGNORE)
-- Se ejecuta solo en la primera inicialización del volume vacío
-- =============================================================================

-- Áreas de investigación base
INSERT IGNORE INTO areas_investigacion (ID, nombre, descripcion) VALUES
  (1, 'Usabilidad', 'Evaluación de usabilidad y UX research'),
  (2, 'Accesibilidad', 'WCAG, lectores de pantalla, contraste'),
  (3, 'Interacción Humano-Computadora', 'HCI, patrones de interacción'),
  (4, 'Diseño Centrado en el Usuario', 'DCU, design thinking');

-- Usuario admin inicial (password debe hashearse en el backend / API route)
-- Hash bcrypt de 'Admin123!' como ejemplo — REEMPLAZAR en prod
-- Este seed es solo para dev; en prod crear admin via script con hash real
INSERT IGNORE INTO usuarios (ID, correo, password, nombre, apellido, username, tipo_usuario, estado) VALUES
  (1, 'admin@lab-ux.site', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin', 'LAB-Ux', 'admin', 'admin', 'activo');
-- Nota: el hash anterior es de 'secret' — generar uno real con: node -e "console.log(require('bcryptjs').hashSync('TU_CLAVE',10))"

-- Contenido sitio mínimo (banner + misión/visión)
INSERT IGNORE INTO contenido_sitio (ID, tipo, titulo, texto, estado, orden) VALUES
  (1, 'banner', 'Laboratorio de Usabilidad — UNCA', 'Investigación, evaluación y formación en UX.', 'activo', 1),
  (2, 'mision', 'Misión', 'Contenido de misión — editar desde /admin/contenidos.', 'activo', 2),
  (3, 'vision', 'Visión', 'Contenido de visión — editar desde /admin/contenidos.', 'activo', 3),
  (4, 'valores', 'Valores', 'Compromiso, rigor, accesibilidad.', 'activo', 4);

-- Info del sitio singleton
INSERT IGNORE INTO informacion_sitio (ID, nombre_sitio, descripcion, email, idioma) VALUES
  (1, 'LAB-Ux — UNCA', 'Laboratorio de Usabilidad de la Universidad Nacional de Catamarca', 'contacto@lab-ux.site', 'es');

-- FAQ de ejemplo
INSERT IGNORE INTO preguntas_frecuentes (ID, pregunta, respuesta, orden) VALUES
  (1, '¿Qué es LAB-Ux?', 'El Laboratorio de Usabilidad de la UNCA dedicado a investigación y evaluación de UX.', 1),
  (2, '¿Cómo solicito una evaluación?', 'A través del formulario de contacto o escribiendo a contacto@lab-ux.site.', 2);
