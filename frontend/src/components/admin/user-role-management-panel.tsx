import { AdminUser } from "../../lib/api";

type UserRoleManagementPanelProps = {
  users: AdminUser[];
  selectedRoles: Record<string, string>;
  updatingUserId: string | null;
  onSelectRole: (userId: string, role: string) => void;
  onUpdateRole: (userId: string) => void;
};

export default function UserRoleManagementPanel({
  users,
  selectedRoles,
  updatingUserId,
  onSelectRole,
  onUpdateRole
}: UserRoleManagementPanelProps) {
  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">User Role Management</h2>
      <p className="mt-2 text-sm text-gray-600">
        Update user roles and provision courier access.
      </p>

      {users.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No users found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-base font-semibold">{user.email}</h3>
                  <p className="text-sm text-gray-600">
                    Current role: {user.role}
                  </p>
                  <p className="text-sm text-gray-500">
                    Courier record: {user.courier ? "Yes" : "No"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <select
                    className="rounded-lg border border-gray-300 bg-white p-2"
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
                    className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
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
