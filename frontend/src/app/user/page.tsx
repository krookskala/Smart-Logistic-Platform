"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuthUser } from "../../lib/auth";
import { createShipment, fetchShipments, Shipment } from "../../lib/api";
import { FeedbackState } from "../../lib/types";
import FeedbackAlert from "../../components/feedback-alert";
import CreateShipmentForm from "../../components/user/create-shipment-form";
import ShipmentList from "../../components/user/shipment-list";

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
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to create shipment."
      });
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = getStoredAuthUser();

    if (!token || !user) {
      router.push("/login");
      return;
    }

    if (user.role !== "USER") {
      router.push("/login");
      return;
    }

    fetchShipments()
      .then((data) => setShipments(data))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f7f4] to-[#e7ece8] p-8">
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">My Shipments</h1>
          <p className="mt-2 text-gray-700">
            Create new shipments and track your active deliveries.
          </p>
        </div>

        <FeedbackAlert feedback={feedback} />

        <CreateShipmentForm
          form={form}
          submitting={submitting}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />

        {loading ? (
          <p className="mt-6 text-gray-500">Loading...</p>
        ) : shipments.length === 0 ? (
          <p className="mt-6 text-gray-500">No shipments yet.</p>
        ) : (
          <ShipmentList shipments={shipments} />
        )}
      </div>
    </main>
  );
}
