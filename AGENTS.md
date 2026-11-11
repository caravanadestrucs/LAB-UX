# AGENTS.md — LAB-Ux

> Portal institucional + CMS para el Laboratorio de Usabilidad de la UNCA.
> Este archivo rige cómo cualquier agente (humano o IA) debe trabajar en este repo.

---

## 1. Stack Real (verificado 2026-11-11)

| Capa | Tech | Versión |
|------|------|---------|
| Framework | Next.js App Router | 15.3.2 |
| UI | React | 19.1.0 |
| Estilos | Tailwind CSS + tailwindcss-animate | 3.4.17 |
| Componentes | Radix UI + shadcn/ui `new-york` gray | — |
| Iconos | lucide-react | 0.479.0 |
| Forms | react-hook-form + @hookform/resolvers + Zod | 7.54 / 3.24 |
| Carousel / Charts | embla-carousel-react / recharts | 8.5 / 2.15 |
| UI extra | antd 5.24 (a eliminar duplicación) | — |
| Auth (actual) | jsonwebtoken + localStorage | 9.0 — **migrar a cookie httpOnly** |
| DB | mongodb driver 6.14 | Dead code en FE, vive en backend |
| Build | TypeScript 5 (strict) / ESLint 9 | — |
| Infra | Dockerfile node:18-alpine + docker-compose | — |
| Backend real | `https://backend.lab-ux.site` via `NEXT_PUBLIC_API_URL` | — |

**Alias:** `@/*` → `src/*` (tsconfig).
**Package name actual:** `prueba@0.1.0` — renombrar a `lab-ux`.

---

## 2. Estructura del Proyecto

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx              # RootLayout (HOY cliente, debe ser server)
│   │   ├── layoutSwitcher.tsx      # Switch Admin vs Public por pathname
│   │   ├── layoutAdmin.tsx         # Sidebar + Theme (HOY con <html>)
│   │   ├── layoutNormal.tsx        # Navbar + Footer
│   │   ├── page.tsx                # Home dinámico (fetchContenidos)
│   │   ├── public/                 # Rutas públicas sin auth
│   │   │   ├── login/              # Tabs login/register/reset
│   │   │   ├── team/               # Profesores/Equipo/Alumnos (fetchUsers)
│   │   │   ├── research/proyectos|metodologias|glosario
│   │   │   ├── diffusion/          # Noticias/Eventos/Próximos
│   │   │   └── support/            # FAQ/Contacto/Guías
│   │   └── admin/                  # Rutas admin (localStorage guard)
│   │       ├── usuarios/
│   │       ├── (investigacion)/proyectos|glosario|pruebasMetodologias
│   │       ├── (contenidos)/inicio|misionVision
│   │       ├── (soporte)/preguntasFrecuentes|contacto|guias
│   │       ├── difusion/           # Eventos/Noticias (819L, complejo)
│   │       └── configuracion/
│   ├── components/
│   │   ├── ui/                     # shadcn (28 files) — NO EDITAR manual
│   │   └── hooks/use-toast.ts      # Duplicado con src/hooks/use-toast.ts
│   ├── hooks/                      # islogin.ts, useUsuarios.ts, useAreas.ts (con bug), useProjects.ts
│   ├── services/                   # 9 services fetch (usuario, proyecto, contenido, eventoNoticia, area, glosario...)
│   ├── types/                      # 14 tipos (usuario, proyecto, eventoNoticia, contenidoSitio...)
│   ├── constans/                   # ⚠️ TYPO → debe ser constants/ (Api.ts, data.ts 903L mock, navbar.tsx)
│   ├── config/endpoints.ts         # Solo USUARIOS, resto hardcodea API_URL
│   ├── lib/                        # utils.cn, formatDate, mongodb.ts (dead), auth.ts (vacío)
│   └── styles/globals.css          # Tokens HSL + tailwind directives (canon)
├── styles/globals.css              # Duplicado — eliminar
├── public/                         # Estáticos
├── components.json                 # shadcn new-york gray — apunta a "styles/globals.css" (fix a src/styles)
├── next.config.ts                  # Vacío — falta images.remotePatterns
├── tailwind.config.js              # content src/**/*
├── eslint.config.mjs / tsconfig.json
├── Dockerfile / docker-compose.yml
├── .env                            # REACT_APP_API_URL legacy (ignorado)
└── .env.local                      # MONGODB_URI=mongodb://db:27017/mi-db (solo mongodb.ts)
```

**Group segments** `(investigacion)`, `(contenidos)`, `(soporte)` son solo organizativos, no afectan URL.

---

## 3. Flujo de Datos y Auth

```
Page (useState/useEffect)
  → services/*.ts  (fetch + a veces Authorization: Bearer localStorage.authToken)
  → ${NEXT_PUBLIC_API_URL} → backend.lab-ux.site
  → types/*.ts
```

- **Estado global:** No hay Zustand/Redux/Context real. Hooks locales por página.
- **Auth actual (inseguro):** `POST /usuarios/login` → `localStorage.setItem("usuario", JSON.stringify(usuario))` → `layoutSwitcher` lee `getUsuarioActual()` y redirige si `/admin` sin usuario. Sin verificación JWT, sin httpOnly, sin `middleware.ts`.
- **DB:** `src/lib/mongodb.ts` nunca se usa en FE — pertenece al backend.

---

## 4. Reglas Críticas — NO ROMPER

1.  **Un solo `<html><body>`** en `src/app/layout.tsx` y debe ser **Server Component**. `layoutAdmin.tsx` y `layoutNormal.tsx` NO deben renderizar `<html>`.
2.  **Auth server-side:** implementar `middleware.ts` con verificación JWT en cookie `httpOnly`. Nunca confiar solo en `localStorage`.
3.  **No hardcodear URLs.** Usar `src/constants/Api.ts` (`NEXT_PUBLIC_API_URL`) + `src/config/endpoints.ts` + `src/services/*`. Nunca `localhost:5000` ni strings sueltos.
4.  **shaden/ui:** no editar `src/components/ui/*` a mano — usar `npx shadcn add`.
5.  **FormData para archivos:** patrón existente en usuarios/proyectos/eventos — mantenerlo.
6.  **Commits:** conventional commits, sin `Co-Authored-By`, sin atribución IA.
7.  **CodeGraph antes de refactors:** ejecutar `codegraph_explore` con `projectPath: C:/Users/Dario/Videos/LAB-Ux` antes de tocar estructura, renombres o blast radius.
8.  **`npm run lint && npm run build` debe pasar** antes de cada PR.

---

## 5. Convenciones

- **Alias** `@/*` siempre, nunca rutas relativas largas.
- **Helpers fechas:** centralizar en `src/lib/formatDate.ts` (`formatDate`, `formatDateForInput`, `toMySQLDatetime` — hoy duplicados en 5 archivos).
- **Estilos:** `cn()` de `src/lib/utils.ts` + `getStatusColor()` para badges.
- **Fetch pattern:** `fetchContenidos({ tipo: "mision"|"vision"|"valores" })`, `fetchUsers({ rol, estado, page })`, paginación con `page/limit`.
- **Toasts:** usar `useToast()` (unificar duplicado `components/hooks` vs `hooks`).
- **Imágenes backend:** `backend.lab-ux.site/uploads/...` — requiere `next.config.ts` `images.remotePatterns`.

---

## 6. Env

```bash
# Frontend (público)
NEXT_PUBLIC_API_URL=https://backend.lab-ux.site

# Backend / Docker (no exponer en FE)
MONGODB_URI=mongodb://db:27017/mi-db
```

`.env` con `REACT_APP_API_URL` es legacy CRA — ignorado por Next.

---

## 7. Comandos

```bash
npm run dev      # Next dev (Turbopack Next 15)
npm run build    # Build prod
npm run lint     # ESLint 9 + next/core-web-vitals
npm run start    # Prod server

# Docker
docker compose up --build

# CodeGraph (ya inicializado en .codegraph/codegraph.db ~3.4MB)
gentle-ai codegraph init --cwd .   # re-index si cambia root
# Usar codegraph_explore MCP con projectPath para queries estructurales

# Engram (proyecto: lab-ux, source: git_remote)
# mem_search / mem_save con project: "lab-ux"
```

---

## 8. Testing (hoy 0% — a implementar)

```bash
npm run test     # Vitest (a crear)
npm run e2e      # Playwright smoke: login, CRUD usuario, glosario
```

Sin tests actuales. Prioridad: smoke login + glosario + usuarios.

---

## 9. Tech Debt Priorizado

### P0 — Bloqueante prod
- [ ] Layouts anidan `<html><body>` — hidratación rota
- [ ] Auth solo localStorage — XSS bypass `/admin`
- [ ] `src/constans` typo (12 imports) — renombrar a `constants`
- [ ] `useAreas` bug: espera `response.ok` pero service ya hace `.json()`
- [ ] `components.json` apunta a `styles/globals.css` vs real `src/styles/globals.css` + `styles/` duplicado

### P1 — Alto
- [ ] `package.json` name `prueba` + `ant@0.0.0` phantom + `antd` duplica Radix (bundle)
- [ ] `src/lib/auth.ts` vacío, `mongodb.ts` dead code, `jsonwebtoken` sin uso FE
- [ ] `postcss.config.js` + `.mjs` duplicados, `next.config.ts` vacío
- [ ] `data.ts` 903L mock diverge de tipos API (`proyecto_areas_investigacion` vs `areas_investigacion`, etc.)
- [ ] `support/page.tsx` POST `localhost:5000`, `handleRegister` mock `setTimeout`, `difusion` public usa mock no fetch
- [ ] 29× `console.log`, `alert()` en `glosario.ts:48`

### P2 — Medio
- [ ] Hooks duplicados `use-toast`, `use-mobile`
- [ ] `admin-sidebar` hardcodea `/dashboard` inexistente, `isActive` solo `===`
- [ ] Dockerfile `npm install` sin `npm ci`/`next build`, compose sin service `db`
- [ ] `endpoints.ts` solo usuarios, fechas helpers duplicados, `<img>` vs `next/image` mezclados

---

## 10. Workflow para Agentes

1.  **Antes de tocar código:** `codegraph_explore` con query + `projectPath` para mapa de impacto.
2.  **Antes de planificar feature grande:** usa SDD (`/sdd-new`) — preflight + explore + proposal.
3.  **Cambios pequeños:** direct inline o delegated direct (1 writer).
4.  **Siempre:** `mem_search` en engram `lab-ux` por contexto previo, `mem_save` tras decisiones/bugfixes.
5.  **No crear** `.codegraph/` nuevo — ya existe. Corre `codegraph sync` si watcher desactualizado.

---

*Generado 2026-11-11 — Auditoría completa en engram `lab-ux`. Próximo paso: Sprint 0 (renombres + limpieza) → Sprint 1 (layouts server).*
