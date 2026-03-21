"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/api";
import AuthShell from "../../components/auth/auth-shell";
import AuthSidePanel from "../../components/auth/auth-side-panel";
import { useToast } from "../../components/toast-provider";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await registerUser(form);
      setRedirecting(true);
      showToast({
        type: "success",
        message: "Account created successfully. Redirecting to sign in."
      });
      setForm({ email: "", password: "" });

      redirectTimerRef.current = setTimeout(() => {
        router.push("/login");
      }, 1600);
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Account creation could not be completed. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AuthShell
        formAccent="amber"
        sidePanel={
          <AuthSidePanel
            eyebrow="New Account Setup"
            title="Create your Smart Logistics account and step into a clearer delivery workflow."
            description="Register once to start using a role-aware logistics platform built for shipment visibility, operational coordination, and dependable delivery oversight."
            highlights={[
              "Get access to a workflow designed for modern delivery teams",
              "Move from account setup into the right workspace with minimal friction",
              "Start with structured shipment tracking and role-based operations"
            ]}
            accent="amber"
          />
        }
        formPanel={
          <div>
            <p className="landing-label">Platform Onboarding</p>
            <h2 className="landing-display mt-4 text-4xl font-semibold text-slate-950">
              Create account
            </h2>
            <p className="landing-muted mt-3 text-base leading-8">
              Set up your Smart Logistics account to access the platform and
              continue into the workspace aligned with your role.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  className="auth-input mt-2"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={submitting || redirecting}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  className="auth-input mt-2"
                  type="password"
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={submitting || redirecting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || redirecting}
                className="w-full rounded-full bg-slate-950 px-5 py-3 text-base font-semibold text-white transition disabled:opacity-60"
              >
                {submitting
                  ? "Creating Account..."
                  : redirecting
                  ? "Redirecting..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-slate-950 underline">
                Sign in instead
              </Link>
            </p>
          </div>
        }
      />
    </>
  );
}
