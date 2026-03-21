import { ShipmentMetrics } from "../../lib/api";

type AdminMetricsCardsProps = {
  metrics: ShipmentMetrics;
};

export default function AdminMetricsCards({ metrics }: AdminMetricsCardsProps) {
  const cards = [
    {
      label: "Total Shipments",
      value: metrics.total,
      tone: "from-slate-100 to-slate-50 text-slate-950 border-slate-200"
    },
    {
      label: "Delivered",
      value: metrics.delivered,
      tone: "from-emerald-100/80 to-emerald-50 text-emerald-900 border-emerald-200"
    },
    {
      label: "In Transit",
      value: metrics.inTransit,
      tone: "from-sky-100/80 to-sky-50 text-sky-900 border-sky-200"
    },
    {
      label: "Assigned",
      value: metrics.assigned,
      tone: "from-amber-100/90 to-amber-50 text-amber-900 border-amber-200"
    },
    {
      label: "Cancelled",
      value: metrics.cancelled ?? 0,
      tone: "from-rose-100/90 to-rose-50 text-rose-900 border-rose-200"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-3xl border bg-gradient-to-br p-5 shadow-sm ${card.tone}`}
        >
          <p className="admin-label text-current/70">{card.label}</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
