export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-navy-dark">
        PerpetuoHQ
      </h1>
      <p className="text-lg text-navy-50">
        Sistema de gestão de perpétuos para tráfego pago
      </p>
      <div className="flex gap-3">
        <span className="rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-white">
          Gold
        </span>
        <span className="rounded-full bg-navy-dark px-4 py-1.5 text-sm font-semibold text-white">
          Navy
        </span>
        <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-navy-dark">
          White
        </span>
      </div>
      <p className="font-mono text-sm text-navy-30">
        R$ 1.234,56
      </p>
    </main>
  );
}
