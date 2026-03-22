"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { redirectToLoginIfUnauthorized } from "../../lib/route-guards";
import {
  createTrackingEvent,
  fetchMyCourier,
  fetchShipments,
  Shipment,
  updateMyCourierAvailability,
  Courier
} from "../../lib/api";
import { FeedbackState, TrackingFormState } from "../../lib/types";
import FeedbackAlert from "../../components/feedback-alert";
import AssignedShipmentsList from "../../components/courier/assigned-shipments-list";
import CourierSidebar from "../../components/courier/courier-sidebar";
import CourierQueueHeader from "../../components/courier/courier-queue-header";
import { CourierSegment } from "../../components/courier/courier-segmented-filter";

export default function CourierDashboardPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingForms, setTrackingForms] = useState<
    Record<string, TrackingFormState>
  >({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [courier, setCourier] = useState<Courier | null>(null);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<CourierSegment>("ALL");

  function getDefaultNextStatus(currentStatus: string) {
    if (currentStatus === "ASSIGNED") {
      return "PICKED_UP";
    }

    if (currentStatus === "PICKED_UP") {
      return "IN_TRANSIT";
    }

    if (currentStatus === "IN_TRANSIT") {
      return "DELIVERED";
    }

    return "";
  }

  function getTrackingForm(
    shipmentId: string,
    currentStatus: string
  ): TrackingFormState {
    return (
      trackingForms[shipmentId] || {
        status: getDefaultNextStatus(currentStatus),
        note: "",
        locationLat: "",
        locationLng: ""
      }
    );
  }

  function updateTrackingForm(
    shipmentId: string,
    currentStatus: string,
    field: keyof TrackingFormState,
    value: string
  ) {
    setTrackingForms((prev) => ({
      ...prev,
      [shipmentId]: {
        ...getTrackingForm(shipmentId, currentStatus),
        [field]: value
      }
    }));
  }

  async function handleTrackingSubmit(
    shipmentId: string,
    currentStatus: string
  ) {
    const form = getTrackingForm(shipmentId, currentStatus);
    setSubmittingId(shipmentId);
    setFeedback(null);

    try {
      if (form.status === "DELIVERED" && !form.note.trim()) {
        throw new Error("A delivery note is required for delivered shipments.");
      }

      await createTrackingEvent(shipmentId, {
        status: form.status,
        note: form.note || undefined,
        locationLat: form.locationLat ? Number(form.locationLat) : undefined,
        locationLng: form.locationLng ? Number(form.locationLng) : undefined
      });

      const refreshed = await fetchShipments({ limit: 100 });
      setShipments(refreshed.data);

      setTrackingForms((prev) => ({
        ...prev,
        [shipmentId]: {
          status: getDefaultNextStatus(form.status),
          note: "",
          locationLat: "",
          locationLng: ""
        }
      }));

      setFeedback({
        type: "success",
        message: "Tracking updated successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to update tracking."
      });
    } finally {
      setSubmittingId(null);
    }
  }

  async function handleAvailabilityToggle() {
    if (!courier) {
      return;
    }

    setSavingAvailability(true);
    setFeedback(null);

    try {
      const updated = await updateMyCourierAvailability(!courier.availability);
      setCourier(updated);
      setFeedback({
        type: "success",
        message: `Availability updated to ${
          updated.availability ? "available" : "unavailable"
        }.`
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update availability."
      });
    } finally {
      setSavingAvailability(false);
    }
  }

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["COURIER"])) {
      return;
    }

    setFeedback(null);

    fetchShipments({ limit: 100 })
      .then((res) => setShipments(res.data))
      .catch(() => {
        setFeedback({
          type: "error",
          message: "Failed to load assigned deliveries."
        });
      })
      .finally(() => setLoading(false));

    fetchMyCourier()
      .then((data) => setCourier(data))
      .catch(() => {
        // Keep the dashboard usable even if the profile card fails to load.
      });
  }, [router]);

  const readyNowCount = shipments.filter((shipment) =>
    ["ASSIGNED", "PICKED_UP"].includes(shipment.status)
  ).length;
  const inTransitCount = shipments.filter(
    (shipment) => shipment.status === "IN_TRANSIT"
  ).length;
  const completedCount = shipments.filter((shipment) =>
    ["DELIVERED", "CANCELLED"].includes(shipment.status)
  ).length;

  const visibleShipments = shipments.filter((shipment) => {
    if (selectedSegment === "READY_NOW") {
      return ["ASSIGNED", "PICKED_UP"].includes(shipment.status);
    }

    if (selectedSegment === "IN_TRANSIT") {
      return shipment.status === "IN_TRANSIT";
    }

    if (selectedSegment === "COMPLETED") {
      return ["DELIVERED", "CANCELLED"].includes(shipment.status);
    }

    return true;
  });

  return (
    <main className="courier-experience px-4 py-6 md:px-8 md:py-8">
      <div className="courier-page-shell">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <CourierSidebar
            courier={courier}
            savingAvailability={savingAvailability}
            selectedSegment={selectedSegment}
            shipmentsCount={shipments.length}
            readyNowCount={readyNowCount}
            inTransitCount={inTransitCount}
            completedCount={completedCount}
            onSegmentChange={setSelectedSegment}
            onToggleAvailability={handleAvailabilityToggle}
          />

          <section className="min-w-0">
            <CourierQueueHeader
              selectedSegment={selectedSegment}
              visibleShipmentsCount={visibleShipments.length}
              totalShipmentsCount={shipments.length}
            />

            <FeedbackAlert feedback={feedback} />

            {loading ? (
              <div className="user-surface mt-6 px-6 py-8 text-sm text-stone-600">
                Loading your assigned deliveries...
              </div>
            ) : shipments.length === 0 ? (
              <div className="user-surface mt-6 px-6 py-10 md:px-8">
                <p className="user-label">No Active Assignments</p>
                <h3 className="user-display mt-3 text-3xl font-semibold text-stone-900">
                  Your delivery queue is currently clear
                </h3>
                <p className="user-muted mt-3 max-w-2xl text-sm leading-7">
                  Once operations assigns a shipment to you, it will appear here
                  with the next required courier action and update controls.
                </p>
              </div>
            ) : visibleShipments.length === 0 ? (
              <div className="user-surface mt-6 px-6 py-10 md:px-8">
                <p className="user-label">No Matching Deliveries</p>
                <h3 className="user-display mt-3 text-3xl font-semibold text-stone-900">
                  No deliveries match the selected view
                </h3>
                <p className="user-muted mt-3 max-w-2xl text-sm leading-7">
                  Switch to a different delivery view from the left panel to
                  bring the rest of your queue back into focus.
                </p>
              </div>
            ) : (
              <div className="mt-6">
                <AssignedShipmentsList
                  shipments={visibleShipments}
                  submittingId={submittingId}
                  getTrackingForm={getTrackingForm}
                  onTrackingFormChange={updateTrackingForm}
                  onTrackingSubmit={handleTrackingSubmit}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
