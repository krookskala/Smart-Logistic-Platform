import Link from "next/link";

type LandingHeroProps = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
};

export default function LandingHero({
  primaryHref,
  primaryLabel,
  secondaryHref
}: LandingHeroProps) {
  const stack = [
    "Next.js + TypeScript",
    "NestJS + Prisma",
    "PostgreSQL + Socket.IO"
  ];

  return (
    <section className="landing-hero px-8 py-10 md:px-12 md:py-14">
      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.55fr_0.85fr] lg:items-start">
        <div>
          <p className="landing-label">Smart Logistics Platform</p>
          <h1 className="landing-display mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] text-slate-950 md:text-6xl">
            Real-time shipment operations for teams that need visibility,
            control, and delivery flow in one place.
          </h1>
          <p className="landing-muted mt-6 max-w-3xl text-lg leading-8 md:text-xl">
            Smart Logistics unifies shipment requests, courier coordination,
            live tracking updates, and audit visibility in a role-aware platform
            built for modern logistics workflows.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Explore Platform
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {stack.map((item) => (
              <span key={item} className="landing-chip">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="landing-panel p-5">
            <p className="landing-label">Live Tracking</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">
              Operational shipment visibility stays clear from request creation
              through final delivery.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[26px] border border-emerald-200 bg-emerald-50/80 p-5">
              <p className="landing-label text-emerald-700">
                Role-Aware Workspaces
              </p>
              <p className="mt-3 text-sm leading-7 text-emerald-900">
                Dedicated workspaces for customers, couriers, and administrators
                keep each role focused on the right decisions.
              </p>
            </div>

            <div className="rounded-[26px] border border-sky-200 bg-sky-50/80 p-5">
              <p className="landing-label text-sky-700">Operational Trust</p>
              <p className="mt-3 text-sm leading-7 text-sky-900">
                Audit history, workflow validation, and structured feedback
                flows make operational changes easier to trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
