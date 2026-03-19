import { Shipment } from "../../lib/api";
import ShipmentStatusBadge from "../shipment-status-badge";

type ShipmentListProps = {
  shipments: Shipment[];
};

export default function ShipmentList({ shipments }: ShipmentListProps) {
  return (
    <div className="mt-6 space-y-4">
      {shipments.map((shipment) => (
        <div
          key={shipment.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{shipment.title}</h2>

            <ShipmentStatusBadge status={shipment.status} />
          </div>

          <a
            className="mt-3 inline-block text-sm text-blue-700 underline"
            href={`/shipments/${shipment.id}`}
          >
            View tracking
          </a>

          <p className="mt-2 text-sm text-gray-700">
            {shipment.pickupAddress} {"->"} {shipment.deliveryAddress}
          </p>
        </div>
      ))}
    </div>
  );
}
