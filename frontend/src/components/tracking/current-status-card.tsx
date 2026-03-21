import ShipmentStatusBadge from "../shipment-status-badge";
import { ShipmentUpdate } from "../../lib/types";

type CurrentStatusCardProps = {
  lastEvent: ShipmentUpdate | null;
};

export default function CurrentStatusCard({
  lastEvent
}: CurrentStatusCardProps) {
  return (
    <div className="user-surface p-6 md:p-7">
      <p className="user-label">Current Status</p>
      <h2 className="user-display mt-3 text-3xl font-semibold text-stone-900">
        What happened most recently
      </h2>

      {lastEvent ? (
        <div className="mt-6 space-y-5">
          <ShipmentStatusBadge status={lastEvent.status} />

          <p className="text-sm text-stone-600">
            {lastEvent.createdAt
              ? new Date(lastEvent.createdAt).toLocaleString()
              : "Timestamp unavailable"}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="user-panel p-4">
              <p className="user-label">Delivery Note</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                {lastEvent.note || "No note provided"}
              </p>
            </div>

            <div className="user-panel p-4">
              <p className="user-label">Shipment ID</p>
              <p className="mt-2 break-all text-sm text-stone-700">
                {lastEvent.shipmentId}
              </p>
            </div>
          </div>

          <div className="user-panel p-4">
            <p className="user-label">Coordinates</p>
            <p className="mt-2 text-sm text-stone-700">
              {lastEvent.locationLat ?? "-"}, {lastEvent.locationLng ?? "-"}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[24px] border border-dashed border-stone-300 bg-stone-50/70 p-6">
          <p className="text-base font-semibold text-stone-900">
            Waiting for the first courier update
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            As soon as the courier changes the shipment status, this card will
            surface the latest timestamp, note, and coordinates here.
          </p>
        </div>
      )}
    </div>
  );
}
