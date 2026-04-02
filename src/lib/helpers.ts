import { getCurrentUser } from "@/actions/auth";
import type { ActionResponse } from "@/types/action";

export async function assertHead(): Promise<ActionResponse | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Acesso restrito ao Head" };
  }
  return null;
}

export function daysInMonth(mes: number, ano: number): number {
  return new Date(ano, mes, 0).getDate();
}
