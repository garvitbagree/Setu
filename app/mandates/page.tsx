"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Mandate = {
  id: number;
  companyName: string;
  objective: string;
  domains: string;
  state: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  yearsActiveMin: number | null;
  projectTimeline: string | null;
  verificationRequired: string | null;
};

const domainOptions = ["Education", "Environment", "Healthcare", "Livelihood", "Disaster Relief", "Women Empowerment", "Skill Development", "Sanitation"];

const emptyForm = {
  companyName: "",
  objective: "",
  domains: "Education",
  state: "",
  city: "",
  budgetMin: "",
  budgetMax: "",
  yearsActiveMin: "",
  projectTimeline: "",
  verificationRequired: "",
};

export default function MandatesPage() {
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/mandates");
    if (res.ok) setMandates(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAdd() {
    setError("");
    if (!form.companyName || !form.state || !form.city) {
      setError("Company name, state, and city are required.");
      return;
    }
    const min = Number(form.budgetMin) || 0;
    const max = Number(form.budgetMax) || 0;
    if (min > max) {
      setError("Minimum budget can't be greater than maximum budget.");
      return;
    }

    setSaving(true);
    await fetch("/api/mandates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        budgetMin: min,
        budgetMax: max,
        yearsActiveMin: form.yearsActiveMin || null,
      }),
    });
    setSaving(false);
    setForm(emptyForm);
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    await fetch("/api/mandates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMandates((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />
      <div className="px-8 lg:px-24 py-6 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-sans font-extrabold text-3xl">Your Mandates</h1>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-full bg-lavender px-6 py-3 font-bold"
          >
            {showForm ? "Cancel" : "+ Add new mandate"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-8 mb-8 flex flex-col gap-5 max-w-2xl">
            <div>
              <label className="block font-semibold mb-2 text-sm">Company name</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Objective</label>
              <textarea
                value={form.objective}
                onChange={(e) => updateField("objective", e.target.value)}
                placeholder="What does this mandate aim to fund?"
                className="w-full rounded-2xl bg-field-grey px-5 py-3 text-sm outline-none resize-none h-24"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Domain</label>
              <div className="relative">
                <select
                  value={form.domains}
                  onChange={(e) => updateField("domains", e.target.value)}
                  className="w-full rounded-full bg-field-grey pl-5 pr-10 py-3 text-sm outline-none appearance-none"
                >
                  {domainOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted text-xs">▼</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Geography</label>
              <div className="grid grid-cols-2 gap-5">
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="State"
                  className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
                />
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="City"
                  className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Budget range (₹)</label>
              <div className="grid grid-cols-2 gap-5">
                <input
                  type="number"
                  value={form.budgetMin}
                  onChange={(e) => updateField("budgetMin", e.target.value)}
                  placeholder="Minimum"
                  className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
                />
                <input
                  type="number"
                  value={form.budgetMax}
                  onChange={(e) => updateField("budgetMax", e.target.value)}
                  placeholder="Maximum"
                  className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold mb-2 text-sm">Min. years NGO must be active</label>
                <input
                  type="number"
                  value={form.yearsActiveMin}
                  onChange={(e) => updateField("yearsActiveMin", e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">Project timeline</label>
                <input
                  type="text"
                  value={form.projectTimeline}
                  onChange={(e) => updateField("projectTimeline", e.target.value)}
                  placeholder="e.g. 6 months - 1 year"
                  className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Verification required</label>
              <input
                type="text"
                value={form.verificationRequired}
                onChange={(e) => updateField("verificationRequired", e.target.value)}
                placeholder="e.g. 12A, 80G"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            <button
              onClick={handleAdd}
              disabled={saving}
              className="self-end rounded-full bg-navy text-white px-8 py-3 font-bold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save mandate"}
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : mandates.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center max-w-2xl">
            <p className="font-semibold text-lg mb-1">No mandates yet</p>
            <p className="text-sm text-muted">
              Add a mandate so NGOs browsing Setu can find and reach out to you directly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mandates.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl p-6 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-lg">{m.companyName}</p>
                    <p className="text-sm text-muted">{m.domains} · {m.city}, {m.state}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="rounded-full bg-danger text-white w-8 h-8 flex items-center justify-center text-xs font-bold shrink-0"
                  >
                    ✕
                  </button>
                </div>
                {m.objective && <p className="text-sm mb-3 flex-1">{m.objective}</p>}
                <p className="text-sm">
                  <span className="font-semibold">Budget:</span> ₹{m.budgetMin.toLocaleString("en-IN")} - ₹{m.budgetMax.toLocaleString("en-IN")}
                  {m.projectTimeline && <> · <span className="font-semibold">Timeline:</span> {m.projectTimeline}</>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}