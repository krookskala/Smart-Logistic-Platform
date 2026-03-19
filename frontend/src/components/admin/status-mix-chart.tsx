import { ShipmentMetrics } from "../../lib/api";

type StatusMixChartProps = {
  metrics: ShipmentMetrics;
};

export default function StatusMixChart({ metrics }: StatusMixChartProps) {
  const bars = [
    { label: "Created", value: metrics.created, color: "bg-gray-500" },
    { label: "Assigned", value: metrics.assigned, color: "bg-yellow-500" },
    { label: "In Transit", value: metrics.inTransit, color: "bg-blue-500" },
    { label: "Delivered", value: metrics.delivered, color: "bg-green-500" }
  ];

  const maxValue = Math.max(...bars.map((item) => item.value), 1);

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Shipment Status Mix</h2>

      <div className="mt-6 space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex items-center justify-between text-sm text-gray-700">
              <span>{bar.label}</span>
              <span>{bar.value}</span>
            </div>

            <div className="h-3 rounded-full bg-gray-100">
              <div
                className={`h-3 rounded-full ${bar.color}`}
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
