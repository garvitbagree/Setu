"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";

const yearsOptions = ["Any", "1+ years", "3+ years", "5+ years", "10+ years"];
const timelineOptions = ["Any", "Under 3 months", "3-6 months", "6 months - 1 year", "1+ years"];
const verificationOptions = ["Any", "12A", "80G", "FCRA", "12A + 80G", "All (12A, 80G, FCRA)"];
const impactOptions = ["Any", "100+", "500+", "1,000+", "5,000+", "10,000+"];

export default function AdditionalFeaturesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [yearsActive, setYearsActive] = useState("Any");
  const [timeline, setTimeline] = useState("Any");
  const [verification, setVerification] = useState("Any");
  const [impact, setImpact] = useState("Any");
  const [minBudget, setMinBudget] = useState(50000);
  const [maxBudget, setMaxBudget] = useState(200000);

  const BUDGET_FLOOR = 0;
  const BUDGET_CEIL = 500000;

  function handleMinChange(value: number) {
    setMinBudget(Math.min(value, maxBudget - 10000));
  }

  function handleMaxChange(value: number) {
    setMaxBudget(Math.max(value, minBudget + 10000));
  }

  function handleProceed() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("yearsActive", yearsActive);
    params.set("timeline", timeline);
    params.set("verification", verification);
    params.set("impact", impact);
    params.set("budgetMin", String(minBudget));
    params.set("budgetMax", String(maxBudget));
    router.push(`/matching?${params.toString()}`);
  }

  return (
    <main className="h-screen bg-[#F7F5FC] w-full flex flex-col overflow-hidden">
      <Navbar />

      <div className="px-8 lg:px-24 py-4 flex-1 flex flex-col min-h-0">
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-white border border-lavender overflow-hidden mb-2 mt-4">
          <div className="h-full bg-lavender w-full" />
        </div>
        <p className="text-right text-sm text-muted mb-4">2/2</p>

        <h1 className="font-sans font-extrabold text-3xl mb-1">
          A few more details
        </h1>
        <p className="text-base text-muted mb-6">
          All optional — refine your matches or skip straight to results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 max-w-4xl">
          {/* Years active */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Years active in this cause</label>
            <div className="relative">
              <select
                value={yearsActive}
                onChange={(e) => setYearsActive(e.target.value)}
                className="w-full rounded-full bg-white border border-gray-200 pl-5 pr-10 py-2.5 text-sm outline-none appearance-none"
              >
                {yearsOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted text-xs">▼</span>
            </div>
          </div>

          {/* Impact */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Impact (beneficiaries reached)</label>
            <div className="relative">
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="w-full rounded-full bg-white border border-gray-200 pl-5 pr-10 py-2.5 text-sm outline-none appearance-none"
              >
                {impactOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted text-xs">▼</span>
            </div>
          </div>

          {/* Project timeline */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Project timeline</label>
            <div className="relative">
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full rounded-full bg-white border border-gray-200 pl-5 pr-10 py-2.5 text-sm outline-none appearance-none"
              >
                {timelineOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted text-xs">▼</span>
            </div>
          </div>

          {/* Verification needed */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Verification needed</label>
            <div className="relative">
              <select
                value={verification}
                onChange={(e) => setVerification(e.target.value)}
                className="w-full rounded-full bg-white border border-gray-200 pl-5 pr-10 py-2.5 text-sm outline-none appearance-none"
              >
                {verificationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted text-xs">▼</span>
            </div>
          </div>
        </div>

        {/* Budget range slider */}
        <div className="max-w-4xl mt-6">
          <label className="block font-semibold mb-3 text-sm">Available CSR budget</label>
          <div className="flex gap-4 mb-4">
            <input
              type="number"
              value={minBudget}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="rounded-full bg-white border border-gray-200 px-5 py-2.5 text-sm outline-none w-44"
            />
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="rounded-full bg-white border border-gray-200 px-5 py-2.5 text-sm outline-none w-44"
            />
          </div>

          <div className="relative h-2 bg-gray-200 rounded-full mb-3 max-w-md">
            <div
              className="absolute h-2 bg-lavender rounded-full"
              style={{
                left: `${(minBudget / BUDGET_CEIL) * 100}%`,
                right: `${100 - (maxBudget / BUDGET_CEIL) * 100}%`,
              }}
            />
            <input
              type="range"
              min={BUDGET_FLOOR}
              max={BUDGET_CEIL}
              step={5000}
              value={minBudget}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lavender [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow"
            />
            <input
              type="range"
              min={BUDGET_FLOOR}
              max={BUDGET_CEIL}
              step={5000}
              value={maxBudget}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lavender [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow"
            />
          </div>

          <div className="flex justify-between text-sm text-muted max-w-md">
            <span>₹{minBudget.toLocaleString("en-IN")}</span>
            <span>₹{maxBudget.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-auto pt-6 pb-6 max-w-4xl">
          <button
            onClick={() => router.push("/domains")}
            className="rounded-full bg-white border border-gray-300 px-8 py-3 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className="rounded-full bg-navy text-white px-8 py-3 font-bold"
          >
            Proceed to matched NGOs
          </button>
        </div>
      </div>
    </main>
  );
}