"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type EOI = {
  id: number;
  message: string;
  proposedBudget: number | null;
  status: string;
  createdAt: string;
  fromNgo: { name: string; domain: string; city: string; verified: boolean } | null;
  mandate: { companyName: string } | null;
  ngoContactName?: string | null;
  ngoContactEmail?: string | null;
};

export default function CsrEoiInboxPage() {
  const router = useRouter();
  const [eois, setEois] = useState<EOI[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/csr-eois");
    if (res.ok) {
      setEois(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(id: number, action: "accepted" | "declined") {
    setActingOn(id);
    await fetch("/api/csr-eois", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: action }),
    });
    setActingOn(null);
    load();
  }

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />
      <div className="px-8 lg:px-24 py-10 flex-1 w-full max-w-3xl mx-auto">
        <h1 className="font-sans font-extrabold text-4xl mb-8">
          EOIs from NGOs
        </h1>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : eois.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <p className="font-semibold text-lg mb-1">No EOIs yet</p>
            <p className="text-sm text-muted">
              When an NGO sends an Expression of Interest against one of your mandates, it'll show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {eois.map((eoi) => (
              <div key={eoi.id} className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg flex items-center gap-2">
                      {eoi.fromNgo?.name || "Unknown NGO"}
                      {eoi.fromNgo?.verified && (
                        <span className="bg-lavender text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">✔</span>
                      )}
                    </p>
                    <p className="text-xs text-muted">
                      {eoi.fromNgo?.domain} · {eoi.fromNgo?.city}
                      {eoi.mandate && <> · re: {eoi.mandate.companyName}</>}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                      eoi.status === "accepted"
                        ? "bg-lime text-navy"
                        : eoi.status === "declined"
                        ? "bg-danger text-white"
                        : "bg-field-grey text-muted"
                    }`}
                  >
                    {eoi.status === "pending" ? "Pending" : eoi.status === "accepted" ? "Accepted" : "Declined"}
                  </span>
                </div>

                <p className="text-sm mb-2">{eoi.message}</p>

                {eoi.proposedBudget && (
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Proposed budget:</span> ₹{eoi.proposedBudget.toLocaleString("en-IN")}
                  </p>
                )}

                {eoi.status === "accepted" && (
                  <div className="mt-3 bg-field-grey rounded-xl p-4">
                    <p className="text-xs text-muted mb-1">Contact details</p>
                    <p className="text-sm font-semibold">{eoi.ngoContactName || "—"}</p>
                    <p className="text-sm">{eoi.ngoContactEmail || "—"}</p>
                  </div>
                )}

                {eoi.status === "pending" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAction(eoi.id, "declined")}
                      disabled={actingOn === eoi.id}
                      className="rounded-full bg-white border border-danger text-danger px-6 py-2 text-sm font-bold disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAction(eoi.id, "accepted")}
                      disabled={actingOn === eoi.id}
                      className="rounded-full bg-lime px-6 py-2 text-sm font-bold disabled:opacity-50"
                    >
                      Accept
                    </button>
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