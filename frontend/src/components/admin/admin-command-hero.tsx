type AdminCommandHeroProps = {
  activeShipments: number;
  pendingAssignments: number;
  usersCount: number;
};

export default function AdminCommandHero({
  activeShipments,
  pendingAssignments,
  usersCount
}: AdminCommandHeroProps) {
  return (
    <section className="admin-hero px-8 py-8 text-slate-950 md:px-10 md:py-10">
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
        <div>
          <p className="admin-label">Operations Command Center</p>
          <h1 className="admin-display mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            Keep shipment flow, dispatch coverage, and account operations
            aligned from one operational dashboard.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Review network activity, resolve assignment gaps, manage access
            changes, and trace operational events without losing context across
            the platform.
          </p>
          <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700">
            Live operational summary
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-5">
            <p className="admin-label">Active Queue</p>
            <p className="mt-3 text-3xl font-semibold">{activeShipments}</p>
            <p className="mt-2 text-sm text-slate-600">
              Deliveries currently moving through active workflow stages.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5">
            <p className="admin-label text-amber-700">Pending Dispatch</p>
            <p className="mt-3 text-3xl font-semibold">{pendingAssignments}</p>
            <p className="mt-2 text-sm text-amber-800">
              Shipment requests still waiting for courier assignment.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-200 bg-sky-50/85 p-5">
            <p className="admin-label text-sky-700">Managed Accounts</p>
            <p className="mt-3 text-3xl font-semibold">{usersCount}</p>
            <p className="mt-2 text-sm text-sky-800">
              User and courier accounts currently under administration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
