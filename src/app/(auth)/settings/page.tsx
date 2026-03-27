import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { SettingsForm } from "@/components/SettingsForm";

export const metadata = {
  title: "Configurações — PerpetuoHQ",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-bold tracking-[-0.5px] text-navy-dark">
        Configurações
      </h1>
      <SettingsForm name={user.name} email={user.email} avatarUrl={user.avatar_url} />
    </div>
  );
}
