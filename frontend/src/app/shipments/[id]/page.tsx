"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import CurrentStatusCard from "../../../components/tracking/current-status-card";
import TrackingHistoryList from "../../../components/tracking/tracking-history-list";
import FeedbackAlert from "../../../components/feedback-alert";
import { FeedbackState, ShipmentUpdate } from "../../../lib/types";
import { fetchTrackingEvents } from "../../../lib/api";
import { redirectToLoginIfUnauthorized } from "../../../lib/route-guards";

export default function ShipmentTrackingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const shipmentId = typeof params?.id === "string" ? params.id : "";
  const [lastEvent, setLastEvent] = useState<ShipmentUpdate | null>(null);
  const [events, setEvents] = useState<ShipmentUpdate[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router)) {
      return;
    }

    if (!shipmentId) {
      return;
    }

    setFeedback(null);
    fetchTrackingEvents(shipmentId)
      .then((data) => {
        setEvents(data.slice().reverse().slice(0, 5));
        setLastEvent(data.length > 0 ? data[data.length - 1] : null);
      })
      .catch(() => {
        setFeedback({
          type: "error",
          message: "Failed to load tracking history."
        });
      });

    const token = localStorage.getItem("access_token");
    const socket = io("http://localhost:3001", {
      auth: {
        token
      }
    });

    const handleShipmentUpdate = (payload: ShipmentUpdate) => {
      setLastEvent(payload);
      setEvents((prev) => [payload, ...prev].slice(0, 5));
    };

    socket.emit("joinShipmentRoom", { shipmentId });
    socket.on("shipment-status-update", handleShipmentUpdate);

    return () => {
      socket.off("shipment-status-update", handleShipmentUpdate);
      socket.emit("leaveShipmentRoom", { shipmentId });
      socket.disconnect();
    };
  }, [router, shipmentId]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f7f4] to-[#e7ece8] p-8">
      <h1 className="text-3xl font-bold">Shipment Tracking</h1>
      <p className="mt-2 text-gray-700">Real-time updates will appear below:</p>

      <FeedbackAlert feedback={feedback} />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <CurrentStatusCard lastEvent={lastEvent} />
        <TrackingHistoryList events={events} />
      </div>
    </main>
  );
}
