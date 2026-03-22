import { Courier, ShipmentFilters } from "../../lib/api";

type ShipmentFiltersToolbarProps = {
  filters: ShipmentFilters;
  couriers: Courier[];
  onChange: (field: keyof ShipmentFilters, value: string) => void;
};

export default function ShipmentFiltersToolbar({
  filters,
  couriers,
  onChange
}: ShipmentFiltersToolbarProps) {
  return (
    <div className="admin-panel p-5 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="admin-label">Queue Controls</p>
          <h2 className="mt-3 text-xl font-semibold text-slate-950">
            Narrow the dispatch queue
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Focus shipment work by search term, current state, assigned courier,
            and ordering priority.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          placeholder="Search title or address"
          value={filters.search ?? ""}
          onChange={(e) => onChange("search", e.target.value)}
        />

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          value={filters.status ?? ""}
          onChange={(e) => onChange("status", e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="CREATED">CREATED</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="PICKED_UP">PICKED_UP</option>
          <option value="IN_TRANSIT">IN_TRANSIT</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="DELAYED">DELAYED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          value={filters.assignedCourierId ?? ""}
          onChange={(e) => onChange("assignedCourierId", e.target.value)}
        >
          <option value="">All couriers</option>
          {couriers.map((courier) => (
            <option key={courier.id} value={courier.id}>
              {courier.user.email}
            </option>
          ))}
        </select>

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          value={filters.sortBy ?? "createdAt"}
          onChange={(e) =>
            onChange(
              "sortBy",
              e.target.value as ShipmentFilters["sortBy"] & string
            )
          }
        >
          <option value="createdAt">Sort by createdAt</option>
          <option value="title">Sort by title</option>
          <option value="status">Sort by status</option>
        </select>

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          value={filters.sortOrder ?? "desc"}
          onChange={(e) =>
            onChange(
              "sortOrder",
              e.target.value as ShipmentFilters["sortOrder"] & string
            )
          }
        >
          <option value="desc">Newest / Z-A</option>
          <option value="asc">Oldest / A-Z</option>
        </select>
      </div>
    </div>
  );
}
