# syntax=docker/dockerfile:1.6
# LAB-Ux — Next.js 15 (multi-stage, node:20-alpine)
# Compatible con MariaDB como DB principal (DATABASE_URL) y con backend externo (NEXT_PUBLIC_API_URL)

# ── Stage 1: deps ──────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
# Necesario para algunos native deps (si aparecen)
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
# npm ci es reproducible; si no hay lock, fallback a npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ── Stage 2: builder ──────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next necesita env en build para inlining de NEXT_PUBLIC_*
# Si no existe .env, usa defaults; no falla el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# ── Stage 3: runner (slim) ────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Solo lo necesario para correr Next standalone-like
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone* ./ 2>/dev/null || true
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
# Si existe next.config.js/mjs alternativo, no rompe
COPY --from=builder /app/next.config.js* ./ 2>/dev/null || true

USER nextjs
EXPOSE 3000

# Healthcheck opcional para orquestadores
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))" || \
      wget -qO- http://127.0.0.1:3000/ | grep -q "<html" || exit 1

CMD ["npm", "run", "start"]
