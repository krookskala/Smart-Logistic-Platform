"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuthUser } from "../../lib/auth";
import {
  AdminUser,
  assignCourierToShipment,
  Courier,
  fetchCouriers,
  fetchShipments,
  fetchShipmentMetrics,
  fetchUsers,
  Shipment,
  ShipmentMetrics,
  updateUserRole
} from "../../lib/api";
import AdminMetricsCards from "../../components/admin/metrics-cards";
import StatusMixChart from "../../components/admin/status-mix-chart";
import ShipmentAssignmentPanel from "../../components/admin/shipment-assignment-panel";
import UserRoleManagementPanel from "../../components/admin/user-role-management-panel";
import { FeedbackState } from "../../lib/types";
import FeedbackAlert from "../../components/feedback-alert";
import PageHeader from "../../components/page-header";

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

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = getStoredAuthUser();

    if (!token || !user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    fetchShipmentMetrics()
      .then((data) => setMetrics(data))
      .finally(() => setLoading(false));

    fetchShipments().then((data) => setShipments(data));
    fetchCouriers().then((data) => setCouriers(data));
    fetchUsers().then((data) => setUsers(data));
  }, [router]);

  function handleCourierSelect(shipmentId: string, courierId: string) {
    setSelectedCouriers((prev) => ({
      ...prev,
      [shipmentId]: courierId
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

      const refreshedShipments = await fetchShipments();
      setShipments(refreshedShipments);

      setFeedback({
        type: "success",
        message: "Courier assigned successfully."
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to assign courier."
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

      setFeedback({
        type: "success",
        message: "User role updated successfully."
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to update user role."
      });
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f7f4] to-[#e7ece8] p-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Admin Dashboard"
          description="Monitor platform operations, metrics, and courier assignments."
        />
        <FeedbackAlert feedback={feedback} />
        {loading ? (
          <p className="mt-6 text-gray-500">Loading metrics...</p>
        ) : !metrics ? (
          <p className="mt-6 text-gray-500">No metrics available.</p>
        ) : (
          <>
            <AdminMetricsCards metrics={metrics} />
            <StatusMixChart metrics={metrics} />
            <ShipmentAssignmentPanel
              shipments={shipments}
              couriers={couriers}
              selectedCouriers={selectedCouriers}
              assigningId={assigningId}
              onSelectCourier={handleCourierSelect}
              onAssignCourier={handleAssignCourier}
            />
            <UserRoleManagementPanel
              users={users}
              selectedRoles={selectedRoles}
              updatingUserId={updatingUserId}
              onSelectRole={handleRoleSelect}
              onUpdateRole={handleUpdateUserRole}
            />
          </>
        )}
      </div>
    </main>
  );
}
