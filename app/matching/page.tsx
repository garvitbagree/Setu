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
  state: string;
  budgetMin: number;
  budgetMax: number;
  matchScore: number;
};

export default function MatchingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [shortlisted, setShortlisted] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/match?${searchParams.toString()}`);
      const data = await res.json();
      setNgos(data);
      setLoading(false);
    }
    load();
    if (searchParams.toString()) {
      sessionStorage.setItem("setu_last_filters", searchParams.toString());
    }
  }, [searchParams]);

  const filtered = ngos.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase())
  );
  const displayed = showAll ? filtered : filtered.slice(0, 3);

  async function handleShortlist(ngoId: number) {
    await fetch("/api/shortlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ngoId }),
    });
    setShortlisted((prev) => [...prev, ngoId]);
  }

  function removeFilter(...keys: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    keys.forEach((k) => params.delete(k));
    router.push(`/matching?${params.toString()}`);
  }

  const domainsParam = searchParams.get("domains") || "";
  const cityParam = searchParams.get("city") || "";
  const budgetMin = searchParams.get("budgetMin");
  const budgetMax = searchParams.get("budgetMax");

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />

      <div className="px-8 lg:px-24 py-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-sans font-extrabold text-3xl">
            {loading ? "Searching..." : `${filtered.length} NGOs found`}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/compare")}
              className="rounded-full bg-white border border-gray-300 px-6 py-3 font-bold"
            >
              Compare
            </button>
            <button
              onClick={() => router.push(`/quick-match?${searchParams.toString()}`)}
              className="rounded-full bg-lavender px-6 py-3 font-bold italic flex items-center gap-2"
            >
              ✨ Quick match
            </button>
          </div>
        </div>

        <div className="relative mb-4 max-w-2xl">
          <input
            type="text"
            placeholder={`Search within ${filtered.length} matching NGOs...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full bg-white border border-gray-200 px-5 py-3 text-sm outline-none"
          />
        </div>

        {/* Active filters */}
        <div className="mb-6">
          <p className="font-semibold text-sm mb-2">Active filters</p>
          <div className="flex flex-wrap gap-3 items-center">
            {domainsParam && (
              <span className="rounded-full bg-white border border-gray-200 px-4 py-2 text-sm flex items-center gap-2">
                {domainsParam}
                <button onClick={() => removeFilter("domains")} className="text-muted">✕</button>
              </span>
            )}
            {cityParam && (
              <span className="rounded-full bg-white border border-gray-200 px-4 py-2 text-sm flex items-center gap-2">
                {cityParam}
                <button onClick={() => removeFilter("city")} className="text-muted">✕</button>
              </span>
            )}
            {budgetMin && budgetMax && (
              <span className="rounded-full bg-white border border-gray-200 px-4 py-2 text-sm flex items-center gap-2">
                ₹{Number(budgetMin).toLocaleString("en-IN")} - ₹{Number(budgetMax).toLocaleString("en-IN")}
                <button onClick={() => removeFilter("budgetMin", "budgetMax")} className="text-muted">✕</button>
              </span>
            )}
            <button
              onClick={() => router.push(`/additional-features?${searchParams.toString()}`)}
              className="text-sm font-semibold"
            >
              + Additional filters
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {showAll ? "All matches" : "Top 3 matches"}
          </h2>
          {!showAll && filtered.length > 3 && (
            <button
              onClick={() => setShowAll(true)}
              className="text-sm text-muted font-medium"
            >
              Show entire list
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-muted">Loading NGOs...</p>
        ) : displayed.length === 0 ? (
          <p className="text-muted">No NGOs match your filters. Try widening your budget range or removing a filter.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayed.map((ngo) => (
              <div
                key={ngo.id}
                className="rounded-2xl overflow-hidden bg-white shadow-sm"
              >
                <div className="relative h-40 bg-skeleton-grey">
                  <img
                    src={`https://picsum.photos/seed/${ngo.id}/500/300`}
                    alt={ngo.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-black/60 text-yellow-400 text-xs font-bold italic px-2 py-1 rounded-full">
                    {ngo.matchScore}% match
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2">
                    <p className="text-white font-bold flex items-center gap-1">
                      {ngo.name}
                      {ngo.verified && <span className="text-xs">✔</span>}
                    </p>
                    <p className="text-white/80 text-xs">📍 {ngo.city}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Domain:</span> {ngo.domain}
                  </p>
                  <p className="text-sm mb-4">
                    <span className="font-semibold">Budget:</span> ₹{ngo.budgetMax.toLocaleString("en-IN")}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/ngo/${ngo.id}?${searchParams.toString()}`)}
                      className="flex-1 rounded-full bg-field-grey px-4 py-2 text-sm font-medium"
                    >
                      View profile
                    </button>
                    <button
                      onClick={() => handleShortlist(ngo.id)}
                      disabled={shortlisted.includes(ngo.id)}
                      className="flex-1 rounded-full bg-lavender px-4 py-2 text-sm font-bold disabled:opacity-50"
                    >
                      {shortlisted.includes(ngo.id) ? "Shortlisted ✓" : "Shortlist →"}
                    </button>
                  </div>
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