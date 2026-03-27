"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface HeaderProps {
  userName: string;
  avatarUrl: string | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Header({ userName, avatarUrl }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <span className="hidden text-sm font-semibold text-navy-dark sm:block">
          {userName}
        </span>

        {/* Avatar */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={userName}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-navy-dark to-navy">
            <span className="text-xs font-bold text-gold">
              {getInitials(userName)}
            </span>
          </div>
        )}

        {/* Logout */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-md text-navy-50 transition-colors hover:bg-navy-05 hover:text-navy-dark"
            aria-label="Sair"
          >
            <LogOut size={18} strokeWidth={2} />
          </button>
        </form>
      </div>
    </header>
  );
}
