"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

const domainImages: Record<string, string> = {
  Education: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ24rFdwBst_qbltc-AhGcLbiBOy7zxWx5XoB2JHnxuL7WuWCawDv98c9A&s=10",
  Environment: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNezmyavgTDYryay4C3bsEmDNeM56FQbPn1YfZSjBWYhAi1EOd7BaJvRs&s=10",
  Healthcare: "https://as1.ftcdn.net/jpg/11/65/39/20/220_F_1165392074_hI37vcKPJYVFcT5eetDHM4OgWUJvEEjB.jpg",
  Livelihood: "https://static.vecteezy.com/system/resources/previews/080/395/995/non_2x/indian-farmer-crouches-to-harvest-crops-by-hand-using-a-sickle-emphasizing-traditional-farming-practices-vector.jpg",
};

const initialDomains = ["Education", "Environment", "Healthcare", "Livelihood"];
const moreDomains = ["Disaster Relief", "Women Empowerment", "Skill Development", "Sanitation"];

const stateCityMap: Record<string, string[]> = {
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Delhi": ["New Delhi"],
  "Karnataka": ["Bengaluru", "Mysuru"],
  "West Bengal": ["Kolkata", "Howrah"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Telangana": ["Hyderabad"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur"],
};

export default function DomainsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const [selected, setSelected] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [stateFocused, setStateFocused] = useState(false);
  const [cityFocused, setCityFocused] = useState(false);

  const stateOptions = useMemo(
    () => Object.keys(stateCityMap).filter((s) => s.toLowerCase().includes(state.toLowerCase())),
    [state]
  );
  const cityOptions = useMemo(
    () => (stateCityMap[state] || []).filter((c) => c.toLowerCase().includes(city.toLowerCase())),
    [state, city]
  );

  function toggleDomain(domain: string) {
    setSelected((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  }

  function handleNext() {
    const params = new URLSearchParams({
      domains: selected.join(","),
      state,
      city,
    });
    router.push(`/additional-features?${params.toString()}`);
  }

  const allDomains = showMore ? [...initialDomains, ...moreDomains] : initialDomains;

  return (
    <main className="min-h-screen bg-[#F7F5FC] px-8 lg:px-24 py-16 w-full flex flex-col justify-between">
      <Navbar />
      <div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-white border border-lavender overflow-hidden mb-2 mt-10">
          <div className="h-full bg-lavender w-1/2" />
        </div>
        <p className="text-right text-sm text-muted mb-10">1/2</p>

        <h1 className="font-sans font-extrabold text-5xl mb-3">
          Hola <span className="text-deep-purple">{firstName}.</span>
        </h1>
        <p className="text-xl mb-10">What NGO domains are you searching for?</p>

        <div className="flex gap-6 mb-6">
          {allDomains.map((domain) => (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
              className={`relative rounded-2xl overflow-hidden h-56 flex-1 bg-skeleton-grey text-left ${
                selected.includes(domain) ? "ring-4 ring-lavender" : ""
              }`}
              style={{
                backgroundImage: domainImages[domain] ? `url(${domainImages[domain]})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white font-semibold text-sm px-3 py-2 truncate">
                {domain}
              </span>
            </button>
          ))}
        </div>

        {!showMore && (
          <button
            onClick={() => setShowMore(true)}
            className="text-right block ml-auto font-semibold mb-12"
          >
            Load more...
          </button>
        )}

        <p className="text-xl font-semibold mb-4 mt-4">What geography are you looking for?</p>
        <div className="flex gap-4 mb-16 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity("");
              }}
              onFocus={() => setStateFocused(true)}
              onBlur={() => setTimeout(() => setStateFocused(false), 150)}
              className="rounded-full bg-field-grey px-5 py-3 text-sm outline-none w-60"
            />
            {stateFocused && state && stateOptions.length > 0 && (
              <div className="absolute top-full mt-1 w-60 bg-white rounded-xl shadow-lg z-10 overflow-hidden">
                {stateOptions.map((s) => (
                  <button
                    key={s}
                    className="block w-full text-left px-5 py-2 hover:bg-field-grey text-sm"
                    onMouseDown={() => setState(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setCityFocused(true)}
              onBlur={() => setTimeout(() => setCityFocused(false), 150)}
              disabled={!state}
              className="rounded-full bg-field-grey px-5 py-3 text-sm outline-none w-60 disabled:opacity-50"
            />
            {cityFocused && cityOptions.length > 0 && (
              <div className="absolute top-full mt-1 w-60 bg-white rounded-xl shadow-lg z-10 overflow-hidden">
                {cityOptions.map((c) => (
                  <button
                    key={c}
                    className="block w-full text-left px-5 py-2 hover:bg-field-grey text-sm"
                    onMouseDown={() => setCity(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pb-10">
        <a href="#" className="font-bold">
          Additional filters
        </a>
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          className="rounded-full bg-lavender px-8 py-3 font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  );
}