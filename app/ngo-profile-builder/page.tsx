"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type NGO = {
  id: number;
  name: string;
  verified: boolean;
  domain: string;
  city: string;
  state: string;
  description: string;
  impactMetric: string;
  yearsActive: number;
  budgetMin: number;
  budgetMax: number;
  pastCSRPartners: string | null;
};

export default function NgoProfileBuilderPage() {
  const router = useRouter();
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [description, setDescription] = useState("");
  const [impactMetric, setImpactMetric] = useState("");
  const [yearsActive, setYearsActive] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [pastCSRPartners, setPastCSRPartners] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/ngo-me");
      if (res.ok) {
        const data: NGO = await res.json();
        if (!data.verified) {
          router.push("/ngo-status");
          return;
        }
        setNgo(data);
        setDescription(data.description || "");
        setImpactMetric(data.impactMetric || "");
        setYearsActive(String(data.yearsActive || ""));
        setBudgetMin(String(data.budgetMin || ""));
        setBudgetMax(String(data.budgetMax || ""));
        setPastCSRPartners(data.pastCSRPartners || "");
      } else {
        router.push("/ngo-register");
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    setError("");
    const min = Number(budgetMin) || 0;
    const max = Number(budgetMax) || 0;
    if (min > max) {
      setError("Minimum budget can't be greater than maximum budget.");
      return;
    }

    setSaving(true);
    await fetch("/api/ngo-me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        impactMetric,
        yearsActive: Number(yearsActive) || 0,
        budgetMin: min,
        budgetMax: max,
        pastCSRPartners,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/ngo-status"), 1000);
  }

  if (loading || !ngo) {
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
      <div className="px-8 lg:px-24 py-10 flex-1 w-full max-w-3xl mx-auto">
        <h1 className="font-sans font-extrabold text-4xl mb-2">Build your profile</h1>
        <p className="text-muted mb-8">
          This is what CSR managers see when your NGO comes up in their search.
        </p>

        <div className="bg-white rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <label className="block font-semibold mb-2 text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does your organisation do? Who do you serve?"
              className="w-full rounded-2xl bg-field-grey px-5 py-3 text-sm outline-none resize-none h-28"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold mb-2 text-sm">Years active</label>
              <input
                type="number"
                value={yearsActive}
                onChange={(e) => setYearsActive(e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-sm">Impact metric</label>
              <input
                type="text"
                value={impactMetric}
                onChange={(e) => setImpactMetric(e.target.value)}
                placeholder="e.g. 1,200+ students reached"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm">Budget range you can absorb (₹)</label>
            <div className="grid grid-cols-2 gap-5">
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                placeholder="Minimum"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="Maximum"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm">Past CSR partners (comma-separated)</label>
            <input
              type="text"
              value={pastCSRPartners}
              onChange={(e) => setPastCSRPartners(e.target.value)}
              placeholder="e.g. TCS, Infosys, Wipro"
              className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}
          {saved && (
            <p className="text-sm font-semibold text-navy bg-lime inline-block px-4 py-2 rounded-full self-start">
              Profile saved ✓ redirecting...
            </p>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => router.push("/ngo-eoi-inbox")}
              className="text-sm font-semibold text-muted"
            >
              Skip to EOI inbox →
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-lavender px-8 py-3 font-bold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}