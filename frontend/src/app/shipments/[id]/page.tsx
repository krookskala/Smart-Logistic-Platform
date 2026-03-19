"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import CurrentStatusCard from "../../../components/tracking/current-status-card";
import TrackingHistoryList from "../../../components/tracking/tracking-history-list";
import { ShipmentUpdate } from "../../../lib/types";
import { fetchTrackingEvents } from "../../../lib/api";
import { getStoredAuthUser } from "../../../lib/auth";

export default function ShipmentTrackingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const shipmentId = typeof params?.id === "string" ? params.id : "";
  const [lastEvent, setLastEvent] = useState<ShipmentUpdate | null>(null);
  const [events, setEvents] = useState<ShipmentUpdate[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = getStoredAuthUser();

    if (!token || !user) {
      router.push("/login");
      return;
    }

    if (!shipmentId) {
      return;
    }

    fetchTrackingEvents(shipmentId).then((data) => {
      setEvents(data.slice().reverse().slice(0, 5));
      setLastEvent(data.length > 0 ? data[data.length - 1] : null);
    });

    const socket = io("http://localhost:3001");

    socket.on("shipment-status-update", (payload: ShipmentUpdate) => {
      if (payload.shipmentId !== shipmentId) {
        return;
      }

      setLastEvent(payload);
      setEvents((prev) => [payload, ...prev].slice(0, 5));
    });

    return () => {
      socket.disconnect();
    };
  }, [router, shipmentId]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f7f4] to-[#e7ece8] p-8">
      <h1 className="text-3xl font-bold">Shipment Tracking</h1>
      <p className="mt-2 text-gray-700">Real-time updates will appear below:</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <CurrentStatusCard lastEvent={lastEvent} />
        <TrackingHistoryList events={events} />
      </div>
    </main>
  );
}
