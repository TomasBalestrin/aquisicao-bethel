import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getPerpetuos } from "@/actions/perpetuos";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata = {
  title: "Dashboard — PerpetuoHQ",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const result = await getPerpetuos();
  const perpetuos = (result.data ?? []).map((p) => ({ id: p.id, name: p.name }));

  return <DashboardClient perpetuos={perpetuos} />;
}
