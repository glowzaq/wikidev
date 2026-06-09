'use client'
import { User, ArticlesData, DevBookmarksData } from "@/app/shared/type";
import { GET_ARTICLES } from "@/lib/graphql/queries/article.queries";
import { GET_DEV_BOOKMARKS } from "@/lib/graphql/queries/dev.queries";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Shield } from "lucide-react";

export default function DashboardClient({ user }: { user?: User }) {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
        router.push("/login");
    };

    const navItems = [
        { label: "Dashboard", href: "/dashboard", active: true },
        { label: "Articles", href: "/articles", active: false },
        { label: "Bookmarks", href: "/bookmarks", active: false },
        { label: "My Contributions", href: "/contributions", active: false },
        { label: "Settings", href: "/settings", active: false },
    ];

    if (user?.role === "admin") {
        navItems.push({ label: "Admin Console", href: "/admin_dashboard", active: false });
    }

    const categories = [
        { label: "Frontend" },
        { label: "Backend" },
        { label: "DevOps" },
        { label: "Database" },
        { label: "Security" },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const { data, loading: articlesLoading } = useQuery<ArticlesData>(GET_ARTICLES, {
        fetchPolicy: "cache-and-network"
    });

    const filteredArticles = selectedCategory
        ? data?.articles?.filter(art => art.category === selectedCategory) || []
        : data?.articles || [];

    const recentArticles = filteredArticles.slice(0, 6);

    const getReadTime = (content: string) => {
        const words = content?.trim().split(/\s+/).length || 0;
        return `${Math.max(1, Math.ceil(words / 200))} min read`;
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(Number(timestamp) || timestamp);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getExcerpt = (content: string) => {
        if (!content) return "";
        return content.length > 150 ? content.slice(0, 150) + "..." : content;
    };

    const { data: bookmarksData, loading: bookmarksLoading } = useQuery<DevBookmarksData>(GET_DEV_BOOKMARKS, {
        variables: { id: user?.id },
        skip: !user,
    });
    const realBookmarks = bookmarksData?.dev?.bookmarks || [];

    const handleCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/articles?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push(`/articles`);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen w-56 max-w-[75vw] bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:static lg:z-auto lg:w-60 lg:max-w-none`}
            >
                {/* Logo */}
                <div className="px-6 border-b border-gray-200 flex-shrink-0 flex items-center h-[73px]">
                    <Link href="/">
                        <span className="font-display font-extrabold text-xl text-gray-900">
                            wiki<span className="gradient-text">dev</span>
                        </span>
                    </Link>
                </div>

                {/* Nav — scrollable, fills remaining space */}
                <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
                        Menu
                    </p>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${item.active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                } ${item.label === "Admin Console" ? "text-amber-600 hover:bg-amber-50" : ""}`}
                        >
                            {item.label === "Admin Console" && <Shield size={16} />}
                            {item.label}
                            {item.active && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gray-900" />
                            )}
                        </Link>
                    ))}

                    {/* Categories */}
                    <div className="pt-5">
                        <div className="flex items-center justify-between px-3 mb-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                Categories
                            </p>
                            {selectedCategory && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setSidebarOpen(false);
                                    }}
                                    className="text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.label}
                                    onClick={() => {
                                        handleCategoryClick(cat.label);
                                        setSidebarOpen(false);
                                    }}
                                    className={`nav-item w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat.label
                                        ? "bg-indigo-50 text-indigo-600 font-bold border-l-4 border-indigo-500 rounded-l-none"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* User footer — pinned to bottom */}
                <div className="px-4 py-4 border-t border-gray-200 space-y-3 flex-shrink-0">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 uppercase bg-indigo-600 shadow-sm">
                            {user?.firstName?.[0] || "J"}{user?.lastName?.[0] || "D"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user?.firstName}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all cursor-pointer"
                    >
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main content — its own scroll container */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0 z-10 h-[73px]">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
                        >
                            <Menu />
                        </button>
                        <div>
                            <h1 className="font-display font-bold text-xl text-gray-900">Dashboard</h1>
                            <p className="text-xs text-gray-400">
                                Welcome back, {user?.firstName?.split(" ")[0]}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-48 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-all"
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                className="bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none w-full"
                            />
                        </form>

                        {/* Write button */}
                        <Link
                            href="/dashboard/write"
                            className="write-btn text-white text-sm font-semibold px-4 py-2 rounded-lg"
                        >
                            Write Article
                        </Link>
                    </div>
                </header>

                {/* Scrollable main area */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-8">

                        {/* Quick write CTA banner */}
                        <div className="fade-in rounded-xl p-6 bg-gray-900 text-white">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">
                                        Contribute
                                    </p>
                                    <h2 className="font-display font-bold text-2xl mb-1">
                                        Got something to share?
                                    </h2>
                                    <p className="text-gray-400 text-sm">
                                        Write an article and help fellow devs grow.
                                    </p>
                                </div>
                                <Link
                                    href="/dashboard/write"
                                    className="bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Start Writing
                                </Link>
                            </div>
                        </div>

                        {/* Two column layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Recent articles — 2/3 width */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-display font-bold text-lg text-gray-900">
                                        {selectedCategory ? `${selectedCategory} Articles` : "Recent Articles"}
                                    </h2>
                                    <Link
                                        href="/articles"
                                        className="text-sm text-gray-500 font-semibold hover:text-gray-900 transition-colors"
                                    >
                                        View all &rarr;
                                    </Link>
                                </div>

                                {articlesLoading ? (
                                    <p className="text-sm text-gray-400 py-4">Loading articles...</p>
                                ) : recentArticles.length === 0 ? (
                                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                                        <p className="text-sm text-gray-400">
                                            No articles yet. Be the first to write one!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {recentArticles.map((article: any) => (
                                            <Link
                                                href={`/articles/${article.id}`}
                                                key={article.id}
                                                className="block article-card card-hover bg-white rounded-xl p-5 border border-gray-200 cursor-pointer"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-1 self-stretch rounded-full bg-gray-300 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                                {article.category}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {getReadTime(article.content)}
                                                            </span>
                                                            <span className="text-xs text-gray-300">&middot;</span>
                                                            <span className="text-xs text-gray-400">
                                                                {formatDate(article.createdAt)}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-display font-bold text-gray-900 text-base mb-1 leading-snug">
                                                            {article.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                                            {getExcerpt(article.content)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Bookmarks — 1/3 width */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-display font-bold text-lg text-gray-900">Bookmarks</h2>
                                    <Link
                                        href="/bookmarks"
                                        className="text-sm text-gray-500 font-semibold hover:text-gray-900 transition-colors"
                                    >
                                        See all &rarr;
                                    </Link>
                                </div>

                                {bookmarksLoading ? (
                                    <p className="text-sm text-gray-400 py-4">Loading bookmarks...</p>
                                ) : realBookmarks.length === 0 ? (
                                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center">
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            Bookmark articles while reading to save them here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {realBookmarks.map((item: any) => (
                                            <Link
                                                href={`/articles/${item.id}`}
                                                key={item.id}
                                                className="block card-hover bg-white rounded-xl p-4 border border-gray-200 cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                                        {getReadTime(item.content)}
                                                    </span>
                                                </div>
                                                <h3 className="font-display font-semibold text-gray-800 text-sm leading-snug">
                                                    {item.title}
                                                </h3>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}