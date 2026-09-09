"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function redirectForRole(role: string | null | undefined) {
    if (role === "ngo") {
      window.location.href = "/ngo-register";
    } else {
      // default to CSR flow, also covers first-time Google users with no role yet
      window.location.href = "/domains";
    }
  }

  async function handleCredentialsAuth(role: "csr" | "ngo") {
    setError("");

    if (mode === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      redirectForRole(role);
    }
  }

  return (
    <main className="relative min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://img.magnific.com/free-photo/high-angle-shot-wooden-bridge-sea-purple-colored-sky_181624-13179.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Bridge over water at dusk"
          fill
          className="object-cover brightness-75"
          priority
        />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/20 backdrop-blur-md">
        <span className="font-serif text-2xl tracking-widest text-white">
          SETU
        </span>
        <div className="flex items-center gap-8 text-white text-sm font-medium">
          <a href="#">Discover NGOs</a>
          <a href="#">Your Mandates</a>
          <a href="#">Shortlist</a>
          <a href="#">Login</a>
          <button className="rounded-full bg-navy text-white px-5 py-2 font-semibold">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero content */}
      <div className="flex items-center justify-between px-16 py-24 max-w-[1200px] mx-auto">
        {/* Left: headline */}
        <div className="max-w-xl">
          <p className="text-white tracking-widest text-sm mb-4">SETU</p>
          <h1 className="text-white font-bold text-5xl leading-tight">
            Your friendly neighbourhood
            <br />
            <span className="text-lavender-light">CSR-NGO</span>
            <br />
            matching platform
          </h1>
          <div className="w-40 border-t border-white mt-6" />
        </div>

        {/* Right: login card */}
        <div className="bg-white rounded-2xl p-8 w-96 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-3xl font-bold text-deep-purple">
              {mode === "login" ? "Holaaaa!" : "Join Setu"}
            </h2>
            <button
              className="text-xs text-lavender font-semibold"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "New here? Register" : "Have an account? Login"}
            </button>
          </div>

          {/* Google login — separate, clearly optional path */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/domains" })}
            className="w-full rounded-full bg-field-grey px-5 py-3 mb-5 text-sm font-medium flex items-center justify-center gap-2"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 border-t border-gray-300" />
            <span className="text-gray-400 text-sm">or use email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {mode === "register" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-full bg-field-grey px-5 py-3 mb-3 text-sm outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full bg-field-grey px-5 py-3 mb-3 text-sm outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full bg-field-grey px-5 py-3 mb-2 text-sm outline-none"
          />

          {mode === "login" && (
            <div className="text-right mb-4">
              <a href="#" className="text-danger text-xs">
                Forgot password?
              </a>
            </div>
          )}
          {mode === "register" && <div className="mb-4" />}

          {error && <p className="text-danger text-xs mb-3">{error}</p>}

          <button
            onClick={() => handleCredentialsAuth("csr")}
            className="w-full rounded-full bg-lavender px-5 py-3 mb-3 font-bold"
          >
            {mode === "login" ? "Login" : "Register"} as CSR Manager
          </button>
          <button
            onClick={() => handleCredentialsAuth("ngo")}
            className="w-full rounded-full bg-white border-2 border-navy px-5 py-3 font-bold"
          >
            {mode === "login" ? "Login" : "Register"} as NGO representative
          </button>
        </div>
      </div>

      {/* Footer gradient band */}
      <div className="h-32 bg-gradient-to-br from-[#6B4FA0] to-navy flex items-center justify-center gap-10 text-white/80 text-sm font-medium">
        <a href="#">Company</a>
        <a href="#">FAQs</a>
        <a href="#">Financial Report</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Contact Us</a>
      </div>
    </main>
  );
}