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
            {/* Top bar */}
            {/* <nav className="bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10 h-[73px]">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                        &larr; Dashboard
                    </Link>
                    <div className="w-px h-5 bg-gray-200" />
                    <h1 className="font-display font-bold text-xl text-gray-900">Articles</h1>
                </div>

                <div className="flex items-center gap-3">
                    {user && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase bg-indigo-600 shadow-sm">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                    <Link href="/dashboard/write" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-all">
                        Write Article
                    </Link>
                </div>
            </nav> */}


            <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-default">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="/articles" className="flex items-center space-x-3 rtl:space-x-reverse">
                        {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-7" alt="Flowbite Logo"/> */}
                            <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">Articles</span>
                    </a>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button type="button" className="text-white bg-purple-500 hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none">Write Article</button>
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-sticky" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" /></svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
                            <li>
                                <a href="/dashboard" className="block py-2 px-3 text-black bg-brand rounded-sm md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">About</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Services</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Contact</a>
                            </li>
                        </ul>
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
