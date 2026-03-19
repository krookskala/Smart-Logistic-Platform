import { TrackingFormState } from "../../lib/types";

type TrackingUpdateFormProps = {
  form: TrackingFormState;
  submitting: boolean;
  onChange: (field: keyof TrackingFormState, value: string) => void;
  onSubmit: () => void;
};

export default function TrackingUpdateForm({
  form,
  submitting,
  onChange,
  onSubmit
}: TrackingUpdateFormProps) {
  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-800">
        Update Delivery Status
      </h3>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            value={form.status}
            onChange={(e) => onChange("status", e.target.value)}
          >
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Note</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            value={form.note}
            onChange={(e) => onChange("note", e.target.value)}
            placeholder="Optional delivery note"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Latitude</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            value={form.locationLat}
            onChange={(e) => onChange("locationLat", e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Longitude</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            value={form.locationLng}
            onChange={(e) => onChange("locationLng", e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {submitting ? "Updating..." : "Update Tracking"}
      </button>
    </div>
  );
}
