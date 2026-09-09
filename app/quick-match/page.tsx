"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type NGO = {
  id: number;
  name: string;
  verified: boolean;
  domain: string;
  city: string;
  description: string;
  budgetMin: number;
  matchScore: number;
};

type HistoryEntry = {
  ngo: NGO;
  action: "shortlisted" | "skipped";
  shortlistId?: number;
};

export default function QuickMatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/match?${searchParams.toString()}`);
      const data = await res.json();
      setNgos(data);
      setLoading(false);
    }
    load();
  }, [searchParams]);

  function imageFor(ngo: NGO) {
    return `https://picsum.photos/seed/${ngo.id}/700/500`;
  }

  const current = ngos[index];
  const next = ngos[index + 1];
  const nextNext = ngos[index + 2];
  const done = index >= ngos.length;

  const shortlistedCount = history.filter((h) => h.action === "shortlisted").length;
  const skippedCount = history.filter((h) => h.action === "skipped").length;

  async function advance(action: "shortlisted" | "skipped", direction: "left" | "right") {
    if (!current || animating) return;
    setAnimating(true);
    setExitDirection(direction);

    let shortlistId: number | undefined;
    if (action === "shortlisted") {
      const res = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ngoId: current.id }),
      });
      const data = await res.json();
      shortlistId = data.id;
    }

    setHistory((h) => [...h, { ngo: current, action, shortlistId }]);

    setTimeout(() => {
      setIndex((i) => i + 1);
      setExitDirection(null);
      setAnimating(false);
    }, 300);
  }

  async function handleUndo() {
    if (history.length === 0 || animating) return;
    const last = history[history.length - 1];

    if (last.action === "shortlisted" && last.shortlistId) {
      await fetch("/api/shortlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: last.shortlistId }),
      });
    }

    setHistory((h) => h.slice(0, -1));
    setIndex((i) => i - 1);
  }

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />
      <div className="px-8 lg:px-24 py-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-sans font-extrabold text-3xl">Quick match</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/shortlist")}
              className="text-sm font-semibold text-muted"
            >
              Shortlist →
            </button>
            <button
              onClick={() => router.push("/compare")}
              className="text-sm font-semibold text-muted"
            >
              Compare →
            </button>
            <button
              onClick={() => router.push(`/matching?${searchParams.toString()}`)}
              className="text-sm font-semibold text-muted"
            >
              ← Back to results
            </button>
          </div>
        </div>

        {!loading && ngos.length > 0 && (
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="rounded-full bg-white px-4 py-1.5 font-medium">
              💚 {shortlistedCount}
            </span>
            <span className="rounded-full bg-white px-4 py-1.5 font-medium">
              ✕ {skippedCount}
            </span>
            <span className="rounded-full bg-white px-4 py-1.5 font-medium">
              {Math.min(index + 1, ngos.length)} / {ngos.length}
            </span>
            {history.length > 0 && (
              <button
                onClick={handleUndo}
                className="rounded-full bg-white border border-gray-300 px-4 py-1.5 font-semibold text-muted flex items-center gap-1"
              >
                ↺ Undo
              </button>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-muted">Loading NGOs...</p>
        ) : done ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <p className="text-2xl font-bold">
              {ngos.length === 0 ? "No NGOs matched your filters" : "You've seen all matches"}
            </p>
            <div className="flex gap-4">
              {history.length > 0 && (
                <button
                  onClick={handleUndo}
                  className="rounded-full bg-white border border-gray-300 px-8 py-3 font-bold"
                >
                  ↺ Undo last
                </button>
              )}
              <button
                onClick={() => router.push("/shortlist")}
                className="rounded-full bg-navy text-white px-8 py-3 font-bold"
              >
                View your shortlist
              </button>
              <button
                onClick={() => router.push("/compare")}
                className="rounded-full bg-lavender px-8 py-3 font-bold"
              >
                Compare shortlisted
              </button>
              <button
                onClick={() => router.push(`/matching?${searchParams.toString()}`)}
                className="rounded-full bg-white border border-gray-300 px-8 py-3 font-bold"
              >
                Back to results
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center gap-4 overflow-hidden">
              {/* left ghost stack (already-decided cards, faded) */}
              <div className="w-24 h-72 rounded-2xl bg-skeleton-grey opacity-30 shrink-0" />
              <div className="w-32 h-80 rounded-2xl bg-skeleton-grey opacity-40 shrink-0" />

              {/* active card */}
              <div
                className="relative w-[420px] h-[560px] shrink-0 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ease-in"
                style={{
                  transform:
                    exitDirection === "left"
                      ? "translateX(-120%) rotate(-8deg)"
                      : exitDirection === "right"
                      ? "translateX(120%) rotate(8deg)"
                      : "translateX(0) rotate(0deg)",
                  opacity: exitDirection ? 0 : 1,
                }}
              >
                <img
                  src={imageFor(current)}
                  alt={current.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <span className="absolute top-4 right-4 bg-black/60 text-yellow-400 text-sm font-bold italic px-3 py-1 rounded-full">
                  {current.matchScore}% match
                </span>

                <div className="absolute bottom-0 left-0 right-0 px-6 py-6">
                  <p className="text-white font-extrabold text-3xl flex items-center gap-2">
                    {current.name}
                    {current.verified && (
                      <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        ✔
                      </span>
                    )}
                  </p>
                  <p className="text-white/90 text-sm italic my-2 max-w-sm">
                    {current.description}
                  </p>
                  <div className="flex justify-between text-white/90 text-sm mt-3">
                    <span>📍 {current.city}</span>
                    <span>$ Budget: ₹{current.budgetMin.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* right ghost stack (upcoming cards) */}
              <div className="w-32 h-80 rounded-2xl overflow-hidden opacity-40 shrink-0 bg-skeleton-grey">
                {next && (
                  <img
                    src={imageFor(next)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="w-24 h-72 rounded-2xl overflow-hidden opacity-25 shrink-0 bg-skeleton-grey">
                {nextNext && (
                  <img
                    src={imageFor(nextNext)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-center gap-8 mt-6 pb-6">
              <button
                onClick={() => advance("skipped", "left")}
                disabled={animating}
                className="w-16 h-16 rounded-full bg-white border-2 border-danger text-danger text-2xl font-bold flex items-center justify-center shadow-md hover:scale-105 transition disabled:opacity-50"
              >
                ✕
              </button>
              <button
                onClick={() => advance("shortlisted", "right")}
                disabled={animating}
                className="w-16 h-16 rounded-full bg-lime text-navy text-2xl font-bold flex items-center justify-center shadow-md hover:scale-105 transition disabled:opacity-50"
              >
                ♥
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}