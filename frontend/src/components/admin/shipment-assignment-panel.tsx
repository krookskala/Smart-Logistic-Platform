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
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Shipment Assignment</h2>
      <p className="mt-2 text-sm text-gray-600">
        Assign available couriers to active shipments.
      </p>

      {shipments.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No shipments available.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">{shipment.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {shipment.pickupAddress} {"->"} {shipment.deliveryAddress}
                  </p>
                </div>

                <ShipmentStatusBadge status={shipment.status} />
              </div>

              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 md:max-w-sm"
                  value={selectedCouriers[shipment.id] || ""}
                  onChange={(e) => onSelectCourier(shipment.id, e.target.value)}
                >
                  <option value="">Select courier</option>
                  {couriers.map((courier) => (
                    <option key={courier.id} value={courier.id}>
                      {courier.user.email}
                      {courier.vehicleType ? ` (${courier.vehicleType})` : ""}
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
                  className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
                >
                  {assigningId === shipment.id
                    ? "Assigning..."
                    : "Assign Courier"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
