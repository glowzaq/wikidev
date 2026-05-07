'use client'

import { ArticleData, User } from "@/app/shared/type";
import { UPDATE_ARTICLE } from "@/lib/graphql/mutations/article.mutations";
import { GET_ARTICLE, GET_ARTICLES } from "@/lib/graphql/queries/article.queries";
import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MarkdownRenderer from "@/app/shared/MarkdownRenderer";

const CATEGORIES = ["Frontend", "Backend", "DevOps", "Database", "Security"];

export default function EditArticleClient({ articleId, user }: { articleId: string, user: User }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isPreview, setIsPreview] = useState(false);

    const { data: articleData, loading: articleLoading, error: articleQueryError } = useQuery<ArticleData>(GET_ARTICLE, {
        variables: { id: articleId },
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (articleData?.article) {
            const { article } = articleData;
            setTitle(article.title);
            setContent(article.content);
            setCategory(article.category);
            
            // Authorization check
            const authorName = `${user.firstName} ${user.lastName}`;
            if (article.author !== authorName) {
                setErrorMsg("You do not have permission to edit this article.");
            }
        }
    }, [articleData, user]);

    const [updateArticle, { loading: updateLoading }] = useMutation<ArticleData>(UPDATE_ARTICLE, {
        refetchQueries: [
            { query: GET_ARTICLE, variables: { id: articleId } },
            { query: GET_ARTICLES }
        ],
        onCompleted: () => {
            setSuccessMsg("Article updated successfully!");
            setTimeout(() => router.push(`/articles/${articleId}`), 1500);
        },
        onError: (error) => {
            setErrorMsg(error.message);
        },
    });

    const handleUpdate = () => {
        setErrorMsg("");
        setSuccessMsg("");

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (trimmedTitle.length < 5) {
            setErrorMsg("Title must be at least 5 characters long.");
            return;
        }
        if (trimmedTitle.length > 100) {
            setErrorMsg("Title is too long (max 100 characters).");
            return;
        }
        if (!category) {
            setErrorMsg("Please select a category.");
            return;
        }
        if (trimmedContent.length < 20) {
            setErrorMsg("Content is too short (min 20 characters). Please provide more detail.");
            return;
        }
        if (articleData?.article?.author !== `${user.firstName} ${user.lastName}`) {
            setErrorMsg("You do not have permission to edit this article.");
            return;
        }

        updateArticle({
            variables: {
                id: articleId,
                title: trimmedTitle,
                content: trimmedContent,
                category,
            },
        });
    };

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    if (articleLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading article...</p>
            </div>
        );
    }

    if (articleQueryError || !articleData?.article) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-gray-500">Article not found.</p>
                <Link href="/dashboard" className="text-sm font-semibold text-gray-900 hover:underline">
                    &larr; Back to Dashboard
                </Link>
            </div>
        );
    }

    const isUnauthorized = articleData.article.author !== `${user.firstName} ${user.lastName}`;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/articles/${articleId}`}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
                    >
                        &larr; Cancel
                    </Link>
                    <div className="w-px h-5 bg-gray-200" />
                    <h1 className="font-display font-bold text-lg text-gray-900">Edit Article</h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setIsPreview(false)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!isPreview ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setIsPreview(true)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${isPreview ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Preview
                        </button>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                            {wordCount} words &middot; {readTime} min read
                        </span>
                    </div>
                    <button
                        onClick={handleUpdate}
                        disabled={updateLoading || isUnauthorized}
                        className="text-white text-sm font-semibold px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-70"
                    >
                        {updateLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-10">
                {/* Error message */}
                {errorMsg && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                        {errorMsg}
                    </div>
                )}

                {/* Success message */}
                {successMsg && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-lg px-4 py-3">
                        {successMsg}
                    </div>
                )}

                <div className="space-y-6">
                    {!isPreview ? (
                        <>
                            <div>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Article title"
                                    disabled={isUnauthorized}
                                    className="w-full text-3xl font-display font-bold text-gray-900 placeholder-gray-300 outline-none bg-transparent disabled:opacity-50"
                                />
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={isUnauthorized}
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-all bg-white cursor-pointer disabled:opacity-50 shadow-sm"
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                <span className="text-xs text-gray-400">
                                    Author: <span className="text-gray-600 font-semibold">{articleData.article.author}</span>
                                </span>
                            </div>

                            <div className="w-full h-px bg-gray-200" />

                            <div>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your article content here (Markdown supported)..."
                                    rows={20}
                                    disabled={isUnauthorized}
                                    className="w-full text-base text-gray-700 placeholder-gray-300 outline-none bg-transparent leading-relaxed resize-none disabled:opacity-50 min-h-[500px]"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm min-h-[700px]">
                            <h1 className="font-display font-extrabold text-4xl text-gray-900 mb-6">{title || "Untitled Article"}</h1>
                            <div className="flex items-center gap-2 mb-8">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{category || "Uncategorized"}</span>
                                <span className="text-xs text-gray-400">{readTime} min read</span>
                            </div>
                            <div className="w-full h-px bg-gray-100 mb-8" />
                            {content ? (
                                <MarkdownRenderer content={content} />
                            ) : (
                                <p className="text-gray-400 italic">No content to preview yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
