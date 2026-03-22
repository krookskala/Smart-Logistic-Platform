import { Courier } from "../../lib/api";

type AvailabilityPanelProps = {
  courier: Courier | null;
  saving: boolean;
  onToggle: () => void;
};

export default function AvailabilityPanel({
  courier,
  saving,
  onToggle
}: AvailabilityPanelProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50/90">
      <div className="flex flex-col gap-4 px-5 py-5">
        <div>
          <p className="courier-label">Availability</p>
          <h2 className="courier-display mt-2 text-2xl font-semibold text-slate-900">
            New assignment status
          </h2>
          <p className="courier-muted mt-2 text-sm leading-6">
            Let dispatch know whether you are ready to receive additional
            delivery assignments while keeping your current queue visible.
          </p>
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={onToggle}
            disabled={!courier || saving}
            className={`rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition disabled:opacity-60 ${
              courier?.availability
                ? "bg-emerald-600 shadow-emerald-600/15 hover:bg-emerald-500"
                : "bg-slate-900 shadow-slate-900/10 hover:bg-slate-800"
            }`}
          >
            {saving
              ? "Saving..."
              : courier?.availability
                ? "Mark as unavailable"
                : "Mark as available"}
          </button>
        </div>
      </div>

      {courier ? (
        <div className="border-t border-stone-200/80 px-5 py-5">
          <div className="space-y-3">
            <div className="courier-panel p-4">
              <p className="courier-label">Courier Account</p>
              <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                {courier.user.email}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="courier-panel p-4">
                <p className="courier-label">Vehicle</p>
                <p className="mt-2 text-sm text-slate-700">
                  {courier.vehicleType ?? "Vehicle not specified"}
                </p>
              </div>

              <div className="courier-panel p-4">
                <p className="courier-label">Assigned Shipments</p>
                <p className="mt-2 text-sm text-slate-700">
                  {courier._count?.shipments ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
