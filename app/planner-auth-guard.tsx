"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "./lib/authClient";

export default function PlannerAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const user = await getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setChecking(false);
    }

    void checkUser();
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4efe9] px-4 text-[#243328]">
        <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6 text-center">
          <p className="font-serif text-2xl">Checking your account...</p>
          <p className="mt-2 text-sm text-[#5f675c]">
            Just making sure you’re signed in.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
