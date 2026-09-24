import { createRequire } from "node:module";
import bcrypt from "bcryptjs";
import { readHiddenPassword } from "./read-hidden-password.mjs";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env");
loadEnvConfig(process.cwd());
const hash = process.env.ADMIN_PASSWORD_HASH;
if (!hash) throw new Error("ADMIN_PASSWORD_HASH est absent de .env.local");

const password = await readHiddenPassword("Mot de passe à vérifier : ");

console.log(await bcrypt.compare(password, hash) ? "Mot de passe valide." : "Mot de passe invalide pour le hash actuel.");
