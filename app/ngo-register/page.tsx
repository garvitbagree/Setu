"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const domainOptions = ["Education", "Environment", "Healthcare", "Livelihood", "Disaster Relief", "Women Empowerment", "Skill Development", "Sanitation"];

export default function NgoRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("Education");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [reg12A, setReg12A] = useState("");
  const [reg80G, setReg80G] = useState("");
  const [regFCRA, setRegFCRA] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!name || !state || !city) {
      setError("Organisation name, state, and city are required.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/ngo-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, domain, state, city, reg12A, reg80G, regFCRA }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    router.push("/ngo-status");
  }

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />
      <div className="px-8 lg:px-24 py-10 flex-1 w-full max-w-3xl mx-auto">
        <h1 className="font-sans font-extrabold text-4xl mb-2">
          Register your NGO
        </h1>
        <p className="text-muted mb-8">
          Tell CSR managers who you are — you'll build out your full profile after verification.
        </p>

        <div className="bg-white rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <label className="block font-semibold mb-2 text-sm">Organisation name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Asha Foundation"
              className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm">Primary domain</label>
            <div className="relative">
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
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
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="font-semibold text-sm mb-1">Registration numbers</p>
            <p className="text-xs text-muted mb-4">
              Provide any that apply — we'll check these against government records to verify your NGO.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                value={reg12A}
                onChange={(e) => setReg12A(e.target.value)}
                placeholder="12A number"
                className="rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
              <input
                type="text"
                value={reg80G}
                onChange={(e) => setReg80G(e.target.value)}
                placeholder="80G number"
                className="rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
              <input
                type="text"
                value={regFCRA}
                onChange={(e) => setRegFCRA(e.target.value)}
                placeholder="FCRA number"
                className="rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
            </div>
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="self-end rounded-full bg-lavender px-8 py-3 font-bold disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit for verification"}
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}