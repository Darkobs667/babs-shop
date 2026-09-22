import bcrypt from "bcryptjs";
import { readHiddenPassword } from "./read-hidden-password.mjs";

const password = await readHiddenPassword("Mot de passe administrateur : ");

if (password.length < 12) {
  console.error("Le mot de passe doit contenir au moins 12 caractères.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
// Next.js interprète `$` dans les fichiers .env : les antislashs garantissent un hash littéral.
console.log("Copie cette valeur dans ADMIN_PASSWORD_HASH :");
console.log(hash.replaceAll("$", "\\$"));
