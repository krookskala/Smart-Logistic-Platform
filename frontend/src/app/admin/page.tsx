"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { redirectToLoginIfUnauthorized } from "../../lib/route-guards";
import {
  AdminUser,
  assignCourierToShipment,
  AuditLog,
  Courier,
  fetchAuditLogs,
  fetchCouriers,
  fetchShipments,
  fetchShipmentMetrics,
  fetchUsers,
  Shipment,
  ShipmentFilters,
  ShipmentMetrics,
  updateUserRole
} from "../../lib/api";
import AdminMetricsCards from "../../components/admin/metrics-cards";
import StatusMixChart from "../../components/admin/status-mix-chart";
import ShipmentAssignmentPanel from "../../components/admin/shipment-assignment-panel";
import UserRoleManagementPanel from "../../components/admin/user-role-management-panel";
import { FeedbackState } from "../../lib/types";
import FeedbackAlert from "../../components/feedback-alert";
import ShipmentFiltersToolbar from "../../components/admin/shipment-filters-toolbar";
import AuditLogPanel from "../../components/admin/audit-log-panel";
import OperationsDetailPanel from "../../components/admin/operations-detail-panel";
import AdminCommandHero from "../../components/admin/admin-command-hero";
import AdminTabSwitcher from "../../components/admin/admin-tab-switcher";
import AdminSectionShell from "../../components/admin/admin-section-shell";

type AuditLogFilters = {
  actionType: string;
  targetType: string;
  actorUserId: string;
  sortOrder: "asc" | "desc";
};

type AdminTabKey = "overview" | "shipments" | "users" | "audit";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<ShipmentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCouriers, setSelectedCouriers] = useState<
    Record<string, string>
  >({});
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
    {}
  );
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [shipmentFilters, setShipmentFilters] = useState<ShipmentFilters>({
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const [auditFilters, setAuditFilters] = useState<AuditLogFilters>({
    actionType: "",
    targetType: "",
    actorUserId: "",
    sortOrder: "desc"
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedUserAuditLogs, setSelectedUserAuditLogs] = useState<
    AuditLog[]
  >([]);
  const [activeTab, setActiveTab] = useState<AdminTabKey>("overview");

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["ADMIN"])) {
      return;
    }

    setFeedback(null);

    fetchShipmentMetrics()
      .then((data) => setMetrics(data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to load admin metrics."
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["ADMIN"])) {
      return;
    }

    fetchShipments({ ...shipmentFilters, limit: 100 })
      .then((res) => setShipments(res.data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to load shipments."
        });
      });
  }, [router, shipmentFilters]);

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["ADMIN"])) {
      return;
    }

    fetchCouriers()
      .then((data) => setCouriers(data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to load couriers."
        });
      });

    fetchUsers()
      .then((data) => setUsers(data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to load users."
        });
      });
  }, [router]);

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["ADMIN"])) {
      return;
    }

    fetchAuditLogs(auditFilters)
      .then((data) => setAuditLogs(data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to load audit logs."
        });
      });
  }, [router, auditFilters]);

  function handleCourierSelect(shipmentId: string, courierId: string) {
    setSelectedCouriers((prev) => ({
      ...prev,
      [shipmentId]: courierId
    }));
  }

  function handleShipmentFilterChange(
    field: keyof ShipmentFilters,
    value: string
  ) {
    setShipmentFilters((prev) => ({
      ...prev,
      [field]: value || undefined
    }));
  }

  function handleAuditFilterChange(
    field: keyof AuditLogFilters,
    value: string
  ) {
    setAuditFilters((prev) => ({
      ...prev,
      [field]:
        field === "sortOrder" ? (value as AuditLogFilters["sortOrder"]) : value
    }));
  }

  async function handleAssignCourier(shipmentId: string) {
    const courierId = selectedCouriers[shipmentId];

    if (!courierId) {
      return;
    }

    setAssigningId(shipmentId);
    setFeedback(null);

    try {
      await assignCourierToShipment(shipmentId, courierId);

      const refreshedShipments = await fetchShipments({
        ...shipmentFilters,
        limit: 100
      });
      setShipments(refreshedShipments.data);

      const refreshedAuditLogs = await fetchAuditLogs(auditFilters);
      setAuditLogs(refreshedAuditLogs);

      setFeedback({
        type: "success",
        message: "Courier assigned successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to assign courier."
      });
    } finally {
      setAssigningId(null);
    }
  }

  function handleRoleSelect(userId: string, role: string) {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role
    }));
  }

  async function handleUpdateUserRole(userId: string) {
    const role = selectedRoles[userId];

    if (!role) {
      return;
    }

    setUpdatingUserId(userId);
    setFeedback(null);

    try {
      await updateUserRole(userId, role);

      const refreshedUsers = await fetchUsers();
      setUsers(refreshedUsers);

      const refreshedCouriers = await fetchCouriers();
      setCouriers(refreshedCouriers);

      const refreshedAuditLogs = await fetchAuditLogs(auditFilters);
      setAuditLogs(refreshedAuditLogs);

      setFeedback({
        type: "success",
        message: "User role updated successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to update user role."
      });
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleInspectUser(user: AdminUser) {
    setSelectedUser(user);
    setActiveTab("users");

    try {
      const relatedLogs = await fetchAuditLogs({
        targetType: "User",
        targetId: user.id,
        sortOrder: "desc"
      });
      setSelectedUserAuditLogs(relatedLogs.slice(0, 5));
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load related audit logs."
      });
    }
  }

  const activeShipments = shipments.filter((shipment) =>
    ["CREATED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELAYED"].includes(
      shipment.status
    )
  );
  const pendingAssignments = shipments.filter(
    (shipment) => shipment.status === "CREATED" && !shipment.assignedCourierId
  );
  const delayedOrTransit = shipments.filter((shipment) =>
    ["IN_TRANSIT", "DELAYED"].includes(shipment.status)
  );
  const overviewPreview = pendingAssignments
    .concat(
      delayedOrTransit.filter(
        (shipment) =>
          !pendingAssignments.some((pending) => pending.id === shipment.id)
      )
    )
    .slice(0, 4);

  return (
    <main className="admin-experience px-6 py-8 md:px-8 md:py-10">
      <div className="admin-page-shell">
        <AdminCommandHero
          activeShipments={activeShipments.length}
          pendingAssignments={pendingAssignments.length}
          usersCount={users.length}
        />

        <div className="mt-6">
          <AdminTabSwitcher activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <FeedbackAlert feedback={feedback} />

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading command data...</p>
        ) : !metrics ? (
          <p className="mt-6 text-sm text-slate-500">
            No operational metrics are available right now.
          </p>
        ) : (
          <div className="mt-6 space-y-6">
            {activeTab === "overview" ? (
              <>
                <AdminSectionShell
                  eyebrow="Overview"
                  title="Platform activity at a glance"
                  description="Monitor shipment health, review current status distribution, and surface the items that need operational follow-through first."
                  aside={
                    <div className="admin-chip">
                      {pendingAssignments.length} awaiting courier coverage
                    </div>
                  }
                >
                  <AdminMetricsCards metrics={metrics} />
                </AdminSectionShell>

                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
                  <StatusMixChart metrics={metrics} />

                  <AdminSectionShell
                    eyebrow="Attention Required"
                    title="Queue items to review first"
                    description="Prioritize shipment requests waiting for dispatch or deliveries already moving through the network."
                  >
                    {overviewPreview.length === 0 ? (
                      <div className="admin-panel p-5 text-sm text-slate-500">
                        The active queue is clear. No shipment currently needs
                        immediate administrative review.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {overviewPreview.map((shipment) => (
                          <div
                            key={shipment.id}
                            className="admin-panel flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
                          >
                            <div>
                              <p className="text-lg font-semibold text-slate-950">
                                {shipment.title}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {shipment.pickupAddress} {"->"}{" "}
                                {shipment.deliveryAddress}
                              </p>
                              <p className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                                {shipment.status === "CREATED" &&
                                !shipment.assignedCourierId
                                  ? "Awaiting dispatch"
                                  : "Active network movement"}
                              </p>
                            </div>

                            <div className="admin-chip">
                              {shipment.assignedCourier?.user.email ??
                                "Unassigned"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AdminSectionShell>
                </div>
              </>
            ) : null}

            {activeTab === "shipments" ? (
              <>
                <AdminSectionShell
                  eyebrow="Dispatch Coordination"
                  title="Search, prioritize, and route shipment work"
                  description="Filter the shipment queue by status, assigned courier, or keyword, then complete dispatch decisions from a single working area."
                >
                  <ShipmentFiltersToolbar
                    filters={shipmentFilters}
                    couriers={couriers}
                    onChange={handleShipmentFilterChange}
                  />
                </AdminSectionShell>

                <ShipmentAssignmentPanel
                  shipments={shipments}
                  couriers={couriers}
                  selectedCouriers={selectedCouriers}
                  assigningId={assigningId}
                  onSelectCourier={handleCourierSelect}
                  onAssignCourier={handleAssignCourier}
                />
              </>
            ) : null}

            {activeTab === "users" ? (
              <>
                <AdminSectionShell
                  eyebrow="Access Control"
                  title="Manage roles and courier access"
                  description="Review account permissions, provision courier capability where needed, and inspect the selected profile without leaving account operations."
                  aside={
                    <div className="admin-chip">
                      {selectedUser
                        ? `Inspecting ${selectedUser.email}`
                        : "Select an account to inspect"}
                    </div>
                  }
                >
                  <UserRoleManagementPanel
                    users={users}
                    selectedRoles={selectedRoles}
                    updatingUserId={updatingUserId}
                    onSelectRole={handleRoleSelect}
                    onUpdateRole={handleUpdateUserRole}
                    onInspectUser={handleInspectUser}
                  />
                </AdminSectionShell>

                <OperationsDetailPanel
                  user={selectedUser}
                  relatedLogs={selectedUserAuditLogs}
                />
              </>
            ) : null}

            {activeTab === "audit" ? (
              <AdminSectionShell
                eyebrow="Audit Visibility"
                title="Review platform activity and admin actions"
                description="Filter recent events by actor, target, or action type to reconstruct changes across shipment routing, access control, and operational oversight."
              >
                <AuditLogPanel
                  logs={auditLogs}
                  users={users}
                  filters={auditFilters}
                  onChange={handleAuditFilterChange}
                />
              </AdminSectionShell>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
