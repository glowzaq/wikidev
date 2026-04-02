"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
    { icon: "⚡", label: "Dashboard", href: "/dashboard", active: true },
    { icon: "📚", label: "Articles", href: "/articles", active: false },
    { icon: "🔖", label: "Bookmarks", href: "/bookmarks", active: false },
    { icon: "✍️", label: "My Contributions", href: "/contributions", active: false },
    { icon: "⚙️", label: "Settings", href: "/settings", active: false },
];

const categories = [
    { label: "Frontend", color: "bg-cyan-100 text-cyan-700" },
    { label: "Backend", color: "bg-violet-100 text-violet-700" },
    { label: "DevOps", color: "bg-emerald-100 text-emerald-700" },
    { label: "Database", color: "bg-orange-100 text-orange-700" },
    { label: "Security", color: "bg-rose-100 text-rose-700" },
];

const recentArticles = [
    {
        id: 1,
        title: "Understanding React Server Components in Next.js 15",
        category: "Frontend",
        categoryColor: "bg-cyan-100 text-cyan-700",
        readTime: "6 min read",
        date: "Apr 1, 2026",
        excerpt: "A deep dive into how RSC changes the mental model for data fetching and rendering in Next.js apps.",
        gradient: "from-cyan-400 to-blue-500",
    },
    {
        id: 2,
        title: "GraphQL Schema Design Patterns You Should Know",
        category: "Backend",
        categoryColor: "bg-violet-100 text-violet-700",
        readTime: "8 min read",
        date: "Mar 28, 2026",
        excerpt: "Best practices for structuring your GraphQL schema to keep it scalable and maintainable as your API grows.",
        gradient: "from-violet-400 to-purple-600",
    },
    {
        id: 3,
        title: "MongoDB Indexing Strategies for Performance",
        category: "Database",
        categoryColor: "bg-orange-100 text-orange-700",
        readTime: "5 min read",
        date: "Mar 25, 2026",
        excerpt: "How to choose the right index type and avoid common pitfalls that silently kill query performance.",
        gradient: "from-orange-400 to-red-500",
    },
    {
        id: 4,
        title: "Docker Compose for Local Dev Environments",
        category: "DevOps",
        categoryColor: "bg-emerald-100 text-emerald-700",
        readTime: "7 min read",
        date: "Mar 22, 2026",
        excerpt: "Set up a reproducible local dev environment with Docker Compose — databases, services, and all.",
        gradient: "from-emerald-400 to-green-600",
    },
];

const bookmarks = [
    {
        id: 1,
        title: "TypeScript Generics Explained",
        category: "Frontend",
        categoryColor: "bg-cyan-100 text-cyan-700",
        readTime: "4 min read",
    },
    {
        id: 2,
        title: "REST vs GraphQL: When to Use What",
        category: "Backend",
        categoryColor: "bg-violet-100 text-violet-700",
        readTime: "6 min read",
    },
    {
        id: 3,
        title: "JWT Authentication Deep Dive",
        category: "Security",
        categoryColor: "bg-rose-100 text-rose-700",
        readTime: "9 min read",
    },
];

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }

        .gradient-text {
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px rgba(0,0,0,0.08);
        }
        .nav-item {
          transition: background 0.15s ease, color 0.15s ease;
        }
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .article-card { animation: fadeIn 0.4s ease forwards; }
        .article-card:nth-child(1) { animation-delay: 0.05s; }
        .article-card:nth-child(2) { animation-delay: 0.1s; }
        .article-card:nth-child(3) { animation-delay: 0.15s; }
        .article-card:nth-child(4) { animation-delay: 0.2s; }

        .write-btn {
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .write-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .sidebar-overlay {
          backdrop-filter: blur(4px);
          background: rgba(0,0,0,0.3);
        }
      `}</style>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 sidebar-overlay lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:static lg:z-auto shadow-sm`}
            >
                {/* Logo */}
                <div className="px-6 py-5 border-b border-gray-100">
                    <Link href="/">
                        <span className="font-display font-extrabold text-xl text-gray-900">
                            wiki<span className="gradient-text">dev</span>
                            <span
                                className="inline-block w-2 h-2 rounded-full ml-0.5 mb-1 align-middle"
                                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                            />
                        </span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">Menu</p>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${item.active
                                    ? "bg-violet-50 text-violet-700"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                            {item.active && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
                            )}
                        </Link>
                    ))}

                    {/* Categories */}
                    <div className="pt-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">Categories</p>
                        <div className="space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.label}
                                    className="nav-item w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                >
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>
                                        {cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* User */}
                <div className="px-4 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                        >
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">John Doe</p>
                            <p className="text-xs text-gray-400 truncate">john@example.com</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors text-sm">↗</button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            ☰
                        </button>
                        <div>
                            <h1 className="font-display font-bold text-xl text-gray-900">Dashboard</h1>
                            <p className="text-xs text-gray-400">Welcome back, John 👋</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-400 w-48">
                            <span>🔍</span>
                            <span>Search articles...</span>
                        </div>

                        {/* Write button */}
                        <button className="write-btn text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2">
                            <span>✍️</span>
                            <span className="hidden sm:inline">Write Article</span>
                        </button>
                    </div>
                </header>

                {/* Page body */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-8">

                        {/* Quick write CTA banner */}
                        <div
                            className="fade-in relative rounded-2xl p-6 overflow-hidden text-white"
                            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #0891b2 100%)" }}
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white opacity-5 -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-cyan-400 opacity-10 translate-y-1/2 blur-2xl" />
                            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Contribute</p>
                                    <h2 className="font-display font-bold text-2xl mb-1">Got something to share?</h2>
                                    <p className="text-white/70 text-sm">Write an article and help fellow devs grow.</p>
                                </div>
                                <button className="bg-white text-violet-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-md flex items-center gap-2">
                                    ✍️ Start Writing
                                </button>
                            </div>
                        </div>

                        {/* Two column layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Recent articles — takes 2/3 */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-display font-bold text-lg text-gray-900">Recent Articles</h2>
                                    <Link href="/articles" className="text-sm text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                                        View all →
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {recentArticles.map((article) => (
                                        <div
                                            key={article.id}
                                            className="article-card card-hover bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Color bar */}
                                                <div
                                                    className={`w-1 self-stretch rounded-full bg-gradient-to-b ${article.gradient} flex-shrink-0`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${article.categoryColor}`}>
                                                            {article.category}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{article.readTime}</span>
                                                        <span className="text-xs text-gray-300">·</span>
                                                        <span className="text-xs text-gray-400">{article.date}</span>
                                                    </div>
                                                    <h3 className="font-display font-bold text-gray-900 text-base mb-1 leading-snug">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                                        {article.excerpt}
                                                    </p>
                                                </div>
                                                <button className="text-gray-300 hover:text-violet-500 transition-colors text-lg flex-shrink-0">
                                                    🔖
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bookmarks — takes 1/3 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-display font-bold text-lg text-gray-900">Bookmarks</h2>
                                    <Link href="/bookmarks" className="text-sm text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                                        See all →
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {bookmarks.map((item) => (
                                        <div
                                            key={item.id}
                                            className="card-hover bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.categoryColor}`}>
                                                    {item.category}
                                                </span>
                                                <span className="text-xs text-gray-400 flex-shrink-0">{item.readTime}</span>
                                            </div>
                                            <h3 className="font-display font-semibold text-gray-800 text-sm leading-snug">
                                                {item.title}
                                            </h3>
                                        </div>
                                    ))}
                                </div>

                                {/* Empty state hint */}
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 text-center">
                                    <p className="text-2xl mb-2">🔖</p>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Bookmark articles while reading to save them here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}