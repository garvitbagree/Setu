"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type NGO = {
  id: number;
  name: string;
  verified: boolean;
  domain: string;
  city: string;
  state: string;
  yearsActive: number;
  description: string;
  impactMetric: string;
  budgetMin: number;
  budgetMax: number;
  has12A: boolean;
  has80G: boolean;
  hasFCRA: boolean;
  pastCSRPartners: string | null;
};

export default function NgoProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [showEoiForm, setShowEoiForm] = useState(false);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/ngo/${params.id}`);
      const data = await res.json();
      setNgo(data);
    }
    load();
  }, [params.id]);

  async function handleSendEoi() {
    if (!ngo) return;
    await fetch("/api/eoi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toNgoId: ngo.id,
        message,
        proposedBudget: budget ? Number(budget) : null,
      }),
    });
    setSent(true);
  }

  if (!ngo) {
    return (
      <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
        <Navbar />
        <p className="p-10 text-muted">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />
      <div className="px-8 lg:px-24 py-6 flex-1">
        <button
          onClick={() => router.push(`/matching?${searchParams.toString()}`)}
          className="text-sm font-semibold text-muted mb-4"
        >
          ← Back to results
        </button>

        <h1 className="font-sans font-extrabold text-4xl mb-8">{ngo.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-muted mb-1">Domain</p>
              <p className="font-semibold">{ngo.domain}</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-muted mb-1">Verification status</p>
              <p className="font-semibold">
                {ngo.verified ? "✔ Verified" : "Pending"}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-muted mb-1">Years active</p>
              <p className="font-semibold">{ngo.yearsActive} years</p>
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl bg-white p-6">
            <p className="mb-4">{ngo.description}</p>
            <p className="text-sm mb-2">
              <span className="font-semibold">Geography:</span> {ngo.city}, {ngo.state}
            </p>
            <p className="text-sm mb-2">
              <span className="font-semibold">Impact:</span> {ngo.impactMetric}
            </p>
            <p className="text-sm mb-2">
              <span className="font-semibold">Budget range:</span> ₹
              {(ngo.budgetMin / 100000).toFixed(1)}L - ₹{(ngo.budgetMax / 100000).toFixed(1)}L
            </p>
            <p className="text-sm mb-2">
              <span className="font-semibold">Past CSR partners:</span>{" "}
              {ngo.pastCSRPartners || "—"}
            </p>
            <p className="text-sm mb-6">
              <span className="font-semibold">Registrations:</span>{" "}
              {[ngo.has12A && "12A", ngo.has80G && "80G", ngo.hasFCRA && "FCRA"]
                .filter(Boolean)
                .join(", ") || "None on file"}
            </p>

            {sent ? (
              <p className="text-lime font-bold bg-navy inline-block px-4 py-2 rounded-full">
                EOI sent — the NGO has been notified
              </p>
            ) : showEoiForm ? (
              <div className="flex flex-col gap-3">
                <textarea
                  placeholder="Short message to the NGO..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-2xl bg-field-grey px-5 py-3 text-sm outline-none resize-none h-24"
                />
                <input
                  type="number"
                  placeholder="Proposed budget (optional)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="rounded-full bg-field-grey px-5 py-3 text-sm outline-none w-60"
                />
                <button
                  onClick={handleSendEoi}
                  disabled={!message}
                  className="self-end rounded-full bg-lime px-8 py-3 font-bold disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEoiForm(true)}
                className="rounded-full bg-lime px-8 py-3 font-bold float-right"
              >
                Send EOI
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}