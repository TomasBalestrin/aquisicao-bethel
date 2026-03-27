"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Infinity,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";
import type { UserRole } from "@/types/database";

interface SidebarProps {
  currentPath: string;
  userName: string;
  userRole: UserRole;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/perpetuos", label: "Perpétuos", icon: Infinity },
  { href: "/gestores", label: "Gestores", icon: Users },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botao mobile */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-md bg-navy-dark p-2 text-white lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-navy-dark transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header da sidebar */}
        <div className="flex items-center justify-between px-6 py-6">
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            PerpetuoHQ
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Navegacao */}
        <nav className="flex-1 px-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-gold"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer da sidebar */}
        <div className="border-t border-white/10 px-6 py-4">
          <p className="truncate text-sm font-semibold text-white">{userName}</p>
          <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-gold">
            {userRole === "head" ? "Head de Tráfego" : "Gestor"}
          </p>
        </div>
      </aside>
    </>
  );
}
