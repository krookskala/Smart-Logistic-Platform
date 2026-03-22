import { ShipmentUpdate } from "../../lib/types";

type TrackingHistoryListProps = {
  events: ShipmentUpdate[];
};

export default function TrackingHistoryList({
  events
}: TrackingHistoryListProps) {
  return (
    <div className="user-surface p-6 md:p-7">
      <p className="user-label">Activity Feed</p>
      <h2 className="user-display mt-3 text-3xl font-semibold text-stone-900">
        Timeline of delivery updates
      </h2>

      {events.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-stone-300 bg-stone-50/70 p-6">
          <p className="text-sm leading-6 text-stone-600">
            No courier events have been recorded yet.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4 text-sm text-stone-700">
          {events.map((event, index) => (
            <li
              key={event.id ?? `${event.shipmentId}-${index}`}
              className="relative pl-8"
            >
              <span className="absolute left-[0.4rem] top-3 h-3 w-3 rounded-full bg-stone-900"></span>
              {index !== events.length - 1 ? (
                <span className="absolute left-[0.74rem] top-6 h-[calc(100%+0.75rem)] w-px bg-stone-200"></span>
              ) : null}

              <div className="rounded-[24px] border border-stone-200 bg-stone-50/75 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-900">
                      {event.status.replace("_", " ")}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {event.createdAt
                        ? new Date(event.createdAt).toLocaleString()
                        : "Timestamp unavailable"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                    <span className="user-chip">
                      Lat {event.locationLat ?? "-"}
                    </span>
                    <span className="user-chip">
                      Lng {event.locationLng ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 user-panel p-4">
                  <p className="user-label">Courier Note</p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {event.note || "No note provided"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
