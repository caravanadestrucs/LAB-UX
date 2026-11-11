# LAB-Ux — Docker + MariaDB

Infra Docker Compose con **MariaDB 11** como DB principal. Mantiene compatibilidad con el backend externo `https://backend.lab-ux.site` (FE funciona sin cambios). Cuando se implementen API Routes locales, `src/lib/db.ts` ya está listo.

---

## 1. Servicios

| Servicio | Imagen | Puerto host | Notas |
|---|---|---|---|
| `mariadb` | `mariadb:11.4` | `3306` (`MYSQL_PORT`) | Volume `labux-mariadb-data`, healthcheck, init en `docker/mariadb/init/` |
| `app` | `node:20-alpine` (multi-stage) | `3000` (`APP_PORT`) | `depends_on: mariadb: healthy`, lee `DATABASE_URL` |
| `adminer` | `adminer:4.8.1` | `8080` (`ADMINER_PORT`) | Solo con `--profile tools` |

Network: `labux-network` (bridge). Todos los servicios se resuelven por nombre (`mariadb`, `app`, `adminer`).

---

## 2. Quick start

```bash
# 1. Variables (no commitear .env.local)
cp .env.example .env.local
# Editar MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD, JWT_SECRET

# 2. Levantar (build + migrate implícita vía init SQL)
docker compose up --build -d

# 3. Ver logs
docker compose logs -f app
docker compose logs -f mariadb

# 4. Verificar
curl http://localhost:3000/
# Con Adminer (opcional):
docker compose --profile tools up -d
# Abrir http://localhost:8080  Sistema: MariaDB  Servidor: mariadb  Usuario: labux
```

Detener:

```bash
docker compose down              # mantiene datos (volume)
docker compose down -v           # BORRA datos (volume labux-mariadb-data)
```

---

## 3. Variables de entorno

Ver `.env.example` (canónico). Resumen:

| Variable | Default | Uso |
|---|---|---|
| `MYSQL_DATABASE` | `labux` | Nombre DB |
| `MYSQL_USER` | `labux` | Usuario app |
| `MYSQL_PASSWORD` | `labux_secret` | Clave app |
| `MYSQL_ROOT_PASSWORD` | `labux_root_2026` | Root MariaDB |
| `MYSQL_PORT` | `3306` | Mapeo host |
| `DATABASE_URL` | `mysql://labux:labux_secret@mariadb:3306/labux` | Leída por `src/lib/db.ts` |
| `NEXT_PUBLIC_API_URL` | `https://backend.lab-ux.site` | Backend FE (externo o `http://app:3000/api` si hay API local) |
| `JWT_SECRET` | — | Firmado de tokens (generar con `openssl rand -hex 32`) |
| `ADMINER_PORT` | `8080` | Solo profile tools |

**Compat legacy (deprecated):**

- `MONGODB_URI` — aún leída si existe pero no se usa. No definir en instalaciones nuevas. Eliminada cuando se retire `src/lib/mongodb.ts`.
- `REACT_APP_API_URL` — legacy CRA, ignorado por Next.

---

## 4. Conexión a la DB

### Desde el container `app`

```
DATABASE_URL=mysql://labux:labux_secret@mariadb:3306/labux
# host = mariadb (nombre del servicio)
```

### Desde el host (DBeaver, MySQL Workbench, CLI)

```
mysql -h 127.0.0.1 -P 3306 -u labux -p labux
# o
DATABASE_URL=mysql://labux:labux_secret@127.0.0.1:3306/labux
```

### Adminer

```bash
docker compose --profile tools up -d
# http://localhost:8080
# Sistema: MariaDB | Servidor: mariadb | Usuario: labux | Contraseña: (MYSQL_PASSWORD) | Base: labux
```

---

## 5. Esquema SQL

Fuente: `docker/mariadb/init/01-schema.sql` — derivado de `src/types/*.ts`. Todos los `ID` son `INT UNSIGNED AUTO_INCREMENT` (consistente con los types `ID: number`).

Tablas:

- `areas_investigacion`
- `usuarios`, `formacion_academica`, `experiencia_laboral`, `usuario_area_investigacion`
- `proyectos`, `proyecto_area_investigacion`, `proyecto_colaborador`
- `eventos_noticias`, `evento_asistente`, `evento_area_investigacion`, `material_evento`
- `glosario` (con FULLTEXT en `termino, descripcion`)
- `metodologias_pruebas`, `metodologia_caracteristica`
- `contenido_sitio`
- `guias_tutoriales`, `guia_recurso`, `guia_area_investigacion`
- `preguntas_frecuentes`
- `informacion_sitio` (singleton)
- `solicitudes_contacto`

El init se ejecuta **solo la primera vez** que el volume está vacío. Para reaplicar:

```bash
docker compose down -v
docker compose up --build -d
```

Para cambios incrementales en prod, usar migraciones versionadas (ej. `03-alter-xxx.sql` montado y aplicado manualmente o con herramienta como `dbmate`/`knex`).

Seed mínimo: `docker/mariadb/init/02-seed.sql` (4 áreas, admin dev, banner/misión/visión, info sitio, 2 FAQs). **Cambiar el password del admin** antes de exponer.

---

## 6. `src/lib/db.ts` (nuevo) vs `src/lib/mongodb.ts` (deprecated)

- `src/lib/mongodb.ts` se **conserva** pero está deprecated. No se importa en ningún lado (dead code FE).
- `src/lib/db.ts` es el nuevo acceso a datos:
  ```ts
  import { query, getPool, testConnection } from "@/lib/db";
  const users = await query<User[]>("SELECT * FROM usuarios WHERE estado = ?", ["activo"]);
  ```
  Usa `mysql2/promise` pool. Requiere instalar la dependencia:

  ```bash
  npm install mysql2
  ```

  El archivo hace `require("mysql2/promise")` lazy: el build no rompe si aún no está instalada, pero en runtime `getPool()` lanza error claro si falta.

- Transacciones:
  ```ts
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute("INSERT INTO proyectos (...) VALUES (...)", [...]);
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; } finally { conn.release(); }
  ```

- Health endpoint sugerido (`src/app/api/health/route.ts`):
  ```ts
  import { testConnection } from "@/lib/db";
  export async function GET() {
    const db = await testConnection().catch(e => ({ ok: false, error: String(e) }));
    return Response.json({ status: db.ok ? "ok" : "degraded", db });
  }
  ```

La imagen Docker ya instala `mysql2` si está en `package.json`. Si no se quiere instalar aún, el FE sigue funcionando porque hoy **no hay API Routes locales** — todo el fetch va a `NEXT_PUBLIC_API_URL`.

---

## 7. Dockerfile

Multi-stage `node:20-alpine`:

1. `deps` — `npm ci` (fallback `npm install`)
2. `builder` — `npm run build` (con `NEXT_PUBLIC_API_URL` inlined)
3. `runner` — usuario `nextjs` (uid 1001), solo `.next`, `public`, `node_modules` necesarios, `HEALTHCHECK`, `EXPOSE 3000`, `CMD ["npm","run","start"]`

Para dev con hot-reload, copiar `docker-compose.override.yml.example` a `docker-compose.override.yml` (no commiteado).

---

## 8. Migración MongoDB → MariaDB (qué falta)

### a) Datos

Mongo usaba colecciones schemaless con `_id: ObjectId`. MariaDB usa `ID INT AUTO_INCREMENT`. Los `src/types/*.ts` ya esperan `ID: number`, por lo que **no hay cambio de contrato en el FE**.

Pasos de migración real (cuando haya dump Mongo):

1. `mongodump` / `mongoexport --jsonArray` por colección.
2. Script de transformación (ej. `scripts/migrate-mongo-to-mariadb.mjs`):
   - `_id` (ObjectId string) → descartar o guardar en columna `legacy_mongo_id VARCHAR(24)` si se necesita trazabilidad.
   - `fecha_registro` / `fecha_creacion` string ISO → `DATETIME` (`YYYY-MM-DD HH:MM:SS`).
   - Arrays embebidos (`areas_investigacion`, `colaboradores`, `materiales`) → tablas de unión.
   - `foto` / `imagen` paths → `VARCHAR(500)` (verificar `backend.lab-ux.site/uploads/`).
3. Carga con `LOAD DATA INFILE` o inserts batcheados.
4. Verificar FKs, re-crear índices FULLTEXT.

### b) Código

- [ ] Instalar `mysql2`: `npm install mysql2` (y opcional `bcryptjs` si el hash de password se hace en Next).
- [ ] Implementar API Routes bajo `src/app/api/**/route.ts` que usen `src/lib/db.ts` (reemplazan `https://backend.lab-ux.site` cuando se quiera backend local).
- [ ] Migrar `jsonwebtoken` + `localStorage` a `httpOnly` cookies + `middleware.ts` (P0 del tech debt).
- [x] Eliminar `mongodb` de FE `package.json` — hecho en `chore/bundle-cleanup` (PR-10). `src/lib/mongodb.ts` queda como stub deprecated sin dep.
  > Nota: `jsonwebtoken` y `mongodb` se removieron del **FE** (`C:\Users\Dario\Videos\LAB-Ux\package.json`). El backend (`https://backend.lab-ux.site`) mantiene su propio `package.json` con esas deps si aún las necesita. No reinstalar en FE.
- [ ] Eliminar `src/lib/mongodb.ts` (stub) cuando no queden lecturas legacy y `MONGODB_URI` ya no se defina.
- [ ] Eliminar `MONGODB_URI` de `.env*` y de `docker-compose.yml` (env).

### c) Uploads

Hoy `usuarioService` y `proyecto` usan `FormData` con archivos. En MariaDB guardar solo la **ruta** (`foto VARCHAR(500)`). El almacenamiento de archivos sigue en filesystem (`/uploads`) o migrar a S3/MinIO. Montar volume para `uploads` en `docker-compose.yml` si se implementa API local:

```yaml
volumes:
  - uploads_data:/app/public/uploads
```

---

## 9. Troubleshooting

| Síntoma | Causa | Fix |
|---|---|---|
| `ER_ACCESS_DENIED` en `app` | `MYSQL_PASSWORD` no coincide con volume viejo | `docker compose down -v && up --build` (borra datos) o `mysql -uroot -p -e "ALTER USER ..."` |
| `Unknown database 'labux'` | Volume no inicializado | Ver logs `mariadb`: `docker compose logs mariadb`; verificar `docker/mariadb/init/*.sql` sintaxis |
| `mysql2 not installed` | Falta `npm install mysql2` | `npm install mysql2` + rebuild `docker compose build app` |
| `NEXT_PUBLIC_API_URL` apunta a localhost y falla en Docker | `localhost` dentro del container ≠ host | Usar `http://host.docker.internal:5000` en dev o mantener `https://backend.lab-ux.site` |
| Puerto 3306 ocupado | MySQL local en host | Cambiar `MYSQL_PORT=3307` en `.env.local` |

---

## 10. Archivos tocados/creados en este cambio

- **Modificados:** `Dockerfile`, `docker-compose.yml`
- **Creados:** `.dockerignore`, `.env.example`, `docker-compose.override.yml.example`, `src/lib/db.ts`, `docker/mariadb/init/01-schema.sql`, `docker/mariadb/init/02-seed.sql`, `DOCKER_MARIADB.md`
- **Conservados (deprecated):** `src/lib/mongodb.ts`, `MONGODB_URI` en env (compat)
