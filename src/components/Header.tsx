"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface HeaderProps {
  userName: string;
  avatarUrl: string | null;
}

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export function Header({ userName, avatarUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-gray-200 bg-white/85 px-12 backdrop-blur-[16px]">
      <div />
      <div className="flex items-center gap-3">
        <span className="hidden text-[13px] font-semibold text-navy-dark sm:block">
          {userName}
        </span>

        {avatarUrl ? (
          <Image src={avatarUrl} alt={userName} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-navy-dark to-navy">
            <span className="text-xs font-bold text-gold">{getInitials(userName)}</span>
          </div>
        )}

        <form action={logoutAction}>
          <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-[6px] text-navy-50 transition-colors hover:bg-navy-05 hover:text-navy-dark" aria-label="Sair">
            <LogOut size={18} strokeWidth={2} />
          </button>
        </form>
      </div>
    </header>
  );
}
