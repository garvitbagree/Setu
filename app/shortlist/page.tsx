"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

type ShortlistEntry = {
  id: number;
  ngoId: number;
  status: string;
  ngo: {
    id: number;
    name: string;
    domain: string;
  };
};

export default function ShortlistPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ShortlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/shortlist");
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRemove(id: number) {
    await fetch("/api/shortlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />
      <div className="px-8 lg:px-24 py-6 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-sans font-extrabold text-3xl">Shortlists</h1>
          {entries.length > 0 && (
            <button
              onClick={() => router.push("/compare")}
              className="font-bold text-lavender"
            >
              Compare
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <p className="text-xl font-semibold">No NGOs shortlisted yet</p>
            <button
              onClick={() => router.push("/domains")}
              className="rounded-full bg-lavender px-8 py-3 font-bold"
            >
              Discover NGOs
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl">
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className={`rounded-2xl flex items-center justify-between px-6 py-5 ${
                  i === 0 ? "bg-lavender/20" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">{i + 1}.</span>
                  <span className="font-bold text-lg">{entry.ngo.name}</span>
                  <span className="text-muted text-sm">{entry.ngo.domain}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRemove(entry.id)}
                    className="rounded-full bg-danger text-white px-5 py-2 text-sm font-bold"
                  >
                    Remove ✕
                  </button>
                  <button
                    onClick={() => router.push(`/ngo/${entry.ngoId}`)}
                    className="rounded-full bg-lime px-5 py-2 text-sm font-bold"
                  >
                    View details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}