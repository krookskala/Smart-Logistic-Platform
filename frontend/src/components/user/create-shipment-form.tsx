type CreateShipmentFormProps = {
  form: {
    title: string;
    description: string;
    pickupAddress: string;
    deliveryAddress: string;
  };
  submitting: boolean;
  onChange: (
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CreateShipmentForm({
  form,
  submitting,
  onChange,
  onSubmit
}: CreateShipmentFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 rounded-[24px] border border-stone-200 bg-white/80 p-5 shadow-sm md:p-6"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="user-label">Delivery Details</p>
          <h3 className="user-display mt-2 text-2xl font-semibold text-stone-900">
            Create shipment
          </h3>
        </div>
        <p className="user-muted text-sm">
          Keep addresses clear so tracking stays precise for courier and admin.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-stone-700">Title</label>
          <input
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Weekend grocery delivery"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            Description
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Optional instructions or package notes"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            Pickup Address
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
            value={form.pickupAddress}
            onChange={(e) => onChange("pickupAddress", e.target.value)}
            placeholder="Warehouse, shop, or sender address"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            Delivery Address
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
            value={form.deliveryAddress}
            onChange={(e) => onChange("deliveryAddress", e.target.value)}
            placeholder="Recipient destination address"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition hover:bg-stone-800 disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Shipment"}
      </button>
    </form>
  );
}
