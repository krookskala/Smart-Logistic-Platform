import ShipmentStatusBadge from "../shipment-status-badge";
import { ShipmentUpdate } from "../../lib/types";

type CurrentStatusCardProps = {
  lastEvent: ShipmentUpdate | null;
};

export default function CurrentStatusCard({
  lastEvent
}: CurrentStatusCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Current Status</h2>

      {lastEvent ? (
        <div className="mt-4 space-y-3">
          <ShipmentStatusBadge status={lastEvent.status} />

          <div className="text-sm text-gray-700">
            <div>
              <span className="font-medium">Location:</span>{" "}
              {lastEvent.locationLat ?? "-"}, {lastEvent.locationLng ?? "-"}
            </div>
            <div>
              <span className="font-medium">Shipment ID:</span>{" "}
              {lastEvent.shipmentId}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-gray-500">Waiting for updates...</p>
      )}
    </div>
  );
}
