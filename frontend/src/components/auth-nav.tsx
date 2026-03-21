"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "./toast-provider";

export default function AuthNav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("access_token");
    setLoggedIn(Boolean(session));
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  function handleLogout() {
    if (loggingOut) {
      return;
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    setLoggedIn(false);
    setLoggingOut(true);
    showToast({
      type: "success",
      message: "Signed out successfully. Redirecting to login."
    });

    logoutTimerRef.current = setTimeout(() => {
      router.push("/login");
      setLoggingOut(false);
    }, 1200);
  }

  if (loggedIn) {
    return (
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="text-gray-700 hover:text-black disabled:opacity-60"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    );
  }

  return (
    <Link href="/login" className="text-gray-700 hover:text-black">
      Login
    </Link>
  );
}
