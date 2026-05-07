"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const CATEGORY_LIST = [
  "Frontend",
  "Backend",
  "Databases",
  "DevOps",
  "Security",
  "Mobile",
];

const features = [
  {
    title: "Curated by Devs",
    desc: "Every article is written and reviewed by experienced developers — no fluff, just signal.",
  },
  {
    title: "Always Up-to-date",
    desc: "Content is continuously updated to reflect the latest tools, frameworks, and best practices.",
  },
  {
    title: "Instantly Searchable",
    desc: "Find exactly what you need in seconds with powerful full-text search across all articles.",
  },
  {
    title: "Open Contribution",
    desc: "Any developer can contribute, suggest edits, or flag outdated information with ease.",
  },
];

import { useQuery } from "@apollo/client/react";
import { GET_ARTICLES } from "@/lib/graphql/queries/article.queries";
import { ArticlesData } from "@/app/shared/type";

export default function WikiDevLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { data } = useQuery<ArticlesData>(GET_ARTICLES);
  const articles = data?.articles || [];

  // Calculate real counts
  const dynamicCategories = CATEGORY_LIST.map(cat => {
    const count = articles.filter(art => art.category === cat).length;
    return {
      title: cat,
      count: `${count} article${count !== 1 ? 's' : ''}`
    };
  });

  useEffect(() => {
    setVisible(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/articles?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/articles`);
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/articles?q=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/articles?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm border-b border-gray-100" : "bg-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-extrabold text-xl text-gray-900">
            wiki<span className="badge-pill font-bold">dev</span>
            <span className="logo-dot" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500 font-medium">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#categories" className="hover:text-gray-900 transition-colors">Categories</a>
            <a href="#cta" className="hover:text-gray-900 transition-colors">Contribute</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors px-3 py-1.5 cursor-pointer">
                Sign in
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-primary text-white text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className={`fade-up ${visible ? "visible" : ""} inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-500 font-medium mb-8`}>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
            400+ articles and growing
          </div>

          {/* Heading */}
          <h1 className={`fade-up delay-1 ${visible ? "visible" : ""} font-display font-extrabold text-5xl md:text-7xl text-gray-900 leading-tight mb-6`}>
            The wiki built{" "}
            <span className="underline decoration-gray-300 decoration-2 underline-offset-8">for developers</span>
            {" "}by developers.
          </h1>

          <p className={`fade-up delay-2 ${visible ? "visible" : ""} text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed`}>
            WikiDev is your go-to reference for web development — clean articles, real code examples, and community-driven knowledge you can trust.
          </p>

          {/* Search bar */}
          <form 
            onSubmit={handleSearch}
            className={`fade-up delay-3 ${visible ? "visible" : ""} flex items-center max-w-xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden mb-8 focus-within:border-gray-400 transition-all shadow-sm`}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, e.g. 'React hooks', 'REST API'..."
              className="flex-1 px-5 py-4 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
            />
            <button 
              type="submit"
              className="btn-primary text-white text-sm font-semibold px-6 py-4 rounded-none cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Tags */}
          <div className={`fade-up delay-4 ${visible ? "visible" : ""} flex flex-wrap justify-center gap-2 text-sm text-gray-500`}>
            {["TypeScript", "GraphQL", "Next.js", "Docker", "PostgreSQL", "REST APIs"].map((t) => (
              <span 
                key={t} 
                onClick={() => handleTagClick(t)}
                className="tag bg-gray-100 rounded-full px-3 py-1 cursor-pointer hover:bg-gray-200 hover:text-gray-900 transition-all"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Why WikiDev?</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900">
              Everything you need,{" "}
              <span className="underline decoration-gray-300 decoration-2 underline-offset-8">nothing you don&apos;t.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`card-hover bg-white rounded-xl p-6 border border-gray-100 fade-up delay-${i + 1} ${visible ? "visible" : ""}`}
              >
                <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
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
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Browse</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900">
              Explore by <span className="underline decoration-gray-300 decoration-2 underline-offset-8">category</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              From frontend frameworks to database internals — find knowledge organized the way developers think.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {dynamicCategories.map((c, i) => (
              <div
                key={c.title}
                onClick={() => handleCategoryClick(c.title)}
                className={`cat-card bg-gray-50 border border-gray-200 rounded-xl p-6 fade-up delay-${i + 1} ${visible ? "visible" : ""} cursor-pointer hover:border-gray-400 transition-all`}
              >
                <h3 className="font-display font-bold text-xl text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{c.count}</p>
                <span className="text-sm font-semibold text-gray-900">
                   Browse articles &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-4">Open Source</p>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-5 leading-tight">
              Know something? <br />Share it.
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              WikiDev grows with every contribution. Write an article, improve an existing one, or just fix a typo — everything counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="w-full sm:w-auto bg-white text-gray-900 font-bold text-sm px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  Start Contributing
                </button>
              </Link>
              <Link href="/articles">
                <button className="w-full sm:w-auto border border-gray-600 text-gray-300 font-semibold text-sm px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  Explore Wiki
                </button>
              </Link>
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
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} WikiDev. Built by devs, for devs.</p>
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