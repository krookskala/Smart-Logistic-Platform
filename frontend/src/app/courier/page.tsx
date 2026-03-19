"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { redirectToLoginIfUnauthorized } from "../../lib/route-guards";
import { fetchShipments, Shipment, createTrackingEvent } from "../../lib/api";
import { FeedbackState, TrackingFormState } from "../../lib/types";
import FeedbackAlert from "../../components/feedback-alert";
import AssignedShipmentsList from "../../components/courier/assigned-shipments-list";

export default function CourierDashboardPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingForms, setTrackingForms] = useState<
    Record<string, TrackingFormState>
  >({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  function getTrackingForm(shipmentId: string): TrackingFormState {
    return (
      trackingForms[shipmentId] || {
        status: "IN_TRANSIT",
        note: "",
        locationLat: "",
        locationLng: ""
      }
    );
  }

  function updateTrackingForm(
    shipmentId: string,
    field: keyof TrackingFormState,
    value: string
  ) {
    setTrackingForms((prev) => ({
      ...prev,
      [shipmentId]: {
        ...getTrackingForm(shipmentId),
        [field]: value
      }
    }));
  }

  async function handleTrackingSubmit(shipmentId: string) {
    const form = getTrackingForm(shipmentId);
    setSubmittingId(shipmentId);
    setFeedback(null);

    try {
      await createTrackingEvent(shipmentId, {
        status: form.status,
        note: form.note || undefined,
        locationLat: form.locationLat ? Number(form.locationLat) : undefined,
        locationLng: form.locationLng ? Number(form.locationLng) : undefined
      });

      const refreshed = await fetchShipments();
      setShipments(refreshed);

      setTrackingForms((prev) => ({
        ...prev,
        [shipmentId]: {
          status: "IN_TRANSIT",
          note: "",
          locationLat: "",
          locationLng: ""
        }
      }));

      setFeedback({
        type: "success",
        message: "Tracking updated successfully."
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to update tracking."
      });
    } finally {
      setSubmittingId(null);
    }
  }

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["COURIER"])) {
      return;
    }

    setFeedback(null);

    fetchShipments()
      .then((data) => setShipments(data))
      .catch(() => {
        setFeedback({
          type: "error",
          message: "Failed to load assigned deliveries."
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f7f4] to-[#e7ece8] p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Courier Panel</h1>
        <p className="mt-2 text-gray-700">
          View assigned deliveries and update shipment tracking in real time.
        </p>

        <FeedbackAlert feedback={feedback} />

        {loading ? (
          <p className="mt-6 text-gray-500">Loading assigned deliveries...</p>
        ) : shipments.length === 0 ? (
          <p className="mt-6 text-gray-500">No assigned deliveries yet.</p>
        ) : (
          <AssignedShipmentsList
            shipments={shipments}
            submittingId={submittingId}
            getTrackingForm={getTrackingForm}
            onTrackingFormChange={updateTrackingForm}
            onTrackingSubmit={handleTrackingSubmit}
          />
        )}
      </div>
    </main>
  );
}
