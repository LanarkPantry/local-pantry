"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, signOut } from "./lib/authClient";

export default function AccountNav() {
  const [userEmail, setUserEmail] = useState("");
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const user = await getUser();

      if (user?.email) {
        setUserEmail(user.email);
      }

      setCheckingUser(false);
    }

    void loadUser();
  }, []);

  if (checkingUser) {
    return null;
  }

  if (!userEmail) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-[#d6cec2] bg-white/80 px-3 py-1.5 text-xs text-[#243328] transition hover:bg-white"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[180px] truncate text-xs text-[#667164] md:block">
        {userEmail}
      </span>

      <button
        type="button"
        onClick={async () => {
          await signOut();
          window.location.href = "/login";
        }}
        className="rounded-full border border-[#d6cec2] bg-white/80 px-3 py-1.5 text-xs text-[#243328] transition hover:bg-white"
      >
        Logout
      </button>
    </div>
  );
}
