import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { SidebarMargin } from "@/components/SidebarMargin";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar userName={user.name} userRole={user.role} />
      <SidebarMargin>
        <Header userName={user.name} avatarUrl={user.avatar_url} />
        <main className="flex-1 bg-gray-50 p-12">
          {children}
        </main>
      </SidebarMargin>
    </div>
  );
}
