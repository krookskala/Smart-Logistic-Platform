import { Courier } from "../../lib/api";
import AvailabilityPanel from "./availability-panel";
import CourierWorkloadOverview from "./courier-workload-overview";
import CourierSegmentedFilter, {
  CourierSegment
} from "./courier-segmented-filter";

type CourierSidebarProps = {
  courier: Courier | null;
  savingAvailability: boolean;
  selectedSegment: CourierSegment;
  shipmentsCount: number;
  readyNowCount: number;
  inTransitCount: number;
  completedCount: number;
  onSegmentChange: (value: CourierSegment) => void;
  onToggleAvailability: () => void;
};

export default function CourierSidebar({
  courier,
  savingAvailability,
  selectedSegment,
  shipmentsCount,
  readyNowCount,
  inTransitCount,
  completedCount,
  onSegmentChange,
  onToggleAvailability
}: CourierSidebarProps) {
  return (
    <aside className="space-y-4">
      <section className="courier-hero px-5 py-4 text-white md:px-6">
        <div className="relative z-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-teal-100/80">
            Courier Workspace
          </p>
          <h1 className="courier-display mt-3 text-[2.6rem] font-semibold leading-none">
            Delivery Console
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-100/85">
            Manage assigned deliveries, keep active routes progressing, and
            submit operational updates with confidence from one focused
            workspace.
          </p>
        </div>
      </section>

      <section className="courier-surface px-5 py-5">
        <div className="space-y-5">
          <AvailabilityPanel
            courier={courier}
            saving={savingAvailability}
            onToggle={onToggleAvailability}
          />

          <div>
            <p className="courier-label">Queue Views</p>
            <p className="courier-muted mt-2 text-sm leading-6">
              Switch between urgent handoffs, in-transit jobs, and completed
              deliveries without leaving the dashboard.
            </p>
            <div className="mt-3">
              <CourierSegmentedFilter
                value={selectedSegment}
                counts={{
                  ALL: shipmentsCount,
                  READY_NOW: readyNowCount,
                  IN_TRANSIT: inTransitCount,
                  COMPLETED: completedCount
                }}
                onChange={onSegmentChange}
              />
            </div>
          </div>
        </div>
      </section>

      <CourierWorkloadOverview
        courier={courier}
        shipmentsCount={shipmentsCount}
        readyNowCount={readyNowCount}
        inTransitCount={inTransitCount}
        completedCount={completedCount}
      />
    </aside>
  );
}
