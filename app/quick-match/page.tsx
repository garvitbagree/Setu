"use client";

import { Suspense, useEffect, useState } from "react";
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
  budgetMax: number;
  matchScore: number;
};

type HistoryEntry = {
  ngo: NGO;
  action: "shortlisted" | "skipped";
  shortlistId?: number;
};

export default function QuickMatchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5FC]" />}>
      <QuickMatchContent />
    </Suspense>
  );
}

function QuickMatchContent() {
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
    }, 280);
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
    <main className="h-screen bg-gradient-to-br from-[#F0EBFA] to-[#F7F5FC] w-full flex flex-col overflow-hidden">
      <Navbar />
      <div className="px-8 lg:px-24 py-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-sans font-extrabold text-2xl">Quick match</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/matching?${searchParams.toString()}`)}
              className="text-sm font-semibold text-muted hover:text-navy transition"
            >
              ← Back to results
            </button>
            <button
              onClick={() => router.push("/shortlist")}
              className="text-sm font-semibold text-muted hover:text-navy transition"
            >
              Shortlist →
            </button>
            <button
              onClick={() => router.push("/compare")}
              className="text-sm font-semibold text-muted hover:text-navy transition"
            >
              Compare →
            </button>
          </div>
        </div>

        {!loading && ngos.length > 0 && (
          <div className="flex items-center gap-2 mb-3 text-xs">
            <span className="rounded-full bg-white shadow-sm px-3 py-1 font-medium">💚 {shortlistedCount}</span>
            <span className="rounded-full bg-white shadow-sm px-3 py-1 font-medium">✕ {skippedCount}</span>
            <span className="rounded-full bg-white shadow-sm px-3 py-1 font-medium">
              {Math.min(index + 1, ngos.length)} / {ngos.length}
            </span>
            {history.length > 0 && (
              <button
                onClick={handleUndo}
                className="rounded-full bg-white shadow-sm border border-gray-200 px-3 py-1 font-semibold text-muted"
              >
                ↺ Undo
              </button>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-muted">Loading NGOs...</p>
        ) : done ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <p className="text-xl font-bold">
              {ngos.length === 0 ? "No NGOs matched your filters" : "You've seen all matches"}
            </p>
            <div className="flex gap-3">
              {history.length > 0 && (
                <button
                  onClick={handleUndo}
                  className="rounded-full bg-white border border-gray-300 px-6 py-2.5 text-sm font-bold"
                >
                  ↺ Undo last
                </button>
              )}
              <button
                onClick={() => router.push("/shortlist")}
                className="rounded-full bg-navy text-white px-6 py-2.5 text-sm font-bold"
              >
                View shortlist
              </button>
              <button
                onClick={() => router.push("/compare")}
                className="rounded-full bg-lavender px-6 py-2.5 text-sm font-bold"
              >
                Compare
              </button>
              <button
                onClick={() => router.push(`/matching?${searchParams.toString()}`)}
                className="rounded-full bg-white border border-gray-300 px-6 py-2.5 text-sm font-bold"
              >
                Back to results
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center gap-10 min-h-0">
              {/* Left info panel — fills the empty space, gives context */}
              <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                  <p className="text-xs text-muted mb-1">Currently viewing</p>
                  <p className="font-bold text-lg">{current.name}</p>
                  <p className="text-sm text-muted mt-1">{current.domain}</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                  <p className="text-xs text-muted mb-2">How it works</p>
                  <p className="text-sm">Swipe left to skip, right to shortlist. Use undo if you change your mind.</p>
                </div>
              </div>

              <div className="relative w-full max-w-sm h-full max-h-[400px]">
                {next && (
                  <div className="absolute inset-0 translate-y-2 scale-[0.96] rounded-3xl overflow-hidden opacity-50">
                    <img src={imageFor(next)} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div
                  className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl transition-all duration-[280ms] ease-in"
                  style={{
                    transform:
                      exitDirection === "left"
                        ? "translateX(-130%) rotate(-10deg)"
                        : exitDirection === "right"
                        ? "translateX(130%) rotate(10deg)"
                        : "translateX(0) rotate(0deg)",
                    opacity: exitDirection ? 0 : 1,
                  }}
                >
                  <img
                    src={imageFor(current)}
                    alt={current.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/0" />

                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-yellow-400 text-xs font-bold italic px-3 py-1 rounded-full">
                    {current.matchScore}% match
                  </span>
                  {current.verified && (
                    <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center text-white text-sm">
                      ✔
                    </span>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                    <p className="text-white font-extrabold text-2xl leading-tight">
                      {current.name}
                    </p>
                    <p className="text-white/85 text-xs italic mt-1 mb-2 line-clamp-2">
                      {current.description}
                    </p>
                    <div className="flex justify-between items-center text-white/90 text-xs border-t border-white/20 pt-2">
                      <span>📍 {current.city}</span>
                      <span className="font-semibold">₹{current.budgetMax.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right actions panel — fills empty space with controls */}
              <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
                <button
                  onClick={() => router.push(`/ngo/${current.id}`)}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm text-left hover:bg-white transition"
                >
                  <p className="font-semibold text-sm mb-1">View full profile</p>
                  <p className="text-xs text-muted">See projects, team, and registrations before deciding.</p>
                </button>
                {history.length > 0 && (
                  <button
                    onClick={handleUndo}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm text-left hover:bg-white transition"
                  >
                    <p className="font-semibold text-sm mb-1">↺ Undo last action</p>
                    <p className="text-xs text-muted">Bring back the previous card.</p>
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center gap-6 py-3 shrink-0">
              <button
                onClick={() => advance("skipped", "left")}
                disabled={animating}
                className="w-12 h-12 rounded-full bg-white border-2 border-danger text-danger text-lg font-bold flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition disabled:opacity-50"
              >
                ✕
              </button>
              <button
                onClick={() => advance("shortlisted", "right")}
                disabled={animating}
                className="w-12 h-12 rounded-full bg-lime text-navy text-lg font-bold flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition disabled:opacity-50"
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