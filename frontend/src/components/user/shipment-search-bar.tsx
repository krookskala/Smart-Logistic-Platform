type ShipmentSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ShipmentSearchBar({
  value,
  onChange
}: ShipmentSearchBarProps) {
  return (
    <div>
      <label className="user-label block" htmlFor="shipment-search">
        Search Shipments
      </label>
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
          Search
        </span>
        <input
          id="shipment-search"
          className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
          placeholder="Search by title, pickup, or delivery address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
