"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type NGO = {
  id: number;
  name: string;
  domain: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  yearsActive: number;
  verified: boolean;
  impactMetric: string;
  pastCSRPartners: string | null;
};

type ShortlistEntry = {
  id: number;
  ngoId: number;
  ngo: NGO;
};

export default function ComparePage() {
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

  async function handleRemove(shortlistId: number) {
    await fetch("/api/shortlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: shortlistId }),
    });
    setEntries((prev) => prev.filter((e) => e.id !== shortlistId));
  }

  const factors = [
    { label: "Domain", get: (n: NGO) => n.domain },
    { label: "Geography", get: (n: NGO) => n.city },
    {
      label: "Budget range",
      get: (n: NGO) =>
        `₹${(n.budgetMin / 100000).toFixed(1)}L - ₹${(n.budgetMax / 100000).toFixed(1)}L`,
    },
    { label: "Years active", get: (n: NGO) => `${n.yearsActive} years` },
    { label: "Verification", get: (n: NGO) => (n.verified ? "Verified" : "Pending") },
    { label: "Impact", get: (n: NGO) => n.impactMetric },
    { label: "Past CSR partners", get: (n: NGO) => n.pastCSRPartners || "—" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />
      <div className="px-8 lg:px-24 py-6 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-sans font-extrabold text-3xl">
            Compare Shortlisted NGOs
          </h1>
          <button
            onClick={() => router.push("/shortlist")}
            className="text-sm font-semibold text-muted"
          >
            ← Back to shortlist
          </button>
        </div>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <p className="text-xl font-semibold">
              Shortlist some NGOs to compare them here
            </p>
            <p className="text-muted text-sm max-w-md text-center">
              Head to Discover NGOs or Quick Match, shortlist a few, then come back to see them side by side.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/domains")}
                className="rounded-full bg-lavender px-8 py-3 font-bold"
              >
                Discover NGOs
              </button>
              <button
                onClick={() => router.push("/quick-match")}
                className="rounded-full bg-white border border-gray-300 px-8 py-3 font-bold"
              >
                Quick match
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-left"></th>
                  {factors.map((f) => (
                    <th key={f.label} className="text-left px-4 pb-2 text-sm text-muted font-semibold whitespace-nowrap">
                      {f.label}
                    </th>
                  ))}
                  <th className="text-left px-4 pb-2 text-sm text-muted font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="bg-white">
                    <td className="rounded-l-2xl px-5 py-4 font-bold whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/ngo/${entry.ngoId}`)}
                        className="hover:underline text-left"
                      >
                        {entry.ngo.name}
                      </button>
                    </td>
                    {factors.map((f) => (
                      <td key={f.label} className="px-4 py-4 text-sm whitespace-nowrap">
                        {f.get(entry.ngo)}
                      </td>
                    ))}
                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/ngo/${entry.ngoId}`)}
                          className="rounded-full bg-field-grey px-4 py-2 text-xs font-semibold whitespace-nowrap"
                        >
                          View profile
                        </button>
                        <button
                          onClick={() => router.push(`/ngo/${entry.ngoId}`)}
                          className="rounded-full bg-lime px-4 py-2 text-xs font-bold whitespace-nowrap"
                        >
                          Send EOI →
                        </button>
                        <button
                          onClick={() => handleRemove(entry.id)}
                          className="rounded-full bg-danger text-white w-8 h-8 flex items-center justify-center text-xs font-bold"
                          title="Remove from shortlist"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}