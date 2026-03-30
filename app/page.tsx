"use client";

import { useState, useEffect } from "react";

const categories = [
  {
    icon: "⚛️",
    title: "Frontend",
    count: "124 articles",
    color: "from-cyan-400 to-blue-500",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  {
    icon: "⚙️",
    title: "Backend",
    count: "98 articles",
    color: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    icon: "🗄️",
    title: "Databases",
    count: "76 articles",
    color: "from-orange-400 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    icon: "🚀",
    title: "DevOps",
    count: "61 articles",
    color: "from-green-400 to-emerald-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    icon: "🔐",
    title: "Security",
    count: "45 articles",
    color: "from-pink-400 to-rose-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  {
    icon: "📱",
    title: "Mobile",
    count: "53 articles",
    color: "from-yellow-400 to-amber-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
];

const features = [
  {
    icon: "🧠",
    title: "Curated by Devs",
    desc: "Every article is written and reviewed by experienced developers — no fluff, just signal.",
    accent: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    icon: "⚡",
    title: "Always Up-to-date",
    desc: "Content is continuously updated to reflect the latest tools, frameworks, and best practices.",
    accent: "text-cyan-500",
    bg: "bg-cyan-50",
  },
  {
    icon: "🔍",
    title: "Instantly Searchable",
    desc: "Find exactly what you need in seconds with powerful full-text search across all articles.",
    accent: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: "🌐",
    title: "Open Contribution",
    desc: "Any developer can contribute, suggest edits, or flag outdated information with ease.",
    accent: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

export default function WikiDevLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-display font-800 text-xl text-gray-900">
            wiki<span className="badge-pill font-bold">dev</span>
            <span className="logo-dot" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500 font-medium">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#categories" className="hover:text-gray-900 transition-colors">Categories</a>
            <a href="#cta" className="hover:text-gray-900 transition-colors">Contribute</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors px-3 py-1.5">
              Sign in
            </button>
            <button className="btn-primary text-white text-sm font-semibold px-4 py-2 rounded-full">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mesh-bg noise relative pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className={`fade-up ${visible ? "visible" : ""} inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-500 font-medium mb-8 shadow-sm`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            400+ articles and growing
          </div>

          {/* Heading */}
          <h1 className={`fade-up delay-1 ${visible ? "visible" : ""} font-display font-extrabold text-5xl md:text-7xl text-gray-900 leading-tight mb-6`}>
            The wiki built{" "}
            <span className="relative inline-block">
              <span className="badge-pill">for developers</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 9 Q75 2 150 9 Q225 16 298 9" stroke="url(#uline)" strokeWidth="3" strokeLinecap="round" fill="none" />
                <defs>
                  <linearGradient id="uline" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {" "}by developers.
          </h1>

          <p className={`fade-up delay-2 ${visible ? "visible" : ""} text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed`}>
            WikiDev is your go-to reference for web development — clean articles, real code examples, and community-driven knowledge you can trust.
          </p>

          {/* Search bar */}
          <div className={`fade-up delay-3 ${visible ? "visible" : ""} flex items-center max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden mb-8 focus-within:ring-2 focus-within:ring-violet-300 transition-all`}>
            <span className="pl-5 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search articles, e.g. 'React hooks', 'REST API'..."
              className="flex-1 px-4 py-4 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
            />
            <button className="btn-primary text-white text-sm font-semibold px-6 py-4 rounded-none">
              Search
            </button>
          </div>

          {/* Tags */}
          <div className={`fade-up delay-4 ${visible ? "visible" : ""} flex flex-wrap justify-center gap-2 text-sm text-gray-500`}>
            {["TypeScript", "GraphQL", "Next.js", "Docker", "PostgreSQL", "REST APIs"].map((t) => (
              <span key={t} className="tag bg-gray-100 rounded-full px-3 py-1 cursor-pointer">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating decorative blobs */}
        <div className="absolute top-20 left-8 w-32 h-32 rounded-full bg-violet-200 opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-12 w-40 h-40 rounded-full bg-cyan-200 opacity-25 blur-3xl pointer-events-none" />
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-violet-500 uppercase tracking-widest mb-3">Why WikiDev?</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900">
              Everything you need,{" "}
              <span className="badge-pill">nothing you don't.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`card-hover bg-white rounded-2xl p-6 border border-gray-100 shadow-sm fade-up delay-${i + 1} ${visible ? "visible" : ""}`}
              >
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center text-2xl mb-5`}>
                  {f.icon}
                </div>
                <h3 className={`font-display font-bold text-lg text-gray-900 mb-2`}>{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-cyan-500 uppercase tracking-widest mb-3">Browse</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900">
              Explore by <span className="badge-pill">category</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              From frontend frameworks to database internals — find knowledge organized the way developers think.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {categories.map((c, i) => (
              <div
                key={c.title}
                className={`cat-card ${c.bg} border ${c.border} rounded-2xl p-6 fade-up delay-${i + 1} ${visible ? "visible" : ""}`}
              >
                <div className={`text-4xl mb-4`}>{c.icon}</div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{c.count}</p>
                <div className={`inline-flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>
                  Browse articles →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-5 translate-y-1/2 -translate-x-1/2" />

            <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">Open Source</p>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-5 leading-tight">
              Know something? <br />Share it.
            </h2>
            <p className="text-white/75 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              WikiDev grows with every contribution. Write an article, improve an existing one, or just fix a typo — everything counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-violet-700 font-bold text-sm px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-md">
                Start Contributing
              </button>
              <button className="border-2 border-white/40 text-white font-semibold text-sm px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
                Read the Docs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display font-bold text-lg text-gray-900">
            wiki<span className="badge-pill">dev</span>
            <span className="logo-dot" />
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} WikiDev. Built by devs, for devs.</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-700 transition-colors">GitHub</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Twitter</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}