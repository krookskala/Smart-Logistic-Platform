type ShipmentSegment = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

type ShipmentSegmentedFilterProps = {
  value: ShipmentSegment;
  counts: Record<ShipmentSegment, number>;
  onChange: (value: ShipmentSegment) => void;
};

const SEGMENTS: Array<{
  value: ShipmentSegment;
  label: string;
}> = [
  { value: "ALL", label: "All Shipments" },
  { value: "ACTIVE", label: "In Progress" },
  { value: "COMPLETED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" }
];

export default function ShipmentSegmentedFilter({
  value,
  counts,
  onChange
}: ShipmentSegmentedFilterProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {SEGMENTS.map((segment) => {
        const isActive = value === segment.value;

        return (
          <button
            key={segment.value}
            type="button"
            onClick={() => onChange(segment.value)}
            className={`flex items-center justify-between gap-3 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
              isActive
                ? "bg-stone-900 text-white shadow-lg shadow-stone-900/10"
                : "bg-transparent text-stone-600 hover:bg-white/70 hover:text-stone-900"
            }`}
          >
            <span>{segment.label}</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs ${
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-stone-100 text-stone-700"
              }`}
            >
              {counts[segment.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type { ShipmentSegment };
