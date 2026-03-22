import { AdminUser } from "../../lib/api";

type UserRoleManagementPanelProps = {
  users: AdminUser[];
  selectedRoles: Record<string, string>;
  updatingUserId: string | null;
  onSelectRole: (userId: string, role: string) => void;
  onUpdateRole: (userId: string) => void;
  onInspectUser: (user: AdminUser) => void;
};

export default function UserRoleManagementPanel({
  users,
  selectedRoles,
  updatingUserId,
  onSelectRole,
  onUpdateRole,
  onInspectUser
}: UserRoleManagementPanelProps) {
  return (
    <div className="admin-surface p-6 md:p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="admin-label">Account Operations</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Review roles and courier provisioning
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Keep account access aligned with platform responsibilities and open
            the selected profile when you need more operational context.
          </p>
        </div>
        <div className="admin-chip">{users.length} managed accounts</div>
      </div>

      {users.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No user accounts were found.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {users.map((user) => (
            <div key={user.id} className="admin-panel p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="admin-label">User Account</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {user.email}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="admin-chip">Role: {user.role}</span>
                    <span className="admin-chip">
                      Courier profile:{" "}
                      {user.courier ? "Provisioned" : "Not provisioned"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Created {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <button
                    type="button"
                    onClick={() => onInspectUser(user)}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700"
                  >
                    Inspect Account
                  </button>

                  <select
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
                    value={selectedRoles[user.id] || user.role}
                    onChange={(e) => onSelectRole(user.id, e.target.value)}
                  >
                    <option value="USER">USER</option>
                    <option value="COURIER">COURIER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onUpdateRole(user.id)}
                    disabled={updatingUserId === user.id}
                    className="rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-60"
                  >
                    {updatingUserId === user.id ? "Updating..." : "Update Role"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
