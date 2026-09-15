"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Mandate = {
  id: number;
  userId: number;
  companyName: string;
  objective: string;
  domains: string;
  state: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  projectTimeline: string | null;
  verificationRequired: string | null;
  user: { name: string | null };
};

export default function BrowseMandatesPage() {
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [sentIds, setSentIds] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/mandates-browse");
      if (res.ok) setMandates(await res.json());
      setLoading(false);
    }
    load();
  }, []);

  function openForm(id: number) {
    setActiveId(id);
    setMessage("");
    setBudget("");
    setError("");
  }

  async function handleSend(mandate: Mandate) {
    if (!message) {
      setError("Add a short message before sending.");
      return;
    }
    setSending(true);
    const res = await fetch("/api/eoi-to-csr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toMandateId: mandate.id,
        toUserId: mandate.userId,
        message,
        proposedBudget: budget ? Number(budget) : null,
      }),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    setSentIds((prev) => [...prev, mandate.id]);
    setActiveId(null);
  }

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />
      <div className="px-8 lg:px-24 py-6 flex-1">
        <h1 className="font-sans font-extrabold text-3xl mb-2">Browse CSR Mandates</h1>
        <p className="text-muted mb-8">
          Companies looking to fund work like yours. Send a targeted EOI instead of cold-mailing dozens of contacts.
        </p>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : mandates.length === 0 ? (
          <p className="text-muted">No open mandates right now — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mandates.map((m) => (
              <div key={m.id} className="rounded-2xl bg-white p-6 flex flex-col">
                <p className="font-bold text-lg mb-0.5">{m.companyName}</p>
                <p className="text-sm text-muted mb-3">{m.domains} · {m.city}, {m.state}</p>

                {m.objective && <p className="text-sm mb-3 flex-1">{m.objective}</p>}

                <p className="text-sm mb-2">
                  <span className="font-semibold">Budget:</span> ₹{(m.budgetMin / 100000).toFixed(1)}L - ₹{(m.budgetMax / 100000).toFixed(1)}L
                </p>
                {m.projectTimeline && (
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Timeline:</span> {m.projectTimeline}
                  </p>
                )}
                {m.verificationRequired && (
                  <p className="text-sm text-muted mb-3">
                    <span className="font-semibold">Verification needed:</span> {m.verificationRequired}
                  </p>
                )}

                {sentIds.includes(m.id) ? (
                  <span className="rounded-full bg-lime text-navy text-xs font-bold px-4 py-2 text-center mt-auto">
                    EOI sent ✓
                  </span>
                ) : activeId !== m.id ? (
                  <button
                    onClick={() => openForm(m.id)}
                    className="rounded-full bg-lavender px-4 py-2 text-sm font-bold mt-auto"
                  >
                    Send EOI
                  </button>
                ) : (
                  <div className="mt-2 border-t border-gray-200 pt-4 flex flex-col gap-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Introduce your NGO and why this mandate is a fit..."
                      className="rounded-2xl bg-field-grey px-4 py-3 text-sm outline-none resize-none h-20"
                    />
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Proposed budget (optional)"
                      className="rounded-full bg-field-grey px-4 py-2.5 text-sm outline-none"
                    />
                    {error && <p className="text-danger text-xs">{error}</p>}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveId(null)}
                        className="rounded-full bg-white border border-gray-300 px-4 py-2 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSend(m)}
                        disabled={sending}
                        className="rounded-full bg-lavender px-4 py-2 text-xs font-bold disabled:opacity-50"
                      >
                        {sending ? "Sending..." : "Submit"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}