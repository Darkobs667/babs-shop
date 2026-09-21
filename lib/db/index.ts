import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: postgres.Sql };
// max: 1 limite les connexions par instance serverless. DATABASE_URL doit être l'URL pooler.
const sql = globalForDb.sql ?? postgres(process.env.DATABASE_URL!, { max: 1, prepare: false, idle_timeout: 20 });
if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;

export const db = drizzle(sql, { schema });
