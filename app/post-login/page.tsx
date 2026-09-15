"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    async function redirect() {
      const role = (session?.user as any)?.role;
      if (role === "ngo") {
        const res = await fetch("/api/ngo-me");
        router.replace(res.ok ? "/ngo-status" : "/ngo-register");
      } else {
        router.replace("/domains");
      }
    }
    redirect();
  }, [status, session, router]);

  return (
    <main className="min-h-screen bg-[#F7F5FC] flex items-center justify-center">
      <p className="text-muted">Redirecting...</p>
    </main>
  );
}