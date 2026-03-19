import { ShipmentUpdate } from "../../lib/types";

type TrackingHistoryListProps = {
  events: ShipmentUpdate[];
};

export default function TrackingHistoryList({
  events
}: TrackingHistoryListProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Last 5 Updates</h2>

      {events.length === 0 ? (
        <p className="mt-3 text-gray-500">No events yet.</p>
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-gray-700">
          {events.map((event, index) => (
            <li
              key={`${event.shipmentId}-${index}`}
              className="flex items-center gap-3"
            >
              <span className="h-2 w-2 rounded-full bg-gray-400"></span>
              <span className="font-medium">{event.status}</span>
              <span className="text-gray-500">
                ({event.locationLat ?? "-"}, {event.locationLng ?? "-"})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
