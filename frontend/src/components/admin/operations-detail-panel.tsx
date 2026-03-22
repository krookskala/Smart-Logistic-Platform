import { AdminUser, AuditLog } from "../../lib/api";

type OperationsDetailPanelProps = {
  user: AdminUser | null;
  relatedLogs: AuditLog[];
};

export default function OperationsDetailPanel({
  user,
  relatedLogs
}: OperationsDetailPanelProps) {
  if (!user) {
    return (
      <div className="admin-surface border-dashed p-6 text-sm text-slate-500">
        Select an account from the Users tab to inspect its access posture,
        courier record, and recent operational history.
      </div>
    );
  }

  return (
    <div className="admin-surface p-6 md:p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="admin-label">Inspection Detail</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Account operations profile
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Review role alignment, courier provisioning, and the most recent
            related audit events for the selected account.
          </p>
        </div>
        <div className="admin-chip">{user.email}</div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="admin-panel p-5">
          <h3 className="admin-label">User Snapshot</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
            <p>
              Courier record: {user.courier ? "Provisioned" : "Not provisioned"}
            </p>
          </div>
        </div>

        <div className="admin-panel p-5">
          <h3 className="admin-label">Courier Snapshot</h3>
          {user.courier ? (
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>Vehicle: {user.courier.vehicleType ?? "Not set"}</p>
              <p>
                Availability:{" "}
                {user.courier.availability ? "Available" : "Unavailable"}
              </p>
              <p>Assigned shipments: {user.courier._count?.shipments ?? 0}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              This account does not currently have a courier profile.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="admin-label">Recent Related Audit Events</h3>
        {relatedLogs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No recent audit entries were found for this account.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {relatedLogs.map((log) => (
              <div
                key={log.id}
                className="admin-panel flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {log.actionType}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                    {log.targetType}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
