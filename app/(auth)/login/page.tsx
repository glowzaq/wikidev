"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { LOGIN_DEV } from "@/lib/graphql/mutations/dev.mutations";
import { GET_STATS } from "@/lib/graphql/queries/dev.queries";
import { GET_GOOGLE_AUTH_URL } from "@/lib/graphql/queries/auth.queries";
import { StatsData, LoginDevData, GoogleAuthUrlData } from "@/app/shared/type";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: statsData } = useQuery<StatsData>(GET_STATS, {
    fetchPolicy: "cache-and-network",
  });
  const { data: googleData } = useQuery<GoogleAuthUrlData>(GET_GOOGLE_AUTH_URL);

  const articlesCount = statsData?.articlesCount ?? 0;
  const devsCount = statsData?.devsCount ?? 0;

  const [loginDev, { loading }] = useMutation<LoginDevData>(LOGIN_DEV, {
    onCompleted: (data) => {
      document.cookie = `token=${data.loginDev.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
      router.push("/dashboard");
    },
    onError: (error) => {
      setErrorMsg(error.message);
    },
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    loginDev({ variables: { email, password } });
  };

  const handleGoogleLogin = () => {
    if (googleData?.googleAuthUrl) {
      window.location.href = googleData.googleAuthUrl;
    }
  };

  const stats = [
    { value: articlesCount ? `${articlesCount}+` : "...", label: "Articles" },
    { value: "6", label: "Categories" },
    { value: devsCount ? `${devsCount}+` : "...", label: "Devs" },
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
                Continue building your developer knowledge base.
              </h2>
            </div>

            <p className="text-gray-400 text-base leading-relaxed max-w-md">
              Access saved bookmarks, publish articles, and discover practical notes from other developers.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Built for devs who document what they learn.
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
                Sign in
              </h1>
              <p className="text-gray-500 text-sm">
                New here?{" "}
                <Link
                  href="/register"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="cursor-pointer w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-6"
            >
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
              <span className="text-xs text-gray-400 font-medium">
                or continue with email
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {errorMsg && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-800">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all mt-2 disabled:opacity-70 bg-gray-950 hover:bg-indigo-700"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-gray-400">
              By signing in, you continue to WikiDev.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}