"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Infinity, Users, Settings,
  Menu, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import type { UserRole } from "@/types/database";

interface SidebarProps {
  userName: string;
  userRole: UserRole;
}

const allNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, headOnly: false },
  { href: "/perpetuos", label: "Perpétuos", icon: Infinity, headOnly: false },
  { href: "/gestores", label: "Gestores", icon: Users, headOnly: true },
  { href: "/settings", label: "Configurações", icon: Settings, headOnly: true },
];

const STORAGE_KEY = "sidebar-collapsed";

export function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: { collapsed } }));
  }, [collapsed]);

  const navItems = userRole === "head"
    ? allNavItems
    : allNavItems.filter((i) => !i.headOnly);

  const w = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="fixed left-4 top-5 z-50 rounded-md bg-navy-dark p-2 text-white lg:hidden" aria-label="Menu">
        <Menu size={20} strokeWidth={2} />
      </button>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex ${w} flex-col border-r border-gold/15 bg-navy-dark transition-all duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between px-7 pt-8 pb-10">
          {!collapsed && (
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.3px] text-white">PerpetuoHQ</h2>
              <span className="mt-1 block text-[11px] font-medium uppercase tracking-[2px] text-gold">gestão de tráfego</span>
            </div>
          )}
          <button onClick={() => { if (mobileOpen) setMobileOpen(false); else setCollapsed(!collapsed); }} className="hidden text-white/40 transition-colors hover:text-white lg:block" aria-label="Recolher">
            {collapsed ? <ChevronsRight size={18} strokeWidth={2} /> : <ChevronsLeft size={18} strokeWidth={2} />}
          </button>
        </div>

        <nav className="flex-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 border-l-[3px] px-7 py-[11px] text-[13.5px] font-medium transition-all ${
                  isActive ? "border-gold bg-gold/[0.08] text-white" : "border-transparent text-white/55 hover:bg-gold/[0.08] hover:text-white"
                }`}>
                <Icon size={18} strokeWidth={2} className={isActive ? "opacity-100" : "opacity-70"} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-white/[0.08] px-7 py-4">
            <p className="truncate text-[13px] font-semibold text-white">{userName}</p>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-gold">
              {userRole === "head" ? "Head de Tráfego" : "Gestor"}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
