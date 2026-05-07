"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { LOGIN_DEV } from "@/lib/graphql/mutations/dev.mutations";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")

  const [loginDev, { loading }] = useMutation(LOGIN_DEV, {
    onCompleted: (data: any) => {
      document.cookie = `token=${data.loginDev.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
      router.push('/dashboard')
    },
    onError: (error) => {
      setErrorMsg(error.message);
    },
  })

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg('Please fill in all fields')
      return
    }

    loginDev({ variables: { email, password } })
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-gray-900">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-display font-extrabold text-2xl text-white">
              wiki<span className="text-gray-400">dev</span>
              <span className="inline-block w-2 h-2 rounded-full bg-white ml-0.5 mb-1 align-middle" />
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-display font-extrabold text-4xl text-white leading-tight mb-4">
              Welcome back,<br />developer.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Pick up right where you left off. Your articles, bookmarks, and contributions are waiting.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "400+", label: "Articles" },
              { value: "6", label: "Categories" },
              { value: "1k+", label: "Devs" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-l-2 border-gray-600 pl-4">
          <p className="text-gray-400 text-sm italic">
            &quot;WikiDev has become my first stop whenever I&apos;m learning something new.&quot;
          </p>
          <p className="text-gray-500 text-xs font-semibold mt-2">&mdash; A happy contributor</p>
        </div>
      </div>

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
            <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-gray-900 font-semibold hover:underline transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6">
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
            <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs text-gray-400 hover:text-gray-700 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all pr-16"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xs font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-white font-bold text-sm py-3.5 rounded-lg transition-all mt-2 disabled:opacity-70 bg-gray-900 hover:bg-gray-800"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}