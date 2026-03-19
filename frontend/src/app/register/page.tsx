"use client";

import { useState } from "react";
import { registerUser } from "../../lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await registerUser(form);
      setMessage("Registration successful. You can now login.");
      setForm({ email: "", password: "" });
    } catch {
      setMessage("Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f7f4] to-[#e7ece8] p-8">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="mt-2 text-sm text-gray-600">Create your account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Register"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </main>
  );
}
