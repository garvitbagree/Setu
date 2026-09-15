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
  teamSize: number | null;
  boardMembers: string | null;
  websiteUrl: string | null;
};

type Project = {
  id: number;
  title: string;
  description: string;
  status: string;
  achievement: string | null;
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
  const [teamSize, setTeamSize] = useState("");
  const [boardMembers, setBoardMembers] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("ongoing");
  const [newAchievement, setNewAchievement] = useState("");
  const [addingProject, setAddingProject] = useState(false);

  async function loadProjects(ngoId: number) {
    const res = await fetch(`/api/ngo-projects?ngoId=${ngoId}`);
    if (res.ok) setProjects(await res.json());
  }

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
        setTeamSize(String(data.teamSize || ""));
        setBoardMembers(data.boardMembers || "");
        setWebsiteUrl(data.websiteUrl || "");
        loadProjects(data.id);
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
        teamSize: teamSize ? Number(teamSize) : null,
        boardMembers,
        websiteUrl,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/browse-mandates"), 1000);
  }

  async function handleAddProject() {
    if (!newTitle || !ngo) return;
    setAddingProject(true);
    await fetch("/api/ngo-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDescription, status: newStatus, achievement: newAchievement }),
    });
    setAddingProject(false);
    setNewTitle("");
    setNewDescription("");
    setNewAchievement("");
    setNewStatus("ongoing");
    loadProjects(ngo.id);
  }

  async function handleDeleteProject(id: number) {
    await fetch("/api/ngo-projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProjects((prev) => prev.filter((p) => p.id !== id));
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

        <div className="bg-white rounded-2xl p-8 flex flex-col gap-5 mb-6">
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

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold mb-2 text-sm">Team size</label>
              <input
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g. 25"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-sm">Website</label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="e.g. www.yourngo.org"
                className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm">Board members (comma-separated)</label>
            <input
              type="text"
              value={boardMembers}
              onChange={(e) => setBoardMembers(e.target.value)}
              placeholder="e.g. Priya Sharma (Chair), Raj Mehta (Treasurer)"
              className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
            />
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

        {/* Projects section */}
        <div className="bg-white rounded-2xl p-8">
          <h2 className="font-bold text-xl mb-4">Projects</h2>

          {projects.length > 0 && (
            <div className="flex flex-col gap-3 mb-6">
              {projects.map((p) => (
                <div key={p.id} className="bg-field-grey rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        {p.title}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-lime text-navy" : "bg-lavender text-white"}`}>
                          {p.status}
                        </span>
                      </p>
                      {p.description && <p className="text-sm text-muted mt-1">{p.description}</p>}
                      {p.achievement && <p className="text-sm mt-1"><span className="font-semibold">Achievement:</span> {p.achievement}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="rounded-full bg-danger text-white w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-5 flex flex-col gap-3">
            <p className="font-semibold text-sm">Add a project</p>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Project title"
              className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What is this project about?"
              className="w-full rounded-2xl bg-field-grey px-5 py-3 text-sm outline-none resize-none h-20"
            />
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              placeholder="Key achievement (optional)"
              className="w-full rounded-full bg-field-grey px-5 py-3 text-sm outline-none"
            />
            <div className="flex items-center gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="rounded-full bg-field-grey px-5 py-2.5 text-sm outline-none"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={handleAddProject}
                disabled={!newTitle || addingProject}
                className="rounded-full bg-navy text-white px-6 py-2.5 text-sm font-bold disabled:opacity-50"
              >
                {addingProject ? "Adding..." : "Add project"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}