"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type NGO = {
  id: number;
  name: string;
  verified: boolean;
  verificationNote: string | null;
  domain: string;
  city: string;
  state: string;
};

export default function NgoStatusPage() {
  const router = useRouter();
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/ngo-me");
      if (res.ok) {
        const data = await res.json();
        setNgo(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
        <Navbar />
        <p className="p-10 text-muted">Loading...</p>
      </main>
    );
  }

  if (!ngo) {
    return (
      <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-xl font-semibold">No NGO registration found</p>
          <button
            onClick={() => router.push("/ngo-register")}
            className="rounded-full bg-lavender px-8 py-3 font-bold"
          >
            Register your NGO
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5FC] w-full flex flex-col">
      <Navbar />
      <div className="px-8 lg:px-24 py-10 flex-1 w-full max-w-2xl mx-auto">
        <h1 className="font-sans font-extrabold text-4xl mb-8">{ngo.name}</h1>

        <div className="bg-white rounded-2xl p-8">
          {ngo.verified ? (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-lime flex items-center justify-center text-navy text-2xl font-bold shrink-0">
                ✓
              </div>
              <div>
                <p className="font-bold text-lg">Verified</p>
                <p className="text-sm text-muted mb-4">{ngo.verificationNote}</p>
                <p className="text-sm mb-4">
                  Your organisation is now discoverable by CSR managers. Keep your profile current so they see your full story, impact, and budget fit.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push("/ngo-profile-builder")}
                    className="rounded-full bg-lavender px-8 py-3 font-bold"
                  >
                    Update your profile
                  </button>
                  <button
                    onClick={() => router.push("/browse-mandates")}
                    className="rounded-full bg-white border border-gray-300 px-8 py-3 font-bold"
                  >
                    Browse CSR mandates
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-field-grey flex items-center justify-center text-muted text-2xl font-bold shrink-0">
                ⏳
              </div>
              <div>
                <p className="font-bold text-lg">Pending manual review</p>
                <p className="text-sm text-muted mb-4">{ngo.verificationNote}</p>
                <p className="text-sm">
                  We'll notify you once a reviewer confirms your registration. This usually takes 2-3 business days.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-2xl p-6 flex gap-8 text-sm">
          <p><span className="font-semibold text-muted block text-xs mb-0.5">Domain</span>{ngo.domain}</p>
          <p><span className="font-semibold text-muted block text-xs mb-0.5">Location</span>{ngo.city}, {ngo.state}</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}