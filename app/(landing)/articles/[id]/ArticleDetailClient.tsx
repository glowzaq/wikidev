'use client'

import { GET_ARTICLE, GET_ARTICLES } from "@/lib/graphql/queries/article.queries";
import { GET_DEV_BOOKMARKS } from "@/lib/graphql/queries/dev.queries";
import { BOOKMARK_ARTICLE, UNBOOKMARK_ARTICLE } from "@/lib/graphql/mutations/bookmark.mutations";
import { DELETE_ARTICLE } from "@/lib/graphql/mutations/article.mutations";
import { useQuery, useMutation } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, ArticleData, ArticlesData, DevBookmarksData } from "@/app/shared/type";
import { LIKE_ARTICLE, UNLIKE_ARTICLE, COMMENT_ARTICLE } from "@/lib/graphql/mutations/interaction.mutations";
import { useState } from "react";
import MarkdownRenderer from "@/app/shared/MarkdownRenderer";
import TableOfContents from "@/app/shared/TableOfContents";

export default function ArticleDetailClient({ articleId, user }: { articleId: string, user?: User }) {
    const router = useRouter();
    const [commentText, setCommentText] = useState("");

    const { data, loading, error } = useQuery<ArticleData>(GET_ARTICLE, {
        variables: { id: articleId },
    });

    const { data: allArticlesData } = useQuery<ArticlesData>(GET_ARTICLES);
    const relatedArticles = allArticlesData?.articles
        ?.filter(a => a.category === data?.article?.category && a.id !== articleId)
        .slice(0, 3) || [];

    const { data: bookmarksData } = useQuery<DevBookmarksData>(GET_DEV_BOOKMARKS, {
        variables: { id: user?.id },
        skip: !user,
        fetchPolicy: "cache-and-network"
    });

    const [bookmarkArticle] = useMutation(BOOKMARK_ARTICLE, {
        refetchQueries: [{ query: GET_DEV_BOOKMARKS, variables: { id: user?.id } }],
        onError: (err) => console.error("Bookmark Error:", err)
    });

    const [unbookmarkArticle] = useMutation(UNBOOKMARK_ARTICLE, {
        refetchQueries: [{ query: GET_DEV_BOOKMARKS, variables: { id: user?.id } }],
        onError: (err) => console.error("Unbookmark Error:", err)
    });

    const [deleteArticle, { loading: deleteLoading }] = useMutation(DELETE_ARTICLE, {
        refetchQueries: [{ query: GET_ARTICLES }],
        onCompleted: () => router.push("/dashboard"),
        onError: (err) => console.error("Delete Error:", err)
    });

    const [likeArticle] = useMutation(LIKE_ARTICLE, {
        refetchQueries: [{ query: GET_ARTICLE, variables: { id: articleId } }],
        onError: (err) => console.error("Like Error:", err)
    });

    const [unlikeArticle] = useMutation(UNLIKE_ARTICLE, {
        refetchQueries: [{ query: GET_ARTICLE, variables: { id: articleId } }],
        onError: (err) => console.error("Unlike Error:", err)
    });

    const [commentArticle, { loading: commentLoading }] = useMutation(COMMENT_ARTICLE, {
        refetchQueries: [{ query: GET_ARTICLE, variables: { id: articleId } }],
        onCompleted: () => setCommentText(""),
        onError: (err) => console.error("Comment Error:", err)
    });

    const article = data?.article;
    const isBookmarked = bookmarksData?.dev?.bookmarks?.some((b: any) => b.id === articleId);
    const isLiked = user && article?.likes?.includes(user.id);
    const isAuthor = user && article && (article.authorId === user.id || user.role === 'admin');

    const handleBookmark = async () => {
        if (!user) return;
        if (isBookmarked) {
            await unbookmarkArticle({ variables: { devId: user.id, articleId } });
        } else {
            await bookmarkArticle({ variables: { devId: user.id, articleId } });
        }
    };

    const handleLike = async () => {
        console.log("Like button clicked. User:", user?.id, "Article:", articleId, "isLiked:", isLiked);
        if (!user) {
            console.log("No user found, ignoring like.");
            return;
        }
        try {
            if (isLiked) {
                console.log("Calling unlikeArticle...");
                await unlikeArticle({ variables: { articleId, userId: user.id } });
            } else {
                console.log("Calling likeArticle...");
                await likeArticle({ variables: { articleId, userId: user.id } });
            }
        } catch (err) {
            console.error("Error in handleLike:", err);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Comment submit clicked. Text:", commentText);
        if (!user || !commentText.trim()) {
            console.log("Invalid user or empty comment, ignoring.");
            return;
        }
        try {
            console.log("Calling commentArticle...");
            const res = await commentArticle({
                variables: {
                    articleId,
                    userId: user.id,
                    userName: `${user.firstName} ${user.lastName}`,
                    text: commentText.trim()
                }
            });
            console.log("Comment result:", res);
        } catch (err) {
            console.error("Error in handleCommentSubmit:", err);
        }
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this article?")) {
            deleteArticle({ variables: { id: articleId } });
        }
    };

    const getReadTime = (content: string) => {
        const words = content?.trim().split(/\s+/).length || 0;
        return `${Math.max(1, Math.ceil(words / 200))} min read`;
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(Number(timestamp) || timestamp);
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-sm text-gray-400">Loading article...</p></div>;
    if (error || !article) return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4"><p className="text-sm text-gray-500">Article not found.</p><Link href="/articles" className="text-sm font-semibold text-gray-900 hover:underline">&larr; Back to articles</Link></div>;

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/articles" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">&larr; All Articles</Link>
                </div>
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Dashboard</Link>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
                <article className="flex-1 min-w-0">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600">{article.category}</span>
                            <span className="text-xs text-gray-400 font-medium">{getReadTime(article.content)}</span>
                        </div>

                        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-gray-900 leading-tight mb-6">{article.title}</h1>

                        <Link href={`/profile/${article.authorId}`} className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold uppercase bg-indigo-600 shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                                {article.author?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{article.author}</p>
                                <p className="text-xs text-gray-400 font-medium">{formatDate(article.createdAt)}</p>
                            </div>
                        </Link>

                        <div className="mt-8 flex items-center gap-4">
                            {user && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleBookmark}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isBookmarked ? "bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"}`}
                                    >
                                        {isBookmarked ? "✓ Saved" : "Bookmark"}
                                    </button>

                                    <button
                                        onClick={handleLike}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isLiked ? "bg-indigo-50 text-indigo-600 border border-indigo-200" : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 shadow-sm"}`}
                                    >
                                        {isLiked ? "❤️" : "🤍"} {article.likes?.length || 0}
                                    </button>
                                </div>
                            )}

                            {isAuthor && (
                                <div className="flex items-center gap-2">
                                    <Link href={`/dashboard/edit/${articleId}`} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gray-50 text-gray-700 border border-gray-100 hover:bg-white hover:border-indigo-400 transition-all">Edit</Link>
                                    <button onClick={handleDelete} disabled={deleteLoading} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all disabled:opacity-50">
                                        {deleteLoading ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-100 mb-10" />

                    <MarkdownRenderer content={article.content} />

                    <div className="w-full h-px bg-gray-100 mt-16 mb-10" />

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <section className="mb-16">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-display font-bold text-2xl text-gray-900">Related Articles</h3>
                                <Link href={`/articles?category=${encodeURIComponent(article.category)}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                    View all {article.category} &rarr;
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relatedArticles.map((rel) => (
                                    <Link 
                                        key={rel.id} 
                                        href={`/articles/${rel.id}`}
                                        className="group bg-gray-50/50 rounded-2xl p-6 border border-gray-100 hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white text-indigo-600 border border-gray-100 mb-4 inline-block">
                                            {rel.category}
                                        </span>
                                        <h4 className="font-display font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                                            {rel.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 font-medium">By {rel.author}</p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Interaction Section */}
                    <section className="mt-16">
                        <h3 className="font-display font-bold text-2xl text-gray-900 mb-8">Discussion</h3>

                        {user ? (
                            <form onSubmit={handleCommentSubmit} className="mb-12">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="What are your thoughts?"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                                    rows={4}
                                />
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="submit"
                                        disabled={commentLoading || !commentText.trim()}
                                        className="bg-indigo-600 text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                                    >
                                        {commentLoading ? "Posting..." : "Post Comment"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center mb-12">
                                <p className="text-sm text-gray-500">Please <Link href="/login" className="text-indigo-600 font-bold hover:underline">login</Link> to join the discussion.</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {article.comments?.slice().reverse().map((comment: any) => (
                                <div key={comment.id} className="bg-white border border-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                                                {comment.userName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{comment.userName}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">{formatDate(comment.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed pl-11">{comment.text}</p>
                                </div>
                            ))}
                            {(!article.comments || article.comments.length === 0) && (
                                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="w-full h-px bg-gray-100 mt-16 mb-10" />

                    <div className="flex items-center justify-between">
                        <Link href="/articles" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Library
                        </Link>
                        <Link href="/dashboard/write" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-2 group">
                            Write your own <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </Link>
                    </div>
                </article>

                <aside className="hidden lg:block w-72 flex-shrink-0">
                    <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                        <TableOfContents content={article.content} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
