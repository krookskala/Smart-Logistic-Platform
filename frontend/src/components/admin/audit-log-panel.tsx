import { AdminUser, AuditLog } from "../../lib/api";

type AuditLogFilters = {
  actionType: string;
  targetType: string;
  actorUserId: string;
  sortOrder: "asc" | "desc";
};

type AuditLogPanelProps = {
  logs: AuditLog[];
  users: AdminUser[];
  filters: AuditLogFilters;
  onChange: (field: keyof AuditLogFilters, value: string) => void;
};

export default function AuditLogPanel({
  logs,
  users,
  filters,
  onChange
}: AuditLogPanelProps) {
  return (
    <div className="admin-surface p-6 md:p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="admin-label">Audit Console</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Trace operational actions and platform changes
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Filter by actor, target, or action type to reconstruct what
            changed across shipments, courier operations, and access control.
          </p>
        </div>
        <div className="admin-chip">{logs.length} matching events</div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          placeholder="Filter by action type"
          value={filters.actionType}
          onChange={(e) => onChange("actionType", e.target.value)}
        />

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          value={filters.targetType}
          onChange={(e) => onChange("targetType", e.target.value)}
        >
          <option value="">All targets</option>
          <option value="Shipment">Shipment</option>
          <option value="User">User</option>
          <option value="Courier">Courier</option>
        </select>

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          value={filters.actorUserId}
          onChange={(e) => onChange("actorUserId", e.target.value)}
        >
          <option value="">All actors</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          value={filters.sortOrder}
          onChange={(e) =>
            onChange("sortOrder", e.target.value as AuditLogFilters["sortOrder"])
          }
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      {logs.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No audit events matched the current filters.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="admin-panel p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="admin-label">{log.targetType}</p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {log.actionType}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Actor: {log.actor?.email ?? "System"} · Target:{" "}
                    {log.targetId ?? "-"}
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>

              {log.metadata ? (
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-700">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
