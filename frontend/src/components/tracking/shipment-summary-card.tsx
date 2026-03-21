import { Shipment } from "../../lib/api";
import ShipmentStatusBadge from "../shipment-status-badge";

type ShipmentSummaryCardProps = {
  shipment: Shipment | null;
};

export default function ShipmentSummaryCard({
  shipment
}: ShipmentSummaryCardProps) {
  return (
    <div className="user-surface p-6 md:p-7">
      <p className="user-label">Shipment Summary</p>
      <h2 className="user-display mt-3 text-3xl font-semibold text-stone-900">
        Delivery context at a glance
      </h2>

      {!shipment ? (
        <p className="mt-4 text-sm text-stone-500">Loading shipment details...</p>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-lg font-semibold text-stone-900">
                {shipment.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {shipment.description || "No description provided."}
              </p>
            </div>

            <ShipmentStatusBadge status={shipment.status} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="user-panel p-4">
              <p className="user-label">Pickup</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                {shipment.pickupAddress}
              </p>
            </div>

            <div className="user-panel p-4">
              <p className="user-label">Delivery</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                {shipment.deliveryAddress}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="user-panel p-4">
              <p className="user-label">Created</p>
              <p className="mt-2 text-sm text-stone-700">
                {new Date(shipment.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="user-panel p-4">
              <p className="user-label">Shipment ID</p>
              <p className="mt-2 break-all text-sm text-stone-700">
                {shipment.id}
              </p>
            </div>

            <div className="user-panel p-4">
              <p className="user-label">Assigned Courier</p>
              <p className="mt-2 text-sm text-stone-700">
                {shipment.assignedCourier?.user.email ?? "Not assigned yet"}
              </p>
            </div>

            <div className="user-panel p-4">
              <p className="user-label">Created By</p>
              <p className="mt-2 text-sm text-stone-700">
                {shipment.createdBy?.email ?? shipment.createdById}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
