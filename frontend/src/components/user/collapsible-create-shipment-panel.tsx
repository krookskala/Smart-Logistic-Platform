import CreateShipmentForm from "./create-shipment-form";

type CreateShipmentFormState = {
  title: string;
  description: string;
  pickupAddress: string;
  deliveryAddress: string;
};

type CollapsibleCreateShipmentPanelProps = {
  form: CreateShipmentFormState;
  isOpen: boolean;
  submitting: boolean;
  onToggle: () => void;
  onChange: (
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CollapsibleCreateShipmentPanel({
  form,
  isOpen,
  submitting,
  onToggle,
  onChange,
  onSubmit
}: CollapsibleCreateShipmentPanelProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-stone-200 bg-white/78 shadow-[0_18px_40px_rgba(51,47,38,0.06)] backdrop-blur">
      <div className="flex flex-col gap-4 px-5 py-5 md:px-6">
        <div>
          <p className="user-label">New Shipment</p>
          <h2 className="user-display mt-2 text-2xl font-semibold text-stone-900">
            Create a new shipment request
          </h2>
          <p className="user-muted mt-2 text-sm leading-6">
            Open the form only when you need it, then submit a shipment with the
            pickup and delivery details required for dispatch.
          </p>
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition hover:bg-stone-800"
          >
            {isOpen ? "Hide Form" : "Create Shipment"}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-stone-200/80 px-4 pb-4 md:px-5 md:pb-5">
          <CreateShipmentForm
            form={form}
            submitting={submitting}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
      ) : null}
    </section>
  );
}
