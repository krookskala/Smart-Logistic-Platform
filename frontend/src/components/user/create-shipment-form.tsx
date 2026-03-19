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
      className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Create Shipment</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Pickup Address</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            value={form.pickupAddress}
            onChange={(e) => onChange("pickupAddress", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Delivery Address</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            value={form.deliveryAddress}
            onChange={(e) => onChange("deliveryAddress", e.target.value)}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Shipment"}
      </button>
    </form>
  );
}
