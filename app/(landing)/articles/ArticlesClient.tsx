'use client'

import { User, Article, ArticlesData } from "@/app/shared/type";
import { GET_ARTICLES } from "@/lib/graphql/queries/article.queries";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const CATEGORIES = ["All", "Frontend", "Backend", "DevOps", "Database", "Security"];

export default function ArticlesClient({ user }: { user?: User }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">Loading...</div>}>
            <ArticlesContent user={user} />
        </Suspense>
    );
}

function ArticlesContent({ user }: { user?: User }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

    const { data, loading } = useQuery<ArticlesData>(GET_ARTICLES, {
        fetchPolicy: "cache-and-network"
    });
    const allArticles = data?.articles || [];

    const filteredArticles = allArticles.filter((article: Article) => {
        const matchesCategory = activeCategory === "All" || article.category === activeCategory;
        const matchesSearch =
            !searchQuery ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
        return content.length > 180 ? content.slice(0, 180) + "..." : content;
    };

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 sticky top-0 z-10">
                <div className="flex items-center justify-between h-[73px]">
                    {/* Left */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Link
                            href="/dashboard"
                            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium whitespace-nowrap"
                        >
                            &larr; <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
                        <h1 className="font-display font-bold text-lg sm:text-xl text-gray-900 truncate">
                            Articles
                        </h1>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        {user && (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase bg-indigo-600 shadow-sm flex-shrink-0">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="hidden sm:block text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                        <Link
                            href="/dashboard/write"
                            className="bg-indigo-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-all whitespace-nowrap"
                        >
                            <span className="sm:hidden">Write</span>
                            <span className="hidden sm:inline">Write Article</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-30">
                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search articles by title or content..."
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-500 focus:bg-white transition-all bg-white shadow-sm"
                    />
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-2 flex-wrap mb-8">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                activeCategory === cat
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                    : "bg-white border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-xs text-gray-400 mb-4">
                    {loading ? "Loading..." : `${filteredArticles.length} article${filteredArticles.length !== 1 ? "s" : ""} found`}
                </p>

                {/* Articles list */}
                {loading ? (
                    <p className="text-sm text-gray-400 py-8 text-center">Loading articles...</p>
                ) : filteredArticles.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center">
                        <p className="text-sm text-gray-400 mb-1">No articles found.</p>
                        <p className="text-xs text-gray-300">
                            {searchQuery ? "Try a different search term." : "Be the first to write one!"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredArticles.map((article: Article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.id}`}
                                className="block article-card group bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-1 self-stretch rounded-full bg-gray-100 group-hover:bg-indigo-400 transition-colors flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-indigo-50 text-indigo-600">
                                                {article.category}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">{getReadTime(article.content)}</span>
                                            <span className="text-xs text-gray-300">&middot;</span>
                                            <span className="text-xs text-gray-400">{formatDate(article.createdAt)}</span>
                                        </div>
                                        <h3 className="font-display font-bold text-gray-900 text-lg mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                            {getExcerpt(article.content)}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    router.push(`/profile/${article.authorId}`);
                                                }}
                                                className="flex items-center gap-2 group/author cursor-pointer"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover/author:bg-indigo-50 group-hover/author:text-indigo-600 transition-colors uppercase">
                                                    {article.author?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium group-hover/author:text-indigo-600 transition-colors">{article.author}</span>
                                            </div>
                                            <span className="text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                                Read article &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
