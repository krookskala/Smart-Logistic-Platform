import { Shipment } from "../../lib/api";
import ShipmentStatusBadge from "../shipment-status-badge";

type ShipmentListProps = {
  shipments: Shipment[];
  editingShipmentId: string | null;
  editForm: {
    title: string;
    description: string;
    pickupAddress: string;
    deliveryAddress: string;
  };
  savingShipmentId: string | null;
  cancellingShipmentId: string | null;
  onStartEdit: (shipment: Shipment) => void;
  onEditFormChange: (
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) => void;
  onSaveEdit: (shipmentId: string) => void;
  onCancelEdit: () => void;
  onCancelShipment: (shipmentId: string) => void;
};

export default function ShipmentList({
  shipments,
  editingShipmentId,
  editForm,
  savingShipmentId,
  cancellingShipmentId,
  onStartEdit,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
  onCancelShipment
}: ShipmentListProps) {
  return (
    <div className="space-y-5">
      {shipments.map((shipment) => (
        <div
          key={shipment.id}
          className="user-surface overflow-hidden px-5 py-5 md:px-6 md:py-5"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="user-label">Delivery Request</p>
                <span className="user-chip">
                  {new Date(shipment.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="user-display mt-2 text-[2.35rem] font-semibold leading-none text-stone-900">
                {shipment.title}
              </h2>
              <p className="user-muted mt-2 text-sm leading-6">
                {shipment.description || "No extra shipment notes were provided."}
              </p>
            </div>

            <ShipmentStatusBadge status={shipment.status} />
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[1.55fr_0.95fr]">
            <div className="rounded-[22px] border border-stone-200 bg-stone-50/75 p-4">
              <p className="user-label">Route</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="user-panel p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    Pickup
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {shipment.pickupAddress}
                  </p>
                </div>

                <div className="user-panel p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    Delivery
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {shipment.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-stone-200 bg-stone-50/75 p-4">
              <p className="user-label">Delivery Meta</p>
              <div className="mt-3 space-y-3">
                <div className="user-panel p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    Courier
                  </p>
                  <p className="mt-2 text-sm text-stone-700">
                    {shipment.assignedCourier?.user.email ?? "Not assigned yet"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="user-chip">ID {shipment.id.slice(0, 8)}</span>
                  <span className="user-chip">
                    {shipment.status === "CREATED"
                      ? "Editable"
                      : "Locked for edits"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              className="rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition hover:bg-stone-800"
              href={`/shipments/${shipment.id}`}
            >
              View tracking
            </a>
            <button
              type="button"
              onClick={() => onStartEdit(shipment)}
              disabled={shipment.status !== "CREATED"}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                shipment.status === "CREATED"
                  ? "border border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50"
                  : "border border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onCancelShipment(shipment.id)}
              disabled={
                cancellingShipmentId === shipment.id ||
                !["CREATED", "ASSIGNED"].includes(shipment.status)
              }
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                ["CREATED", "ASSIGNED"].includes(shipment.status)
                  ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border border-red-100 bg-red-50/70 text-red-300 cursor-not-allowed"
              } disabled:opacity-60`}
            >
              {cancellingShipmentId === shipment.id ? "Cancelling..." : "Cancel"}
            </button>
          </div>

          {editingShipmentId === shipment.id ? (
            <div className="mt-5 rounded-[24px] border border-stone-200 bg-white/90 p-5 shadow-inner">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="user-label">Inline Editor</p>
                  <h3 className="user-display mt-2 text-2xl font-semibold text-stone-900">
                    Edit shipment
                  </h3>
                </div>
                <p className="user-muted text-sm">
                  Editing stays available only while the shipment is still in the
                  created stage.
                </p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  className="rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
                  value={editForm.title}
                  onChange={(e) => onEditFormChange("title", e.target.value)}
                  placeholder="Title"
                />
                <input
                  className="rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
                  value={editForm.description}
                  onChange={(e) =>
                    onEditFormChange("description", e.target.value)
                  }
                  placeholder="Description"
                />
                <input
                  className="rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
                  value={editForm.pickupAddress}
                  onChange={(e) =>
                    onEditFormChange("pickupAddress", e.target.value)
                  }
                  placeholder="Pickup address"
                />
                <input
                  className="rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
                  value={editForm.deliveryAddress}
                  onChange={(e) =>
                    onEditFormChange("deliveryAddress", e.target.value)
                  }
                  placeholder="Delivery address"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onSaveEdit(shipment.id)}
                  disabled={savingShipmentId === shipment.id}
                  className="rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition hover:bg-stone-800 disabled:opacity-60"
                >
                  {savingShipmentId === shipment.id ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700"
                >
                  Close editor
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
