import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getGestores } from "@/actions/gestores";
import { getPerpetuos } from "@/actions/perpetuos";
import { GestorList } from "@/components/gestores/GestorList";

export const metadata = {
  title: "Gestores — PerpetuoHQ",
};

export default async function GestoresPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "head") redirect("/dashboard");

  const [gestoresRes, perpetuosRes] = await Promise.all([
    getGestores(),
    getPerpetuos(),
  ]);

  const gestores = (gestoresRes.data ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    email: g.email,
    avatar_url: g.avatar_url,
  }));

  const perpetuos = (perpetuosRes.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <div className="flex flex-col gap-4">
      <GestorList gestores={gestores} perpetuos={perpetuos} />
    </div>
  );
}
