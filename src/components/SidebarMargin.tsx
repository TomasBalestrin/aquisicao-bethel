"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "sidebar-collapsed";

export function SidebarMargin({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    function check() {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    }
    check();
    window.addEventListener("storage", check);
    const interval = setInterval(check, 300);
    return () => { window.removeEventListener("storage", check); clearInterval(interval); };
  }, []);

  return (
    <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"}`}>
      {children}
    </div>
  );
}
