import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: postgres.Sql };
const databaseUrl = process.env.DATABASE_URL?.trim().replace(/^['"]|['"]$/g, "");

if (!databaseUrl) throw new Error("DATABASE_URL est manquant. Ajoutez l'URL pooler Neon dans les variables Vercel.");

try {
  const parsed = new URL(databaseUrl);
  if (!/^postgres(?:ql)?:$/.test(parsed.protocol)) throw new Error("Protocole invalide");
} catch {
  throw new Error("DATABASE_URL est invalide. Collez uniquement l'URL pooler Neon complete, sans 'DATABASE_URL=', guillemets, espaces ni retours a la ligne.");
}

// Une seule connexion par instance serverless ; utiliser exclusivement l'URL pooler Neon.
const sql = globalForDb.sql ?? postgres(databaseUrl, { max: 1, prepare: false, idle_timeout: 20 });
if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;

export const db = drizzle(sql, { schema });
