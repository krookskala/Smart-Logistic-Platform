import { Shipment } from "../../lib/api";
import TrackingUpdateForm from "./tracking-update-form";
import ShipmentStatusBadge from "../shipment-status-badge";
import { TrackingFormState } from "../../lib/types";
import DeliveryStageStrip from "./delivery-stage-strip";

type AssignedShipmentsListProps = {
  shipments: Shipment[];
  submittingId: string | null;
  getTrackingForm: (
    shipmentId: string,
    currentStatus: string
  ) => TrackingFormState;
  onTrackingFormChange: (
    shipmentId: string,
    currentStatus: string,
    field: keyof TrackingFormState,
    value: string
  ) => void;
  onTrackingSubmit: (shipmentId: string, currentStatus: string) => void;
};

export default function AssignedShipmentsList({
  shipments,
  submittingId,
  getTrackingForm,
  onTrackingFormChange,
  onTrackingSubmit
}: AssignedShipmentsListProps) {
  const sortedShipments = [...shipments].sort((left, right) => {
    const priority: Record<string, number> = {
      ASSIGNED: 0,
      PICKED_UP: 1,
      IN_TRANSIT: 2,
      DELIVERED: 3,
      CANCELLED: 4
    };

    return (
      (priority[left.status] ?? 99) - (priority[right.status] ?? 99)
    );
  });

  function getNextAction(status: string) {
    if (status === "ASSIGNED") {
      return {
        title: "Next step: confirm pickup",
        description:
          "Begin this delivery by confirming that the package has been collected."
      };
    }

    if (status === "PICKED_UP") {
      return {
        title: "Next step: mark as in transit",
        description:
          "The package is already with you. Move the delivery into the transit stage."
      };
    }

    if (status === "IN_TRANSIT") {
      return {
        title: "Next step: complete delivery",
        description:
          "Add a delivery note and confirm completion once the handoff has been finished."
      };
    }

    if (status === "DELIVERED") {
      return {
        title: "Delivery completed",
        description:
          "This shipment has been completed and no further courier action is required."
      };
    }

    return {
      title: "Delivery closed",
      description: "This shipment is no longer active in the delivery queue."
    };
  }

  return (
    <div className="space-y-5">
      {sortedShipments.map((shipment) => {
        const nextAction = getNextAction(shipment.status);

        return (
          <div
            key={shipment.id}
            className="courier-surface overflow-hidden px-5 py-5 md:px-6 md:py-5"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="courier-label">Assigned Delivery</p>
                  <span className="courier-chip">
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="courier-display mt-2 text-[2.15rem] font-semibold leading-none text-slate-900">
                  {shipment.title}
                </h2>
                <p className="courier-muted mt-2 text-sm leading-6">
                  Requested by {shipment.createdBy?.email ?? shipment.createdById}
                </p>
              </div>

              <ShipmentStatusBadge status={shipment.status} />
            </div>

            <DeliveryStageStrip status={shipment.status} />

            <div className="mt-4 rounded-[22px] border border-slate-900/10 bg-slate-900 px-4 py-4 text-white shadow-lg shadow-slate-900/10">
              <p className="text-sm font-semibold">{nextAction.title}</p>
              <p className="mt-1 text-sm text-slate-200">
                {nextAction.description}
              </p>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-[1.55fr_0.95fr]">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="courier-label">Route</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="courier-panel p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Pickup
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {shipment.pickupAddress}
                    </p>
                  </div>

                  <div className="courier-panel p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Dropoff
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {shipment.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="courier-label">Delivery Meta</p>
                <div className="mt-3 space-y-3">
                  <div className="courier-panel p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Customer
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {shipment.createdBy?.email ?? "Unknown"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="courier-chip">ID {shipment.id.slice(0, 8)}</span>
                    <span className="courier-chip">
                      {shipment.status === "IN_TRANSIT"
                        ? "Final delivery stage"
                        : shipment.status === "PICKED_UP"
                        ? "Package collected"
                        : shipment.status === "ASSIGNED"
                        ? "Awaiting pickup confirmation"
                        : "Closed delivery"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {shipment.status !== "DELIVERED" && shipment.status !== "CANCELLED" ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={`/shipments/${shipment.id}`}
                className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                View tracking details
              </a>
            </div>
          ) : null}

            <TrackingUpdateForm
              form={getTrackingForm(shipment.id, shipment.status)}
              currentStatus={shipment.status}
              submitting={submittingId === shipment.id}
              onChange={(field, value) =>
                onTrackingFormChange(shipment.id, shipment.status, field, value)
              }
              onSubmit={() => onTrackingSubmit(shipment.id, shipment.status)}
            />
          </div>
        );
      })}
    </div>
  );
}
