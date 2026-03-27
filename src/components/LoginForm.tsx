"use client";

import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { loginAction } from "@/actions/auth";
import { Mail, Lock } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md focus:outline-none focus:ring-[3px] focus:ring-gold-lightest disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export function LoginForm() {
  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData);
    if (!result.success && result.error) {
      toast.error(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[12.5px] font-semibold text-navy-70">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-30" strokeWidth={2} />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            className="w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white py-[10px] pl-10 pr-[14px] text-[13.5px] text-navy-dark outline-none transition-all placeholder:text-navy-30 focus:border-gold focus:ring-[3px] focus:ring-gold-lightest"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[12.5px] font-semibold text-navy-70">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-30" strokeWidth={2} />
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Digite sua senha"
            className="w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white py-[10px] pl-10 pr-[14px] text-[13.5px] text-navy-dark outline-none transition-all placeholder:text-navy-30 focus:border-gold focus:ring-[3px] focus:ring-gold-lightest"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
