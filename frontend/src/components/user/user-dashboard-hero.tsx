type UserDashboardHeroProps = {
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  cancelledShipments: number;
};

export default function UserDashboardHero({
  totalShipments,
  activeShipments,
  deliveredShipments,
  cancelledShipments
}: UserDashboardHeroProps) {
  return (
    <section className="user-hero px-6 py-8 md:px-8 md:py-10">
      <div className="relative z-10 grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
        <div>
          <p className="user-label">Delivery Workspace</p>
          <h1 className="user-display mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">
            Shipments that feel organized, not overwhelming.
          </h1>
          <p className="user-muted mt-4 max-w-2xl text-base leading-7 md:text-lg">
            Create deliveries, keep an eye on active routes, and step into live
            tracking with a cleaner, faster workspace.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="user-chip">Live status tracking</span>
            <span className="user-chip">Inline edit controls</span>
            <span className="user-chip">Quick shipment filtering</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <div className="user-surface px-5 py-5">
            <p className="user-label">Total Shipments</p>
            <p className="mt-3 text-3xl font-semibold text-stone-900">
              {totalShipments}
            </p>
            <p className="user-muted mt-2 text-sm">
              Everything currently visible in your account.
            </p>
          </div>

          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/90 px-5 py-5 shadow-sm">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Active Queue
            </p>
            <p className="mt-3 text-3xl font-semibold text-emerald-950">
              {activeShipments}
            </p>
            <p className="mt-2 text-sm text-emerald-900">
              Shipments still moving through delivery stages.
            </p>
          </div>

          <div className="user-surface px-5 py-5">
            <p className="user-label">Delivered</p>
            <p className="mt-3 text-3xl font-semibold text-stone-900">
              {deliveredShipments}
            </p>
            <p className="user-muted mt-2 text-sm">
              Completed handoffs you can review anytime.
            </p>
          </div>

          <div className="user-surface px-5 py-5">
            <p className="user-label">Cancelled</p>
            <p className="mt-3 text-3xl font-semibold text-stone-900">
              {cancelledShipments}
            </p>
            <p className="user-muted mt-2 text-sm">
              Closed requests that no longer need attention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
