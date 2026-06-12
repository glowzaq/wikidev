'use client'

import { User, Article, ArticlesData } from "@/app/shared/type";
import { GET_ARTICLES } from "@/lib/graphql/queries/article.queries";
import { DELETE_ARTICLE } from "@/lib/graphql/mutations/article.mutations";
import { useQuery, useMutation } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Trash2, ExternalLink, Users, FileText, Activity } from "lucide-react";

export default function AdminClient({ user }: { user: User }) {
    const router = useRouter();

    const { data, loading, refetch } = useQuery<ArticlesData>(GET_ARTICLES);
    const [deleteArticle] = useMutation(DELETE_ARTICLE, {
        onCompleted: () => refetch(),
        onError: (err) => alert(err.message)
    });

    const articles = data?.articles || [];

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
        router.push("/login");
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"? This action is irreversible.`)) {
            await deleteArticle({ variables: { id } });
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">Accessing admin console...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Admin Header */}
            <header className="bg-gray-800 border-b border-gray-700 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-500 p-1.5 rounded-lg">
                        <Shield size={20} className="text-gray-900" />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Wiki
                    </Link>
                    <div className="flex items-center gap-2 border-l border-gray-700 pl-6">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase bg-indigo-600">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><FileText size={20} /></div>
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Articles</span>
                        </div>
                        <p className="text-3xl font-display font-bold">{articles.length}</p>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><Activity size={20} /></div>
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Comments</span>
                        </div>
                        <p className="text-3xl font-display font-bold">
                            {articles.reduce((acc, art) => acc + (art.comments?.length || 0), 0)}
                        </p>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Users size={20} /></div>
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Authors</span>
                        </div>
                        <p className="text-3xl font-display font-bold">
                            {new Set(articles.map(a => a.authorId)).size}
                        </p>
                    </div>
                </div>

                {/* Moderation Table */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-gray-800/50">
                        <h2 className="font-bold text-lg">Article Moderation</h2>
                        <span className="text-xs text-gray-500">
                            Manage all content across the platform
                        </span>
                    </div>

                    {/* Mobile cards */}
                    <div className="block md:hidden divide-y divide-gray-700/50">
                        {articles.map((article) => (
                            <div key={article.id} className="p-4 space-y-4">
                                <div>
                                    <p className="font-bold text-gray-100 leading-snug break-words">
                                        {article.title}
                                    </p>
                                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400 font-medium">
                                        {article.category}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                        {article.author?.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <span className="text-sm text-gray-300 break-words">
                                        {article.author}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <div className="flex gap-4">
                                        <span>❤️ {article.likes?.length || 0}</span>
                                        <span>💬 {article.comments?.length || 0}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/articles/${article.id}`}
                                            className="p-2 bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                                            title="View Article"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(article.id, article.title)}
                                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                            title="Delete Article"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-700/50">
                                    <th className="px-6 py-4 font-bold">Article</th>
                                    <th className="px-6 py-4 font-bold">Author</th>
                                    <th className="px-6 py-4 font-bold text-center">Stats</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-700/50">
                                {articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-700/30 transition-colors group">
                                        <td className="px-6 py-5 max-w-[420px]">
                                            <p className="font-bold text-gray-100 mb-1 break-words">
                                                {article.title}
                                            </p>
                                            <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400 font-medium">
                                                {article.category}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                                    {article.author?.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <span className="text-sm text-gray-300">
                                                    {article.author}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-medium">
                                                <span title="Likes">❤️ {article.likes?.length || 0}</span>
                                                <span title="Comments">💬 {article.comments?.length || 0}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/articles/${article.id}`}
                                                    className="p-2 bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                                                    title="View Article"
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(article.id, article.title)}
                                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                    title="Delete Article"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
