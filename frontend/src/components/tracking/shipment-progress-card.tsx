import { Shipment } from "../../lib/api";
import { ShipmentUpdate } from "../../lib/types";

type ShipmentProgressCardProps = {
  shipment: Shipment | null;
  events: ShipmentUpdate[];
};

const STATUS_STEPS = ["CREATED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

function getStatusIndex(status?: string) {
  if (!status) {
    return -1;
  }

  return STATUS_STEPS.indexOf(status);
}

export default function ShipmentProgressCard({
  shipment,
  events
}: ShipmentProgressCardProps) {
  const currentStatus = shipment?.status;
  const currentStepIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === "CANCELLED";

  return (
    <div className="user-surface p-6 md:p-7">
      <p className="user-label">Delivery Progress</p>
      <h2 className="user-display mt-3 text-3xl font-semibold text-stone-900">
        Stage-by-stage movement
      </h2>

      {!shipment ? (
        <p className="mt-4 text-sm text-stone-500">Loading progress...</p>
      ) : isCancelled ? (
        <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-800">Shipment Cancelled</p>
          <p className="mt-2 text-sm leading-6 text-red-700">
            This delivery was cancelled before completion.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="grid gap-3">
            {STATUS_STEPS.map((step, index) => {
              const isComplete = currentStepIndex >= index;
              const isCurrent = currentStatus === step;

              return (
                <div
                  key={step}
                  className={`rounded-[22px] border p-4 transition ${
                    isCurrent
                      ? "border-stone-900 bg-stone-900 text-white shadow-lg shadow-stone-900/10"
                      : isComplete
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-stone-200 bg-stone-50/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={`text-sm font-semibold uppercase tracking-[0.12em] ${
                        isCurrent
                          ? "text-white"
                          : isComplete
                          ? "text-emerald-800"
                          : "text-stone-600"
                      }`}
                    >
                      {step.replace("_", " ")}
                    </p>
                    <span
                      className={`text-xs ${
                        isCurrent ? "text-stone-200" : "text-stone-500"
                      }`}
                    >
                      {isCurrent ? "Current" : isComplete ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="user-panel p-4">
              <p className="user-label">Updates Received</p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">
                {events.length}
              </p>
            </div>

            <div className="user-panel p-4">
              <p className="user-label">Current Stage</p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">
                {shipment.status.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
