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

  const handleSubmit = async (e: React.MouseEvent) => {
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
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-indigo-900">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-display font-extrabold text-2xl text-white">
              wiki<span className="text-indigo-300">dev</span>
              <span className="inline-block w-2 h-2 rounded-full bg-white ml-0.5 mb-1 align-middle" />
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-display font-extrabold text-4xl text-white leading-tight mb-4">
              Welcome back,<br />developer.
            </h2>
            <p className="text-indigo-200 text-lg leading-relaxed">
              Pick up right where you left off. Your articles, bookmarks, and contributions are waiting.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-indigo-500/5 rounded-xl p-4 text-center border border-indigo-300/30">
                <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                <p className="text-indigo-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-l-2 border-indigo-500 pl-4">
          <p className="text-indigo-200 text-sm italic">
            &quot;WikiDev has become my first stop whenever I&apos;m learning something new.&quot;
          </p>
          <p className="text-indigo-300 text-xs font-semibold mt-2">&mdash; A happy contributor</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
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
            <h1 className="font-display font-extrabold text-3xl text-indigo-900 mb-2">Sign in</h1>
            <p className="text-indigo-600 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-700 font-semibold hover:underline transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="cursor-pointer w-full flex items-center justify-center gap-3 border border-indigo-200 rounded-lg py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors mb-6"
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
            <div className="flex-1 h-px bg-indigo-200" />
            <span className="text-xs text-indigo-500 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-indigo-200" />
          </div>

          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-900 placeholder-indigo-400 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-indigo-900">Password</label>
                <a href="#" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-900 placeholder-indigo-400 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all pr-16"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors text-xs font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-white font-bold text-sm py-3.5 rounded-lg transition-all mt-2 disabled:opacity-70 bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}