import { Courier } from "../../lib/api";

type CourierWorkloadOverviewProps = {
  courier: Courier | null;
  shipmentsCount: number;
  readyNowCount: number;
  inTransitCount: number;
  completedCount: number;
};

export default function CourierWorkloadOverview({
  courier,
  shipmentsCount,
  readyNowCount,
  inTransitCount,
  completedCount
}: CourierWorkloadOverviewProps) {
  return (
    <section className="courier-surface px-5 py-5 md:px-6">
      <div className="relative z-10">
        <p className="courier-label">Queue Snapshot</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <p className="courier-label">Total</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {shipmentsCount}
            </p>
          </div>

          <div className="rounded-[24px] border border-amber-200 bg-amber-50/90 px-4 py-4 shadow-sm">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-amber-700">
              Ready Now
            </p>
            <p className="mt-2 text-2xl font-semibold text-amber-950">
              {readyNowCount}
            </p>
          </div>

          <div className="rounded-[24px] border border-blue-200 bg-blue-50/90 px-4 py-4 shadow-sm">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-blue-700">
              In Transit
            </p>
            <p className="mt-2 text-2xl font-semibold text-blue-950">
              {inTransitCount}
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <p className="courier-label">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {completedCount}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-[20px] border border-dashed border-slate-300 bg-slate-50/90 p-4">
          <p className="courier-muted text-sm leading-6">
            {courier?.availability
              ? "You are currently available for new assignments when dispatch adds more work."
              : "You are currently unavailable for new assignments, but your existing delivery queue remains visible here."}
          </p>
        </div>
      </div>
    </section>
  );
}
