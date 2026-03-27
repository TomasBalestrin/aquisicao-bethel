import { getPerpetuos } from "@/actions/perpetuos";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { PerpetuoList } from "@/components/perpetuos/PerpetuoList";

export const metadata = {
  title: "Perpétuos — PerpetuoHQ",
};

export default async function PerpetuosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const result = await getPerpetuos();
  const perpetuos = result.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <PerpetuoList perpetuos={perpetuos} isHead={user.role === "head"} />
    </div>
  );
}
