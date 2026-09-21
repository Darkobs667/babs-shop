"use client";
import { useActionState } from "react";
import { login } from "./actions";
export default function LoginPage() {
  const [state, action, pending] = useActionState(login, {});
  return <main className="mx-auto max-w-sm p-8"><h1 className="text-2xl font-bold">Administration</h1><form action={action} className="mt-6 space-y-4"><input required name="email" type="email" placeholder="Email" className="w-full rounded border p-3" /><input required name="password" type="password" placeholder="Mot de passe" className="w-full rounded border p-3" />{state.error && <p className="text-sm text-red-600">{state.error}</p>}<button disabled={pending} className="w-full rounded bg-black p-3 text-white">{pending ? "Connexion…" : "Se connecter"}</button></form></main>;
}
