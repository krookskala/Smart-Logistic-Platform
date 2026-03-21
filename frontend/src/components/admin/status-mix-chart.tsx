import { ShipmentMetrics } from "../../lib/api";

type StatusMixChartProps = {
  metrics: ShipmentMetrics;
};

export default function StatusMixChart({ metrics }: StatusMixChartProps) {
  const bars = [
    { label: "Created", value: metrics.created, color: "from-slate-500 to-slate-400" },
    { label: "Assigned", value: metrics.assigned, color: "from-amber-500 to-amber-400" },
    { label: "Picked Up", value: metrics.pickedUp ?? 0, color: "from-cyan-500 to-cyan-400" },
    { label: "In Transit", value: metrics.inTransit, color: "from-sky-500 to-sky-400" },
    { label: "Delivered", value: metrics.delivered, color: "from-emerald-500 to-emerald-400" },
    { label: "Cancelled", value: metrics.cancelled ?? 0, color: "from-rose-500 to-rose-400" }
  ];

  const maxValue = Math.max(...bars.map((item) => item.value), 1);

  return (
    <div className="admin-surface p-6 md:p-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="admin-label">Status Mix</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Shipment distribution across the network
          </h2>
        </div>
        <div className="admin-chip">{bars.reduce((sum, bar) => sum + bar.value, 0)} tracked statuses</div>
      </div>

      <div className="mt-6 space-y-4">
        {bars.map((bar) => (
          <div key={bar.label} className="admin-panel p-4">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
              <span>{bar.label}</span>
              <span className="font-semibold">{bar.value}</span>
            </div>

            <div className="h-3 rounded-full bg-slate-100">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${bar.color}`}
                style={{
                  width: `${(bar.value / maxValue) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
