"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type Project = {
  id: number;
  title: string;
  description: string;
  status: string;
  achievement: string | null;
};

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
  teamSize: number | null;
  boardMembers: string | null;
  websiteUrl: string | null;
  projects: Project[];
};

export default function NgoProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5FC]" />}>
      <NgoProfileContent />
    </Suspense>
  );
}

function NgoProfileContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [showEoiForm, setShowEoiForm] = useState(false);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

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
    setSending(true);
    await fetch("/api/eoi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toNgoId: ngo.id,
        message,
        proposedBudget: budget ? Number(budget) : null,
      }),
    });
    setSending(false);
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
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-muted mb-1">Team size</p>
              <p className="font-semibold">{ngo.teamSize ? `${ngo.teamSize} people` : "—"}</p>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="rounded-2xl bg-white p-6">
              <p className="mb-4">{ngo.description}</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <p>
                  <span className="font-semibold block text-muted text-xs mb-0.5">Geography</span>
                  {ngo.city}, {ngo.state}
                </p>
                <p>
                  <span className="font-semibold block text-muted text-xs mb-0.5">Impact</span>
                  {ngo.impactMetric}
                </p>
                <p>
                  <span className="font-semibold block text-muted text-xs mb-0.5">Budget range</span>
                  ₹{(ngo.budgetMin / 100000).toFixed(1)}L - ₹{(ngo.budgetMax / 100000).toFixed(1)}L
                </p>
                <p>
                  <span className="font-semibold block text-muted text-xs mb-0.5">Registrations</span>
                  {[ngo.has12A && "12A", ngo.has80G && "80G", ngo.hasFCRA && "FCRA"]
                    .filter(Boolean)
                    .join(", ") || "None on file"}
                </p>
                <p>
                  <span className="font-semibold block text-muted text-xs mb-0.5">Website</span>
                  {ngo.websiteUrl || "—"}
                </p>
                <p>
                  <span className="font-semibold block text-muted text-xs mb-0.5">Board members</span>
                  {ngo.boardMembers || "—"}
                </p>
                <p className="col-span-2">
                  <span className="font-semibold block text-muted text-xs mb-0.5">Past CSR partners</span>
                  {ngo.pastCSRPartners || "—"}
                </p>
              </div>
            </div>

            {/* Projects card */}
            {ngo.projects && ngo.projects.length > 0 && (
              <div className="rounded-2xl bg-white p-6">
                <h3 className="font-bold text-lg mb-4">Projects</h3>
                <div className="flex flex-col gap-3">
                  {ngo.projects.map((p) => (
                    <div key={p.id} className="bg-field-grey rounded-xl p-4">
                      <p className="font-semibold flex items-center gap-2">
                        {p.title}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-lime text-navy" : "bg-lavender text-white"}`}>
                          {p.status}
                        </span>
                      </p>
                      {p.description && <p className="text-sm text-muted mt-1">{p.description}</p>}
                      {p.achievement && (
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Achievement:</span> {p.achievement}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EOI card */}
            <div className="rounded-2xl bg-white p-6">
              {sent ? (
                <div className="flex items-center gap-4 py-2">
                  <div className="w-12 h-12 rounded-full bg-lime flex items-center justify-center text-navy text-2xl font-bold shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-lg">EOI sent</p>
                    <p className="text-sm text-muted">
                      {ngo.name} has been notified and will respond soon.
                    </p>
                  </div>
                </div>
              ) : showEoiForm ? (
                <div>
                  <h3 className="font-bold text-lg mb-1">Send an Expression of Interest</h3>
                  <p className="text-sm text-muted mb-4">
                    Introduce your mandate and proposed budget — {ngo.name} will review and respond.
                  </p>
                  <div className="flex flex-col gap-3">
                    <textarea
                      placeholder="Short message to the NGO..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="rounded-2xl bg-field-grey px-5 py-3 text-sm outline-none resize-none h-28"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted">₹</span>
                      <input
                        type="number"
                        placeholder="Proposed budget (optional)"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="rounded-full bg-field-grey px-5 py-3 text-sm outline-none w-60"
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-1">
                      <button
                        onClick={() => setShowEoiForm(false)}
                        className="rounded-full bg-white border border-gray-300 px-6 py-3 font-semibold text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendEoi}
                        disabled={!message || sending}
                        className="rounded-full bg-lime px-8 py-3 font-bold text-sm disabled:opacity-50"
                      >
                        {sending ? "Sending..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">Interested in partnering?</p>
                    <p className="text-sm text-muted">
                      Send {ngo.name} an Expression of Interest to start the conversation.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEoiForm(true)}
                    className="rounded-full bg-lime px-8 py-3 font-bold shrink-0"
                  >
                    Send EOI
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}