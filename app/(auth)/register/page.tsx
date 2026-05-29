"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { CREATE_DEV } from "@/lib/graphql/mutations/dev.mutations";
import { GET_STATS } from "@/lib/graphql/queries/dev.queries";
import { StatsData } from "@/app/shared/type";

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

  const { data: statsData } = useQuery<StatsData>(GET_STATS, {
    fetchPolicy: "cache-and-network",
  });

  const articlesCount = statsData?.articlesCount ?? 0;

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

  const perks = [
    `Access ${articlesCount ? `${articlesCount}+` : "..."} curated dev articles`,
    "Bookmark and track your reading",
    "Contribute and share your knowledge",
    "Get notified on new articles in your stack",
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-indigo-900">
        <div className="relative z-10">
          <Link href="/">
            <span className="font-display font-extrabold text-2xl text-white">
              wiki<span className="text-indigo-300">dev</span>
              <span className="inline-block w-2 h-2 rounded-full bg-white ml-0.5 mb-1 align-middle" />
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="font-display font-extrabold text-4xl text-white leading-tight">
            Join the dev<br />knowledge base.
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Create your free account and start contributing to a growing library of developer knowledge.
          </p>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-indigo-200 text-sm">
                <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs flex-shrink-0">
                  &#10003;
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-indigo-300 text-xs">
          By joining, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link href="/">
              <span className="font-display font-extrabold text-2xl text-gray-900">
                wiki<span className="gradient-text">dev</span>
                <span className="logo-dot" />
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-extrabold text-3xl text-indigo-900 mb-2">Create account</h1>
            <p className="text-indigo-600 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-700 font-semibold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1.5">First name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={update("firstName")}
                  placeholder="John"
                  className="w-full border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-900 placeholder-indigo-400 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1.5">Last name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={update("lastName")}
                  placeholder="Doe"
                  className="w-full border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-900 placeholder-indigo-400 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
                className="w-full border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-900 placeholder-indigo-400 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Min. 8 characters"
                  className="w-full border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-900 placeholder-indigo-400 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all pr-16"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors text-xs font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : "bg-indigo-200"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-indigo-500">
                    Strength:{" "}
                    <span className="font-semibold text-indigo-700">{strengthLabel[strength]}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={update("confirm")}
                placeholder="••••••••"
                className={`w-full border rounded-lg px-4 py-3 text-sm text-indigo-900 placeholder-indigo-400 outline-none focus:ring-2 transition-all ${form.confirm && form.confirm !== form.password
                  ? "border-red-300 focus:ring-red-200"
                  : "border-indigo-200 focus:ring-indigo-200 focus:border-indigo-400"
                  }`}
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-white font-bold text-sm py-3.5 rounded-lg transition-all mt-2 disabled:opacity-70 bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}