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

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Brand panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gray-950 p-10 xl:p-12 text-white">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg">&lt;/&gt;</span>
            </div>

            <div className="flex flex-col leading-none">
              <span className="font-black text-2xl tracking-tight text-white">
                wiki<span className="text-indigo-400">dev</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                Developer Wiki
              </span>
            </div>
          </Link>

          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-4xl xl:text-5xl leading-tight">
                Start building your developer knowledge base.
              </h2>
            </div>

            <p className="text-gray-400 text-base leading-relaxed max-w-md">
              Save useful articles, share what you learn, and grow with a practical developer community.
            </p>

            <div className="space-y-3 pt-2">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 flex items-center justify-center text-xs shrink-0">
                    ✓
                  </span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Join WikiDev and document your learning journey.
          </p>
        </div>

        {/* Form panel */}
        <div className="w-full px-5 py-8 sm:px-8 sm:py-10 lg:p-12">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg">&lt;/&gt;</span>
              </div>

              <div className="flex flex-col leading-none">
                <span className="font-black text-2xl tracking-tight text-gray-900">
                  wiki<span className="text-indigo-600">dev</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                  Developer Wiki
                </span>
              </div>
            </Link>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950 mb-2">
                Create account
              </h1>
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={update("firstName")}
                    placeholder="John"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={update("lastName")}
                    placeholder="Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={update("password")}
                    placeholder="Min. 8 characters"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all pr-16"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors text-xs font-semibold"
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
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : "bg-gray-200"
                            }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-gray-500">
                      Strength:{" "}
                      <span className="font-semibold text-gray-700">
                        {strengthLabel[strength]}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Confirm password
                </label>

                <input
                  type="password"
                  value={form.confirm}
                  onChange={update("confirm")}
                  placeholder="••••••••"
                  className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 transition-all ${form.confirm && form.confirm !== form.password
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                    }`}
                />

                {form.confirm && form.confirm !== form.password && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all mt-2 disabled:opacity-70 bg-gray-950 hover:bg-indigo-700"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-gray-400">
              By creating an account, you can bookmark, write, and manage articles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}