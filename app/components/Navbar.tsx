"use client";

import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-navy text-white">
      <span className="font-serif text-2xl tracking-widest">SETU</span>
      <div className="flex items-center gap-8 text-sm font-medium">
        {role === "ngo" ? (
          <>
            <a href="/ngo-status">My NGO</a>
            <a href="/ngo-profile-builder">Profile</a>
            <a href="/ngo-eoi-inbox">EOI Inbox</a>
          </>
        ) : (
          <>
            <a href="/domains">Discover NGOs</a>
            <a href="/shortlist">Shortlist</a>
          </>
        )}
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-full bg-white text-navy px-5 py-2 font-semibold"
          >
            Sign out
          </button>
        ) : (
          <a href="/">Login</a>
        )}
      </div>
    </nav>
  );
}