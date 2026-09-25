import { isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Login autonome : aucun élément privé tant qu'une session n'existe pas.
  if (!(await isAdmin())) return children;
  return <><AdminNav />{children}</>;
}
