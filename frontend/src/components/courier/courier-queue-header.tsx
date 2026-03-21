import { CourierSegment } from "./courier-segmented-filter";

type CourierQueueHeaderProps = {
  selectedSegment: CourierSegment;
  visibleShipmentsCount: number;
  totalShipmentsCount: number;
};

function getSegmentLabel(segment: CourierSegment) {
  if (segment === "READY_NOW") {
    return "Ready Now";
  }

  if (segment === "IN_TRANSIT") {
    return "In Transit";
  }

  if (segment === "COMPLETED") {
    return "Completed";
  }

  return "All Deliveries";
}

export default function CourierQueueHeader({
  selectedSegment,
  visibleShipmentsCount,
  totalShipmentsCount
}: CourierQueueHeaderProps) {
  return (
    <div className="courier-surface px-6 py-4 md:px-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="courier-label">Assigned Queue</p>
          <h2 className="courier-display mt-2 text-[1.95rem] font-semibold leading-none text-slate-900">
            Active deliveries and status updates
          </h2>
          <p className="courier-muted mt-2 text-sm leading-6">
            Review the next required action, keep status updates flowing, and
            focus on the deliveries that require attention right now.
          </p>
        </div>
        <p className="courier-muted text-sm md:text-right">
          Showing {visibleShipmentsCount} of {totalShipmentsCount} deliveries
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="courier-chip">{getSegmentLabel(selectedSegment)}</span>
      </div>
    </div>
  );
}
