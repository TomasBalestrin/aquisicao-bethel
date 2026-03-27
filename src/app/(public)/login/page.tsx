import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Login — PerpetuoHQ",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[400px] rounded-lg border border-gray-200 bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-extrabold tracking-[-0.5px] text-navy-dark">
            PerpetuoHQ
          </h1>
          <p className="mt-2 text-sm text-navy-50">
            Entre com suas credenciais
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
