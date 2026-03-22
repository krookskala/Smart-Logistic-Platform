"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { redirectToLoginIfUnauthorized } from "../../lib/route-guards";
import {
  cancelShipment,
  createShipment,
  fetchShipments,
  Shipment,
  updateShipment
} from "../../lib/api";
import { FeedbackState } from "../../lib/types";
import FeedbackAlert from "../../components/feedback-alert";
import ShipmentList from "../../components/user/shipment-list";
import { ShipmentSegment } from "../../components/user/shipment-segmented-filter";
import UserDashboardSidebar from "../../components/user/user-dashboard-sidebar";

export default function UserDashboardPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    pickupAddress: "",
    deliveryAddress: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [editingShipmentId, setEditingShipmentId] = useState<string | null>(
    null
  );
  const [savingShipmentId, setSavingShipmentId] = useState<string | null>(null);
  const [cancellingShipmentId, setCancellingShipmentId] = useState<
    string | null
  >(null);
  const [selectedSegment, setSelectedSegment] =
    useState<ShipmentSegment>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(true);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    pickupAddress: "",
    deliveryAddress: ""
  });

  function handleFormChange(
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const created = await createShipment({
        title: form.title,
        description: form.description || undefined,
        pickupAddress: form.pickupAddress,
        deliveryAddress: form.deliveryAddress
      });

      setShipments((prev) => [created, ...prev]);
      setIsCreatePanelOpen(false);
      setForm({
        title: "",
        description: "",
        pickupAddress: "",
        deliveryAddress: ""
      });

      setFeedback({
        type: "success",
        message: "Shipment created successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to create shipment."
      });
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(shipment: Shipment) {
    setEditingShipmentId(shipment.id);
    setEditForm({
      title: shipment.title,
      description: shipment.description ?? "",
      pickupAddress: shipment.pickupAddress,
      deliveryAddress: shipment.deliveryAddress
    });
  }

  function handleEditFormChange(
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) {
    setEditForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSaveEdit(shipmentId: string) {
    setSavingShipmentId(shipmentId);
    setFeedback(null);

    try {
      const updated = await updateShipment(shipmentId, {
        title: editForm.title,
        description: editForm.description || undefined,
        pickupAddress: editForm.pickupAddress,
        deliveryAddress: editForm.deliveryAddress
      });

      setShipments((prev) =>
        prev.map((shipment) =>
          shipment.id === shipmentId ? updated : shipment
        )
      );
      setEditingShipmentId(null);
      setFeedback({
        type: "success",
        message: "Shipment updated successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to update shipment."
      });
    } finally {
      setSavingShipmentId(null);
    }
  }

  async function handleCancelShipment(shipmentId: string) {
    setCancellingShipmentId(shipmentId);
    setFeedback(null);

    try {
      const cancelled = await cancelShipment(shipmentId);
      setShipments((prev) =>
        prev.map((shipment) =>
          shipment.id === shipmentId ? cancelled : shipment
        )
      );
      setEditingShipmentId((prev) => (prev === shipmentId ? null : prev));
      setFeedback({
        type: "success",
        message: "Shipment cancelled successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to cancel shipment."
      });
    } finally {
      setCancellingShipmentId(null);
    }
  }

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["USER"])) {
      return;
    }

    setFeedback(null);

    fetchShipments({ limit: 100 })
      .then((res) => {
        setShipments(res.data);
        setIsCreatePanelOpen(res.data.length === 0);
      })
      .catch(() => {
        setFeedback({
          type: "error",
          message: "Failed to load shipments."
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const segmentCounts = {
    ALL: shipments.length,
    ACTIVE: shipments.filter((shipment) =>
      ["CREATED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(
        shipment.status
      )
    ).length,
    COMPLETED: shipments.filter((shipment) => shipment.status === "DELIVERED")
      .length,
    CANCELLED: shipments.filter((shipment) => shipment.status === "CANCELLED")
      .length
  };

  const visibleShipments = shipments.filter((shipment) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSegment =
      selectedSegment === "ALL"
        ? true
        : selectedSegment === "ACTIVE"
          ? ["CREATED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(
              shipment.status
            )
          : selectedSegment === "COMPLETED"
            ? shipment.status === "DELIVERED"
            : shipment.status === "CANCELLED";

    const matchesSearch =
      normalizedQuery.length === 0
        ? true
        : [
            shipment.title,
            shipment.pickupAddress,
            shipment.deliveryAddress,
            shipment.description ?? ""
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

    return matchesSegment && matchesSearch;
  });

  const selectedSegmentLabel =
    selectedSegment === "ALL"
      ? "All Shipments"
      : selectedSegment === "ACTIVE"
        ? "In Progress"
        : selectedSegment === "COMPLETED"
          ? "Delivered"
          : "Cancelled";

  return (
    <main className="user-experience px-4 py-6 md:px-8 md:py-8">
      <div className="user-page-shell">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <UserDashboardSidebar
            totalShipments={shipments.length}
            activeShipments={segmentCounts.ACTIVE}
            deliveredShipments={segmentCounts.COMPLETED}
            cancelledShipments={segmentCounts.CANCELLED}
            selectedSegment={selectedSegment}
            searchQuery={searchQuery}
            createForm={form}
            isCreatePanelOpen={isCreatePanelOpen}
            submitting={submitting}
            onSegmentChange={setSelectedSegment}
            onSearchChange={setSearchQuery}
            onToggleCreatePanel={() => setIsCreatePanelOpen((prev) => !prev)}
            onCreateFormChange={handleFormChange}
            onCreateSubmit={handleSubmit}
          />

          <section className="min-w-0">
            <div className="user-surface px-6 py-4 md:px-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="user-label">Shipment Overview</p>
                  <h2 className="user-display mt-2 text-[2.15rem] font-semibold leading-none text-stone-900">
                    Shipment queue and live tracking
                  </h2>
                  <p className="user-muted mt-2 text-sm leading-6">
                    Review your current shipments, open live tracking instantly,
                    and focus only on the deliveries that matter right now.
                  </p>
                </div>
                <p className="user-muted text-sm md:text-right">
                  Showing {visibleShipments.length} of {shipments.length}{" "}
                  shipments
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="user-chip">{selectedSegmentLabel}</span>
                {searchQuery.trim() ? (
                  <span className="user-chip">
                    Search results for: {searchQuery.trim()}
                  </span>
                ) : null}
              </div>

              <FeedbackAlert feedback={feedback} />
            </div>

            {loading ? (
              <div className="user-surface mt-6 px-6 py-8 text-sm text-stone-600">
                Loading your shipments...
              </div>
            ) : shipments.length === 0 ? (
              <div className="user-surface mt-6 px-6 py-10 md:px-8">
                <p className="user-label">No Shipments Yet</p>
                <h3 className="user-display mt-3 text-3xl font-semibold text-stone-900">
                  Create your first shipment request
                </h3>
                <p className="user-muted mt-3 max-w-2xl text-sm leading-7">
                  Use the panel on the left to submit pickup and delivery
                  details. Once your first shipment is created, this area will
                  turn into a live overview of active, delivered, and cancelled
                  shipments.
                </p>
              </div>
            ) : visibleShipments.length === 0 ? (
              <div className="user-surface mt-6 px-6 py-10 md:px-8">
                <p className="user-label">No Matching Shipments</p>
                <h3 className="user-display mt-3 text-3xl font-semibold text-stone-900">
                  No shipments match the current filters
                </h3>
                <p className="user-muted mt-3 max-w-2xl text-sm leading-7">
                  Adjust the selected view or clear the search term from the
                  left panel to bring more shipments back into view.
                </p>
              </div>
            ) : (
              <div className="mt-6">
                <ShipmentList
                  shipments={visibleShipments}
                  editingShipmentId={editingShipmentId}
                  editForm={editForm}
                  savingShipmentId={savingShipmentId}
                  cancellingShipmentId={cancellingShipmentId}
                  onStartEdit={startEdit}
                  onEditFormChange={handleEditFormChange}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingShipmentId(null)}
                  onCancelShipment={handleCancelShipment}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
