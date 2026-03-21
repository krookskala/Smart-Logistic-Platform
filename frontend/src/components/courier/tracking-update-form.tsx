import { TrackingFormState } from "../../lib/types";

type TrackingUpdateFormProps = {
  form: TrackingFormState;
  currentStatus: string;
  submitting: boolean;
  onChange: (field: keyof TrackingFormState, value: string) => void;
  onSubmit: () => void;
};

function getNextStatusOptions(currentStatus: string) {
  if (currentStatus === "ASSIGNED") {
    return ["PICKED_UP"];
  }

  if (currentStatus === "PICKED_UP") {
    return ["IN_TRANSIT"];
  }

  if (currentStatus === "IN_TRANSIT") {
    return ["DELIVERED"];
  }

  return [];
}

export default function TrackingUpdateForm({
  form,
  currentStatus,
  submitting,
  onChange,
  onSubmit
}: TrackingUpdateFormProps) {
  const nextStatusOptions = getNextStatusOptions(currentStatus);
  const hasNextTransition = nextStatusOptions.length > 0;

  return (
    <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
      <p className="courier-label">Tracking Update</p>
      <h3 className="mt-2 text-base font-semibold text-slate-900">
        {hasNextTransition
          ? "Submit the next delivery update"
          : "No further courier update required"}
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Current workflow stage: {currentStatus.replace("_", " ")}
      </p>

      {hasNextTransition ? (
        <>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Next Status
              </label>
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                value={form.status}
                onChange={(e) => onChange("status", e.target.value)}
                disabled={!hasNextTransition}
              >
                {nextStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Delivery Note
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                value={form.note}
                onChange={(e) => onChange("note", e.target.value)}
                placeholder={
                  form.status === "DELIVERED"
                    ? "Required when completing delivery"
                    : "Optional courier note"
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Latitude
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                value={form.locationLat}
                onChange={(e) => onChange("locationLat", e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Longitude
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                value={form.locationLng}
                onChange={(e) => onChange("locationLng", e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || !hasNextTransition}
            className="mt-4 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit tracking update"}
          </button>
        </>
      ) : (
        <div className="mt-4 rounded-[18px] border border-dashed border-slate-300 bg-white/70 p-4">
          <p className="text-sm font-semibold text-slate-900">
            This delivery has already been completed.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            No further courier actions are available for this shipment.
          </p>
        </div>
      )}
    </div>
  );
}
