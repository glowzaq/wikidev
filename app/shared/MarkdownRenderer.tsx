'use client'

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkdownRenderer({ content }: { content: string }) {
    return (
        <div className="prose-custom text-gray-700 text-base leading-relaxed max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="rounded-lg overflow-hidden my-6 shadow-md">
                                <div className="bg-gray-800 text-gray-400 text-[10px] uppercase font-bold px-4 py-1.5 flex items-center justify-between border-b border-gray-700">
                                    <span>{match[1]}</span>
                                    <span className="opacity-50">Code Block</span>
                                </div>
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                        margin: 0,
                                        padding: '1.5rem',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.6',
                                        background: '#1e1e1e'
                                    }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono text-[0.9em]" {...props}>
                                {children}
                            </code>
                        );
                    },
                    h1: ({ id, children }) => <h1 id={id} className="font-display font-bold text-3xl text-gray-900 mt-10 mb-4 scroll-mt-24">{children}</h1>,
                    h2: ({ id, children }) => <h2 id={id} className="font-display font-bold text-2xl text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2 scroll-mt-24">{children}</h2>,
                    h3: ({ id, children }) => <h3 id={id} className="font-display font-bold text-xl text-gray-900 mt-6 mb-3 scroll-mt-24">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 leading-8">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 px-6 py-4 rounded-r-lg italic my-6">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} className="text-indigo-600 font-semibold hover:underline decoration-2 underline-offset-4" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
