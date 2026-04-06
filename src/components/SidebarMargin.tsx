"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "sidebar-collapsed";

export function SidebarMargin({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<{ collapsed: boolean }>).detail;
      setCollapsed(detail.collapsed);
    }
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  return (
    <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"}`}>
      {children}
    </div>
  );
}
