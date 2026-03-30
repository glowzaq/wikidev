"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import { CREATE_DEV } from "@/lib/graphql/mutations/dev.mutations";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [createDev, { loading }] = useMutation(CREATE_DEV, {
    onCompleted: () => {
      router.push("/login");
    },
    onError: (error: any) => {
      setErrorMsg(error.message);
    },
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"];
  const strength = passwordStrength();

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic client-side validation
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    createDev({
      variables: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #0891b2 0%, #7c3aed 60%, #6d28d9 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white opacity-5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white opacity-5 translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-violet-400 opacity-10 blur-3xl" />

        <div className="relative z-10">
          <Link href="/">
            <span className="font-display font-extrabold text-2xl text-white">
              wiki<span className="text-cyan-300">dev</span>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-300 ml-0.5 mb-1 align-middle" />
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="font-display font-extrabold text-4xl text-white leading-tight">
            Join the dev<br />knowledge base.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Create your free account and start contributing to a growing library of developer knowledge.
          </p>
          <ul className="space-y-3">
            {[
              "Access 400+ curated dev articles",
              "Bookmark and track your reading",
              "Contribute and share your knowledge",
              "Get notified on new articles in your stack",
            ].map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-white/80 text-sm">
                <span className="w-5 h-5 rounded-full bg-cyan-400/30 border border-cyan-300/40 flex items-center justify-center text-cyan-300 text-xs flex-shrink-0">
                  ✓
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-white/50 text-xs">
          By joining, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link href="/">
              <span className="font-display font-extrabold text-2xl text-gray-900">
                wiki
                <span style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  dev
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-violet-500 ml-0.5 mb-1 align-middle" />
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or register with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">First name</label>
                <input type="text" value={form.firstName} onChange={update("firstName")} placeholder="John"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last name</label>
                <input type="text" value={form.lastName} onChange={update("lastName")} placeholder="Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="Min. 8 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all pr-11" />
                <button onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Strength: <span className="font-semibold text-gray-600">{strengthLabel[strength]}</span></p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm password</label>
              <input type="password" value={form.confirm} onChange={update("confirm")} placeholder="••••••••"
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 transition-all ${form.confirm && form.confirm !== form.password ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-violet-300 focus:border-violet-400"}`} />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all mt-2 disabled:opacity-70"
              style={{ background: loading ? "#a78bfa" : "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}