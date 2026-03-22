"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loginUser } from "../../lib/api";
import { useRouter } from "next/navigation";
import AuthShell from "../../components/auth/auth-shell";
import AuthSidePanel from "../../components/auth/auth-side-panel";
import { useToast } from "../../components/toast-provider";

export default function LoginPage() {
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
      const result = await loginUser(form);
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("refresh_token", result.refresh_token);
      localStorage.setItem("auth_user", JSON.stringify(result.user));

      let destination = "/user";

      if (result.user.role === "ADMIN") {
        destination = "/admin";
      } else if (result.user.role === "COURIER") {
        destination = "/courier";
      }

      setRedirecting(true);
      showToast({
        type: "success",
        message: "Signed in successfully. Opening your workspace now."
      });

      redirectTimerRef.current = setTimeout(() => {
        router.push(destination);
      }, 1600);
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Sign-in could not be completed. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AuthShell
        formAccent="sky"
        sidePanel={
          <AuthSidePanel
            eyebrow="Secure Access"
            title="Return to the workspace that keeps your logistics operations moving."
            description="Sign in to access the Smart Logistics environment assigned to your role, review current activity, and continue from the operational context already in progress."
            highlights={[
              "Role-aware access for customers, couriers, and administrators",
              "Immediate visibility into active shipments and delivery progress",
              "A cleaner interface for coordinated logistics work"
            ]}
            accent="sky"
          />
        }
        formPanel={
          <div>
            <p className="landing-label">Workspace Access</p>
            <h2 className="landing-display mt-4 text-4xl font-semibold text-slate-950">
              Sign in
            </h2>
            <p className="landing-muted mt-3 text-base leading-8">
              Use your account credentials to open the Smart Logistics workspace
              assigned to your responsibilities.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
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
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
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
                  ? "Signing In..."
                  : redirecting
                    ? "Redirecting..."
                    : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              New to Smart Logistics?{" "}
              <Link
                href="/register"
                className="font-semibold text-slate-950 underline"
              >
                Create your account
              </Link>
            </p>
          </div>
        }
      />
    </>
  );
}
