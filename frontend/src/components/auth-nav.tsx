"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthNav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = localStorage.getItem("access_token");
    setLoggedIn(Boolean(session));
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    setLoggedIn(false);
    router.push("/login");
  }

  if (loggedIn) {
    return (
      <button onClick={handleLogout} className="text-gray-700 hover:text-black">
        Logout
      </button>
    );
  }

  return (
    <Link href="/login" className="text-gray-700 hover:text-black">
      Login
    </Link>
  );
}
