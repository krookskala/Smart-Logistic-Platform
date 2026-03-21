import CollapsibleCreateShipmentPanel from "./collapsible-create-shipment-panel";
import ShipmentSearchBar from "./shipment-search-bar";
import ShipmentSegmentedFilter, {
  ShipmentSegment
} from "./shipment-segmented-filter";

type CreateShipmentFormState = {
  title: string;
  description: string;
  pickupAddress: string;
  deliveryAddress: string;
};

type UserDashboardSidebarProps = {
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  cancelledShipments: number;
  selectedSegment: ShipmentSegment;
  searchQuery: string;
  createForm: CreateShipmentFormState;
  isCreatePanelOpen: boolean;
  submitting: boolean;
  onSegmentChange: (value: ShipmentSegment) => void;
  onSearchChange: (value: string) => void;
  onToggleCreatePanel: () => void;
  onCreateFormChange: (
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) => void;
  onCreateSubmit: (e: React.FormEvent) => void;
};

export default function UserDashboardSidebar({
  totalShipments,
  activeShipments,
  deliveredShipments,
  cancelledShipments,
  selectedSegment,
  searchQuery,
  createForm,
  isCreatePanelOpen,
  submitting,
  onSegmentChange,
  onSearchChange,
  onToggleCreatePanel,
  onCreateFormChange,
  onCreateSubmit
}: UserDashboardSidebarProps) {
  return (
    <aside className="space-y-4">
      <section className="user-surface px-5 py-5">
        <div className="space-y-5">
          <div>
            <p className="user-label">Customer Workspace</p>
            <h1 className="user-display mt-2 text-3xl font-semibold text-stone-900">
              My Shipments
            </h1>
            <p className="user-muted mt-2 text-sm leading-6">
              Manage new requests, review shipment status, and keep active
              deliveries in focus from one place.
            </p>
          </div>

          <CollapsibleCreateShipmentPanel
            form={createForm}
            isOpen={isCreatePanelOpen}
            submitting={submitting}
            onToggle={onToggleCreatePanel}
            onChange={onCreateFormChange}
            onSubmit={onCreateSubmit}
          />

          <ShipmentSearchBar value={searchQuery} onChange={onSearchChange} />

          <div>
            <p className="user-label">Shipment Views</p>
            <p className="user-muted mt-2 text-sm leading-6">
              Switch between deliveries in progress, completed shipments, and
              cancelled requests without leaving the page.
            </p>
            <div className="mt-3">
              <ShipmentSegmentedFilter
                value={selectedSegment}
                counts={{
                  ALL: totalShipments,
                  ACTIVE: activeShipments,
                  COMPLETED: deliveredShipments,
                  CANCELLED: cancelledShipments
                }}
                onChange={onSegmentChange}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="user-hero px-5 py-5 md:px-6">
        <div className="relative z-10">
          <p className="user-label">Shipment Snapshot</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[24px] border border-stone-200 bg-white/82 px-4 py-4 shadow-sm">
              <p className="user-label">Total</p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">
                {totalShipments}
              </p>
            </div>

            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 px-4 py-4 shadow-sm">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                In Progress
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-950">
                {activeShipments}
              </p>
            </div>

            <div className="rounded-[24px] border border-stone-200 bg-white/82 px-4 py-4 shadow-sm">
              <p className="user-label">Delivered</p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">
                {deliveredShipments}
              </p>
            </div>

            <div className="rounded-[24px] border border-stone-200 bg-white/82 px-4 py-4 shadow-sm">
              <p className="user-label">Cancelled</p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">
                {cancelledShipments}
              </p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
