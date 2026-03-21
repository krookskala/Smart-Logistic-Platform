type CourierSegment = "ALL" | "READY_NOW" | "IN_TRANSIT" | "COMPLETED";

type CourierSegmentedFilterProps = {
  value: CourierSegment;
  counts: Record<CourierSegment, number>;
  onChange: (value: CourierSegment) => void;
};

const SEGMENTS: Array<{
  value: CourierSegment;
  label: string;
}> = [
  { value: "ALL", label: "All Deliveries" },
  { value: "READY_NOW", label: "Ready Now" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "COMPLETED", label: "Completed" }
];

export default function CourierSegmentedFilter({
  value,
  counts,
  onChange
}: CourierSegmentedFilterProps) {
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
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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

export type { CourierSegment };
