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
import { extractHeadings } from "@/lib/extractHeadings";

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
            console.error("Error submitting comment:", err);
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

    const headings = extractHeadings(article.content);

    const shouldShowTOC =
        article.content.length > 1200 &&
        headings.length >= 2;

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <Link href="/articles" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    &larr; <span className="hidden sm:inline">All Articles</span>
                </Link>
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    Dashboard
                </Link>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row gap-10 lg:gap-16">
                <article className="flex-1 min-w-0">
                    <div className="mb-8">
                        {/* Category + read time */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600">
                                {article.category}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{getReadTime(article.content)}</span>
                        </div>

                        {/* Title */}
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-gray-900 leading-tight mb-6">
                            {article.title}
                        </h1>

                        {/* Author */}
                        <Link href={`/profile/${article.authorId}`} className="flex items-center gap-3 group">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm font-bold uppercase bg-indigo-600 shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform flex-shrink-0">
                                {article.author?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {article.author}
                                </p>
                                <p className="text-xs text-gray-400 font-medium">{formatDate(article.createdAt)}</p>
                            </div>
                        </Link>

                        {/* Action buttons */}
                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            {user && (
                                <>
                                    <button
                                        onClick={handleBookmark}
                                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${isBookmarked
                                                ? "bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
                                            }`}
                                    >
                                        {isBookmarked ? "✓ Saved" : "Bookmark"}
                                    </button>

                                    <button
                                        onClick={handleLike}
                                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${isLiked
                                                ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                                                : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 shadow-sm"
                                            }`}
                                    >
                                        {isLiked ? "❤️" : "🤍"} {article.likes?.length || 0}
                                    </button>
                                </>
                            )}

                            {isAuthor && (
                                <>
                                    <Link
                                        href={`/dashboard/edit/${articleId}`}
                                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gray-50 text-gray-700 border border-gray-100 hover:bg-white hover:border-indigo-400 transition-all"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all disabled:opacity-50"
                                    >
                                        {deleteLoading ? "Deleting..." : "Delete"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-100 mb-8 sm:mb-10" />

                    {/* Markdown content */}
                    <div className="prose prose-sm sm:prose-base prose-gray max-w-none
                prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900
                prose-h1:text-2xl prose-h1:sm:text-3xl
                prose-h2:text-xl prose-h2:sm:text-2xl
                prose-h3:text-lg prose-h3:sm:text-xl
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-950 prose-pre:rounded-2xl prose-pre:overflow-x-auto prose-pre:text-xs sm:prose-pre:text-sm
                prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
                prose-img:rounded-2xl prose-img:w-full
                prose-ul:text-gray-600 prose-ol:text-gray-600
                prose-li:my-1
                prose-table:text-sm prose-table:overflow-x-auto
                [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full
                [&_pre]:!px-4 [&_pre]:sm:!px-6">
                        <MarkdownRenderer content={article.content} />
                    </div>

                    <div className="w-full h-px bg-gray-100 mt-12 sm:mt-16 mb-8 sm:mb-10" />

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <section className="mb-12 sm:mb-16">
                            <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
                                <h3 className="font-display font-bold text-xl sm:text-2xl text-gray-900">Related Articles</h3>
                                <Link
                                    href={`/articles?category=${encodeURIComponent(article.category)}`}
                                    className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors whitespace-nowrap flex-shrink-0"
                                >
                                    View all &rarr;
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {relatedArticles.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/articles/${rel.id}`}
                                        className="group bg-gray-50/50 rounded-2xl p-5 sm:p-6 border border-gray-100 hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white text-indigo-600 border border-gray-100 mb-3 inline-block">
                                            {rel.category}
                                        </span>
                                        <h4 className="font-display font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2 text-sm sm:text-base">
                                            {rel.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 font-medium">By {rel.author}</p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Discussion */}
                    <section className="mt-12 sm:mt-16">
                        <h3 className="font-display font-bold text-xl sm:text-2xl text-gray-900 mb-6 sm:mb-8">Discussion</h3>

                        {user ? (
                            <form onSubmit={handleCommentSubmit} className="mb-10 sm:mb-12">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="What are your thoughts?"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm resize-none"
                                    rows={4}
                                />
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="submit"
                                        disabled={commentLoading || !commentText.trim()}
                                        className="bg-indigo-600 text-white text-sm font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                                    >
                                        {commentLoading ? "Posting..." : "Post Comment"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8 text-center mb-10 sm:mb-12">
                                <p className="text-sm text-gray-500">
                                    Please{" "}
                                    <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                                        login
                                    </Link>{" "}
                                    to join the discussion.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4 sm:space-y-6">
                            {article.comments?.slice().reverse().map((comment: any) => (
                                <div
                                    key={comment.id}
                                    className="bg-white border border-gray-50 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase flex-shrink-0">
                                                {comment.userName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 truncate">{comment.userName}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap flex-shrink-0">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed pl-9 sm:pl-11">{comment.text}</p>
                                </div>
                            ))}
                            {(!article.comments || article.comments.length === 0) && (
                                <div className="text-center py-12 sm:py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="w-full h-px bg-gray-100 mt-12 sm:mt-16 mb-8 sm:mb-10" />

                    <div className="flex items-center justify-between gap-4">
                        <Link
                            href="/articles"
                            className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 group"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                            <span className="hidden sm:inline">Back to Library</span>
                            <span className="sm:hidden">Library</span>
                        </Link>
                        <Link
                            href="/dashboard/write"
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1.5 group"
                        >
                            <span className="hidden sm:inline">Write your own</span>
                            <span className="sm:hidden">Write</span>
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </Link>
                    </div>
                </article>

                {/* Sidebar TOC */}
                {shouldShowTOC && (
                    <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6 xl:p-8 shadow-sm">
                            <TableOfContents content={article.content} />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
