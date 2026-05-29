'use client'

import { User, Article, DevData, UserArticlesByIdData } from "@/app/shared/type";
import { GET_USER_ARTICLES_BY_ID } from "@/lib/graphql/queries/article.queries";
import { GET_DEV } from "@/lib/graphql/queries/dev.queries";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileClient({ profileId, currentUser }: { profileId: string, currentUser?: User }) {
    const router = useRouter();

    const { data: devData, loading: devLoading } = useQuery<DevData>(GET_DEV, {
        variables: { id: profileId }
    });

    const { data: articlesData, loading: articlesLoading, error: articlesError } = useQuery<UserArticlesByIdData>(GET_USER_ARTICLES_BY_ID, {
        variables: { authorId: profileId },
        fetchPolicy: "cache-and-network"
    });

    if (articlesError) console.error("Profile Articles Error:", articlesError);

    const dev = devData?.dev;
    const articles = articlesData?.userArticlesById || [];

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
        router.push("/login");
    };

    if (devLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">Loading profile...</div>;
    if (!dev) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">Author not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                        &larr; Dashboard
                    </Link>
                    <div className="w-px h-5 bg-gray-200" />
                    <h1 className="font-display font-bold text-xl text-gray-900">Profile</h1>
                </div>

                <div className="flex items-center gap-3">
                    {currentUser && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase bg-indigo-600 shadow-sm">
                                {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
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
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-xl shadow-indigo-100 shrink-0">
                            {dev.firstName?.[0]}{dev.lastName?.[0]}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h2 className="font-display font-extrabold text-3xl text-gray-900">
                                    {dev.firstName} {dev.lastName}
                                </h2>
                                {dev.role === 'admin' && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">Admin</span>
                                )}
                            </div>
                            <p className="text-gray-500 font-medium mb-4">{dev.email}</p>
                            <p className="text-gray-600 leading-relaxed max-w-2xl">
                                {dev.bio || "This author hasn't added a bio yet. They're too busy writing great technical articles!"}
                            </p>
                        </div>
                        {currentUser?.id === profileId && (
                            <Link href="/settings" className="px-6 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                Edit Profile
                            </Link>
                        )}
                    </div>
                </div>

                {/* Articles Section */}
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-8 px-2">
                    Articles by {dev.firstName}
                    <span className="ml-3 text-sm font-medium text-gray-400">({articles.length})</span>
                </h3>

                {articlesLoading ? (
                    <p className="text-sm text-gray-400 py-12 text-center">Loading articles...</p>
                ) : articles.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-16 text-center">
                        <p className="text-gray-400 font-medium">No articles published yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((article: Article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.id}`}
                                className="group bg-white rounded-3xl p-6 border border-gray-50 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                            >
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 mb-4 inline-block">
                                    {article.category}
                                </span>
                                <h4 className="font-display font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2 leading-snug">
                                    {article.title}
                                </h4>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xs text-gray-400 font-medium">
                                        {new Date(Number(article.createdAt) || article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                    <span className="text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                        Read &rarr;
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
