import { Courier, Shipment } from "../../lib/api";
import ShipmentStatusBadge from "../shipment-status-badge";

type ShipmentAssignmentPanelProps = {
  shipments: Shipment[];
  couriers: Courier[];
  selectedCouriers: Record<string, string>;
  assigningId: string | null;
  onSelectCourier: (shipmentId: string, courierId: string) => void;
  onAssignCourier: (shipmentId: string) => void;
};

export default function ShipmentAssignmentPanel({
  shipments,
  couriers,
  selectedCouriers,
  assigningId,
  onSelectCourier,
  onAssignCourier
}: ShipmentAssignmentPanelProps) {
  return (
    <div className="admin-surface p-6 md:p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="admin-label">Dispatch Queue</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Coordinate shipment assignment and courier coverage
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Review shipment ownership, assign the right courier, and keep the
            active queue progressing without delay.
          </p>
        </div>
        <div className="admin-chip">{shipments.length} queue items</div>
      </div>

      {shipments.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No shipment currently matches the dispatch filters.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="admin-panel p-5 md:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="admin-label">Shipment Request</p>
                    <div className="admin-chip text-xs">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">
                    {shipment.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {shipment.pickupAddress} {"->"} {shipment.deliveryAddress}
                  </p>
                </div>

                <ShipmentStatusBadge status={shipment.status} />
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.9fr]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="admin-label">Requested By</p>
                    <p className="mt-3 text-sm text-slate-700">
                      {shipment.createdBy?.email ?? shipment.createdById}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="admin-label">Current Courier</p>
                    <p className="mt-3 text-sm text-slate-700">
                      {shipment.assignedCourier?.user.email ?? "Unassigned"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-sky-200 bg-sky-50/85 px-4 py-4 text-slate-950">
                  <p className="admin-label text-sky-700">Dispatch Action</p>
                  <p className="mt-3 text-sm text-slate-700">
                    Choose a courier and confirm who will take responsibility
                    for the next delivery step.
                  </p>

                  <div className="mt-4 flex flex-col gap-3">
                    <select
                      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-slate-950"
                      value={selectedCouriers[shipment.id] || ""}
                      onChange={(e) =>
                        onSelectCourier(shipment.id, e.target.value)
                      }
                    >
                      <option value="">Select courier</option>
                      {couriers.map((courier) => (
                        <option
                          key={courier.id}
                          value={courier.id}
                          disabled={!courier.availability}
                        >
                          {courier.user.email}
                          {courier.vehicleType
                            ? ` (${courier.vehicleType})`
                            : ""}
                          {courier.availability === false
                            ? " [Unavailable]"
                            : ""}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => onAssignCourier(shipment.id)}
                      disabled={
                        assigningId === shipment.id ||
                        !selectedCouriers[shipment.id]
                      }
                      className="rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-60"
                    >
                      {assigningId === shipment.id
                        ? "Assigning..."
                        : "Assign Courier"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
