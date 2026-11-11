/**
 * src/lib/db.ts — Pool MariaDB/MySQL para LAB-Ux
 *
 * Reemplazo de src/lib/mongodb.ts (deprecated).
 *
 * Uso:
 *   import { query, getPool, testConnection } from "@/lib/db";
 *   const rows = await query<Proyecto[]>("SELECT * FROM proyectos WHERE estado = ?", ["en_progreso"]);
 *
 * Env:
 *   DATABASE_URL=mysql://user:pass@host:3306/labux
 *   Alternativamente: MYSQL_* individuales (ver .env.example)
 *
 * Instalación requerida:
 *   npm install mysql2
 *   (mysql2/promise es driver puro JS, no necesita binarios nativos)
 *
 * Notas de migración desde MongoDB:
 * - Mongo usaba ObjectId string en `_id`; MariaDB usa INT AUTO_INCREMENT `ID`.
 *   Todos los types del proyecto ya usan `ID: number` (ver src/types/*), por lo
 *   que NO hay cambio de contrato en el FE. Si el backend aún serializa `_id`,
 *   normalizar en la capa API: `row.ID = row._id ?? row.ID`.
 * - Las fechas en MySQL son DATETIME/TIMESTAMP (ver formatDate helpers).
 *   Normalizar con `toMySQLDatetime()` antes de INSERT/UPDATE.
 * - Para transacciones usar `getPool().getConnection()` + beginTransaction().
 */

// Lazy import para no romper el build si mysql2 aún no está instalado.
// En runtime, si no está instalado, getPool() lanza error con instrucciones.
// Tipos laxos para no exigir `npm install mysql2` en type-check del FE actual
// Cuando mysql2 esté instalado, los tipos reales se resuelven vía require().
type Pool = {
  execute: (sql: string, params?: unknown[]) => Promise<[unknown, unknown]>;
  getConnection: () => Promise<unknown>;
  end: () => Promise<void>;
};
type PoolOptions = Record<string, unknown> & { uri?: string };

let _pool: Pool | null = null;
let _mysql: { createPool: (opts: PoolOptions | string) => Pool } | null = null;

function loadMysql2(): { createPool: (opts: PoolOptions | string) => Pool } {
  if (_mysql) return _mysql;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _mysql = require("mysql2/promise") as { createPool: (opts: PoolOptions | string) => Pool };
    return _mysql;
  } catch (e) {
    throw new Error(
      "[db] mysql2 no instalado. Ejecutá `npm install mysql2` y rebuildeá.\n" +
        "Detalle: " + (e as Error).message
    );
  }
}

function buildConfig(): PoolOptions {
  const url = process.env.DATABASE_URL;

  if (url) {
    return {
      uri: url,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_POOL_LIMIT ?? 10),
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      charset: "utf8mb4",
      timezone: process.env.TZ ?? "Z",
    };
  }

  // Fallback a variables separadas (útil en CI/testing)
  return {
    host: process.env.MYSQL_HOST ?? process.env.DB_HOST ?? "mariadb",
    port: Number(process.env.MYSQL_PORT ?? process.env.DB_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? process.env.DB_USER ?? "labux",
    password: process.env.MYSQL_PASSWORD ?? process.env.DB_PASSWORD ?? "labux_secret",
    database: process.env.MYSQL_DATABASE ?? process.env.DB_NAME ?? "labux",
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_LIMIT ?? 10),
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: "utf8mb4",
    timezone: process.env.TZ ?? "Z",
  };
}

export function getPool(): Pool {
  if (_pool) return _pool as Pool;

  // En build-time (next build sin DB) no fallar si no hay DATABASE_URL
  // El pool se crea lazy en la primera query/runtime.
  const mysql = loadMysql2();
  const config = buildConfig();

  // mysql2/promise permite pasar URI string directamente
  if ((config as unknown as { uri?: string }).uri) {
    const uri = (config as unknown as { uri: string }).uri;
    const { uri: _unused, ...rest } = config as unknown as { uri: string } & PoolOptions;
    void _unused;
    _pool = mysql.createPool({ uri: uri, ...rest } as PoolOptions);
  } else {
    _pool = mysql.createPool(config);
  }

  return _pool as Pool;
}

/**
 * Ejecuta una query parametrizada y retorna rows tipadas.
 * Uso seguro contra SQL injection si se usan placeholders `?`.
 *
 * @example
 * const usuarios = await query<User[]>("SELECT * FROM usuarios WHERE estado = ?", ["activo"]);
 */
export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T> {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

/**
 * Variante cuando se necesita `fields` o `insertId`.
 */
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<{ rows: unknown; fields: unknown; insertId?: number; affectedRows?: number }> {
  const pool = getPool();
  const [rows, fields] = await pool.execute(sql, params);
  const result = rows as { insertId?: number; affectedRows?: number };
  return {
    rows,
    fields,
    insertId: result?.insertId,
    affectedRows: result?.affectedRows,
  };
}

/**
 * Healthcheck — útil para /api/health
 */
export async function testConnection(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = Date.now();
  await query("SELECT 1 AS ok");
  return { ok: true, latencyMs: Date.now() - start };
}

/**
 * Cierra el pool (usar en tests o shutdown).
 */
export async function closePool(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}

// Compat: export default para call-sites que esperaban `import pool from "@/lib/db"`
const db = {
  getPool,
  query,
  execute,
  testConnection,
  closePool,
};
export default db;
