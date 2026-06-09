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
            <header className="sticky top-0 z-10 flex flex-col gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                    <Link href="/dashboard" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
                        &larr; Dashboard
                    </Link>

                    <div className="hidden h-5 w-px bg-gray-200 sm:block" />

                    <h1 className="font-display truncate text-lg font-bold text-gray-900 sm:text-xl">
                        Bookmarks
                    </h1>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:w-auto md:justify-end">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold uppercase text-white shadow-sm">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="cursor-pointer text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600"
                        >
                            Log out
                        </button>
                    </div>

                    <Link href="/dashboard/write" className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 sm:w-auto">
                        Write Article
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
                <div className="mb-6 sm:mb-8">
                    <h2 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">
                        Your Saved Articles
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {loading ? "Loading..." : `${bookmarks.length} saved article${bookmarks.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* Articles list */}
                {loading ? (
                    <p className="py-8 text-center text-sm text-gray-400">Loading bookmarks...</p>
                ) : bookmarks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center sm:p-10">
                        <p className="mb-1 text-sm text-gray-400">No bookmarks yet.</p>
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
                                className="article-card card-hover block rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
                            >
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-1 flex-shrink-0 self-stretch rounded-full bg-gray-300" />

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                                {article.category}
                                            </span>
                                            <span className="text-xs text-gray-400">{getReadTime(article.content)}</span>
                                            <span className="text-xs text-gray-300">&middot;</span>
                                            <span className="text-xs text-gray-400">{formatDate(article.createdAt)}</span>
                                            <span className="text-xs text-gray-300">&middot;</span>
                                            <span className="max-w-full truncate text-xs text-gray-400">
                                                by {article.author}
                                            </span>
                                        </div>

                                        <h3 className="font-display mb-1 line-clamp-2 text-sm font-bold leading-snug text-gray-900 sm:text-base">
                                            {article.title}
                                        </h3>

                                        <p className="line-clamp-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
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
