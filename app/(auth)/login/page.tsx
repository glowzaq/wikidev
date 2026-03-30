"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: connect to your auth logic
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #0891b2 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white opacity-5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white opacity-5 translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-cyan-400 opacity-10 -translate-x-1/2 -translate-y-1/2 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-display font-extrabold text-2xl text-white">
              wiki<span className="text-cyan-300">dev</span>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-300 ml-0.5 mb-1 align-middle" />
            </span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-display font-extrabold text-4xl text-white leading-tight mb-4">
              Welcome back,<br />developer.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Pick up right where you left off. Your articles, bookmarks, and contributions are waiting.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "400+", label: "Articles" },
              { value: "6", label: "Categories" },
              { value: "1k+", label: "Devs" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 border-l-2 border-cyan-300/50 pl-4">
          <p className="text-white/70 text-sm italic">
            "WikiDev has become my first stop whenever I'm learning something new."
          </p>
          <p className="text-cyan-300 text-xs font-semibold mt-2">— A happy contributor</p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link href="/">
              <span className="font-display font-extrabold text-2xl text-gray-900">
                wiki
                <span
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  dev
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-violet-500 ml-0.5 mb-1 align-middle" />
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          {/* OAuth */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all pr-11"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all mt-2 disabled:opacity-70"
              style={{
                background: loading
                  ? "#a78bfa"
                  : "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}