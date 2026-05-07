'use client'

import { User, Article, DevBookmarksData } from "@/app/shared/type";
import { GET_DEV_BOOKMARKS } from "@/lib/graphql/queries/dev.queries";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BookmarksClient({ user }: { user: User }) {
    const router = useRouter();

    const { data, loading } = useQuery<DevBookmarksData>(GET_DEV_BOOKMARKS, {
        variables: { id: user.id },
    });
    
    const bookmarks = data?.dev?.bookmarks || [];

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
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                        &larr; Dashboard
                    </Link>
                    <div className="w-px h-5 bg-gray-200" />
                    <h1 className="font-display font-bold text-xl text-gray-900">Bookmarks</h1>
                </div>

                <div className="flex items-center gap-3">
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
                    <Link href="/dashboard/write" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-all">
                        Write Article
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h2 className="font-display font-bold text-2xl text-gray-900">Your Saved Articles</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {loading ? "Loading..." : `${bookmarks.length} saved article${bookmarks.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* Articles list */}
                {loading ? (
                    <p className="text-sm text-gray-400 py-8 text-center">Loading bookmarks...</p>
                ) : bookmarks.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center">
                        <p className="text-sm text-gray-400 mb-1">No bookmarks yet.</p>
                        <p className="text-xs text-gray-300">
                            Read articles and save them to find them here!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bookmarks.map((article: Article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.id}`}
                                className="block article-card card-hover bg-white rounded-xl p-5 border border-gray-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-1 self-stretch rounded-full bg-gray-300 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                {article.category}
                                            </span>
                                            <span className="text-xs text-gray-400">{getReadTime(article.content)}</span>
                                            <span className="text-xs text-gray-300">&middot;</span>
                                            <span className="text-xs text-gray-400">{formatDate(article.createdAt)}</span>
                                            <span className="text-xs text-gray-300">&middot;</span>
                                            <span className="text-xs text-gray-400">by {article.author}</span>
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
            </main>
        </div>
    );
}
