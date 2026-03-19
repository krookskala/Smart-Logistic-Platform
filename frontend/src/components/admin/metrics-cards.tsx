import { ShipmentMetrics } from "../../lib/api";

type AdminMetricsCardsProps = {
  metrics: ShipmentMetrics;
};

export default function AdminMetricsCards({ metrics }: AdminMetricsCardsProps) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total</p>
        <p className="mt-2 text-3xl font-bold">{metrics.total}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Delivered</p>
        <p className="mt-2 text-3xl font-bold text-green-700">
          {metrics.delivered}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">In Transit</p>
        <p className="mt-2 text-3xl font-bold text-blue-700">
          {metrics.inTransit}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Assigned</p>
        <p className="mt-2 text-3xl font-bold text-yellow-700">
          {metrics.assigned}
        </p>
      </div>
    </div>
  );
}
