import { Shipment } from "../../lib/api";
import TrackingUpdateForm from "./tracking-update-form";
import ShipmentStatusBadge from "../shipment-status-badge";
import { TrackingFormState } from "../../lib/types";

type AssignedShipmentsListProps = {
  shipments: Shipment[];
  submittingId: string | null;
  getTrackingForm: (shipmentId: string) => TrackingFormState;
  onTrackingFormChange: (
    shipmentId: string,
    field: keyof TrackingFormState,
    value: string
  ) => void;
  onTrackingSubmit: (shipmentId: string) => void;
};

export default function AssignedShipmentsList({
  shipments,
  submittingId,
  getTrackingForm,
  onTrackingFormChange,
  onTrackingSubmit
}: AssignedShipmentsListProps) {
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

          <p className="mt-2 text-sm text-gray-700">
            {shipment.pickupAddress} {"->"} {shipment.deliveryAddress}
          </p>

          <a
            href={`/shipments/${shipment.id}`}
            className="mt-3 inline-block text-sm text-blue-700 underline"
          >
            View tracking
          </a>

          <TrackingUpdateForm
            form={getTrackingForm(shipment.id)}
            submitting={submittingId === shipment.id}
            onChange={(field, value) =>
              onTrackingFormChange(shipment.id, field, value)
            }
            onSubmit={() => onTrackingSubmit(shipment.id)}
          />
        </div>
      ))}
    </div>
  );
}
