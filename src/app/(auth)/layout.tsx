import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="" userName={user.name} userRole={user.role} />
      <div className="flex flex-1 flex-col lg:ml-[260px]">
        <Header userName={user.name} avatarUrl={user.avatar_url} />
        <main className="flex-1 bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
