import { Shipment } from "../../lib/api";
import ShipmentStatusBadge from "../shipment-status-badge";

type TrackingHeroProps = {
  shipment: Shipment | null;
};

export default function TrackingHero({ shipment }: TrackingHeroProps) {
  return (
    <section className="user-hero px-6 py-8 md:px-8 md:py-10">
      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="user-label">Live Tracking</p>
          <h1 className="user-display mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">
            {shipment?.title || "Shipment Tracking"}
          </h1>
          <p className="user-muted mt-3 max-w-2xl text-base leading-7 md:text-lg">
            Review current progress, watch activity updates arrive in real time,
            and keep your delivery context in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {shipment?.status ? (
            <ShipmentStatusBadge status={shipment.status} />
          ) : (
            <span className="user-chip">Status loading</span>
          )}
          <span className="user-chip">
            {shipment?.assignedCourier?.user.email ?? "Courier pending"}
          </span>
          {shipment?.createdAt ? (
            <span className="user-chip">
              Created {new Date(shipment.createdAt).toLocaleDateString()}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
