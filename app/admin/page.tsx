import { redirect } from "next/navigation";
// L'administration démarre directement par la gestion des produits.
export default function AdminPage() { redirect("/admin/products"); }
