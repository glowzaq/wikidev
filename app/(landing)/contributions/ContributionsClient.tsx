'use client'

import { User, Article, UserArticlesData } from "@/app/shared/type";
import { GET_USER_ARTICLES } from "@/lib/graphql/queries/contribution.queries";
import { DELETE_ARTICLE } from "@/lib/graphql/mutations/article.mutations";
import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Bookmark, PenTool, Settings, LogOut, Trash2, Edit3, MessageCircle, Heart } from "lucide-react";

export default function ContributionsClient({ user }: { user: User }) {
    const router = useRouter();
    const authorName = `${user.firstName} ${user.lastName}`;

    const { data, loading, error } = useQuery<UserArticlesData>(GET_USER_ARTICLES, {
        variables: { author: authorName },
        fetchPolicy: "cache-and-network"
    });

    const [deleteArticle] = useMutation(DELETE_ARTICLE, {
        refetchQueries: [{ query: GET_USER_ARTICLES, variables: { author: authorName } }],
        onCompleted: () => alert("Article deleted successfully."),
        onError: (err) => console.error("Delete Error:", err)
    });

    const articles = data?.userArticles || [];

    const totalLikes = articles.reduce((sum: number, art: Article) => sum + (art.likes?.length || 0), 0);
    const totalComments = articles.reduce((sum: number, art: Article) => sum + (art.comments?.length || 0), 0);

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
        router.push("/login");
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this article?")) {
            deleteArticle({ variables: { id } });
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(Number(timestamp) || timestamp);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: false },
        { label: "Articles", href: "/articles", icon: FileText, active: false },
        { label: "Bookmarks", href: "/bookmarks", icon: Bookmark, active: false },
        { label: "My Contributions", href: "/contributions", icon: PenTool, active: true },
        { label: "Settings", href: "/settings", icon: Settings, active: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Main content */}
            <main className="flex-1 min-w-0 overflow-auto">
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
                                Contributions
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

                <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Total Contributions", value: articles.length, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Total Likes", value: totalLikes, color: "text-rose-600", bg: "bg-rose-50" },
                            { label: "Total Comments", value: totalComments, color: "text-amber-600", bg: "bg-amber-50" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                <p className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Contributions List */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-display font-bold text-gray-900">Your Published Work</h3>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-gray-400">Loading contributions...</div>
                        ) : articles.length === 0 ? (
                            <div className="p-20 text-center">
                                <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-500 font-medium">You have not made any contributions yet.</p>
                                <Link href="/dashboard/write" className="text-gray-900 font-semibold hover:underline mt-2 inline-block">
                                    Start your first contribution &rarr;
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {articles.map((article: Article) => (
                                    <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                        {article.category}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{formatDate(article.createdAt)}</span>
                                                </div>
                                                <Link href={`/articles/${article.id}`} className="block">
                                                    <h4 className="font-display font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                                                        {article.title}
                                                    </h4>
                                                </Link>
                                                <div className="flex items-center gap-4 mt-3 text-gray-400">
                                                    <span className="flex items-center gap-1.5 text-xs">
                                                        <Heart size={14} /> {article.likes?.length || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs">
                                                        <MessageCircle size={14} /> {article.comments?.length || 0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/dashboard/edit/${article.id}`}
                                                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
