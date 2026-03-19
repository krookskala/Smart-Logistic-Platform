export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f7f4] to-[#e7ece8]">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-[#6b6b6b]">
          Smart Logistics Platform
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-[#141414]">
          Real-time shipment tracking for modern delivery teams
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#3c3c3c]">
          This is the starter UI. We will add auth, shipments, courier
          dashboards, and live tracking next.
        </p>
        <div className="mt-8 flex gap-3">
          <span className="rounded-full border border-[#141414] px-4 py-2 text-sm">
            Next.js + TypeScript
          </span>
          <span className="rounded-full border border-[#141414] px-4 py-2 text-sm">
            NestJS + Prisma
          </span>
          <span className="rounded-full border border-[#141414] px-4 py-2 text-sm">
            Postgres + Socket.io
          </span>
        </div>
      </section>
    </main>
  );
}
