/**
 * @deprecated — Usar src/lib/db.ts (mysql2/MariaDB). Este archivo se conserva
 * solo por compatibilidad histórica y NO debe importarse en código nuevo.
 *
 * Se eliminó la dependencia `mongodb` del FE (ver PR chore/bundle-cleanup).
 * El backend (https://backend.lab-ux.site) mantiene su propio package.json
 * con `mongodb`/`jsonwebtoken` si aún los necesita. Este stub no requiere
 * `mongodb` instalado y lanza error si se intenta usar en runtime.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let clientPromise: Promise<any> | null = null;

if (process.env.MONGODB_URI) {
  console.warn(
    "[deprecated] src/lib/mongodb.ts: MONGODB_URI aún definida pero mongodb no está instalado en FE. " +
      "Usar src/lib/db.ts + DATABASE_URL. Ver DOCKER_MARIADB.md."
  );
}

// Stub que falla si alguien lo importa — evita bundle de mongodb (~300kb) en FE.
clientPromise = Promise.reject(
  new Error(
    "[deprecated] src/lib/mongodb.ts ya no está disponible. Usar src/lib/db.ts (mysql2). " +
      "Si necesitás Mongo, instalar mongodb en el backend, no en el FE."
  )
);

// Evita throw en import-time; el error solo aparece al await.
if (clientPromise) {
  clientPromise.catch(() => {
    // silenciar unhandled rejection en build-time; el error se verá en runtime si se usa
  });
}

export default clientPromise as unknown as Promise<never>;
