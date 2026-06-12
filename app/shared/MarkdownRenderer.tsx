'use client'

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkdownRenderer({ content }: { content: string }) {
    return (
        <div className="text-gray-700 text-base leading-relaxed max-w-full w-full min-w-0 overflow-x-hidden">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={{
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isBlock = !!match;

                        return isBlock ? (
                            <div className="my-4 sm:my-6 w-full max-w-full min-w-0 rounded-lg shadow-md overflow-hidden">
                                <div className="bg-gray-800 text-gray-400 text-[10px] uppercase font-bold px-4 py-1.5 flex items-center justify-between border-b border-gray-700">
                                    <span>{match[1]}</span>
                                    <span className="opacity-50">Code Block</span>
                                </div>

                                <div className="w-full max-w-full min-w-0 overflow-x-auto">
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                            margin: 0,
                                            padding: '1rem',
                                            fontSize: '0.75rem',
                                            lineHeight: '1.6',
                                            background: '#1e1e1e',
                                            width: '100%',
                                            maxWidth: '100%',
                                            overflowX: 'auto',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}
                                        codeTagProps={{
                                            style: {
                                                fontSize: '0.75rem',
                                                fontFamily: 'ui-monospace, monospace',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word',
                                            },
                                        }}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        ) : (
                            <code
                                className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono text-[0.75em] break-all"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    h1: ({ id, children }) => (
                        <h1 id={id} className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mt-8 sm:mt-10 mb-4 scroll-mt-24 break-words">
                            {children}
                        </h1>
                    ),
                    h2: ({ id, children }) => (
                        <h2 id={id} className="font-display font-bold text-xl sm:text-2xl text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 border-b border-gray-100 pb-2 scroll-mt-24 break-words">
                            {children}
                        </h2>
                    ),
                    h3: ({ id, children }) => (
                        <h3 id={id} className="font-display font-bold text-lg sm:text-xl text-gray-900 mt-5 sm:mt-6 mb-2 sm:mb-3 scroll-mt-24 break-words">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="mb-4 leading-7 sm:leading-8 break-words">
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc pl-5 sm:pl-6 mb-4 space-y-1.5 sm:space-y-2">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal pl-5 sm:pl-6 mb-4 space-y-1.5 sm:space-y-2">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-gray-700 leading-7 break-words">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 px-4 sm:px-6 py-3 sm:py-4 rounded-r-lg italic my-4 sm:my-6">
                            {children}
                        </blockquote>
                    ),
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            className="text-indigo-600 font-semibold hover:underline decoration-2 underline-offset-4 break-all"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-4 sm:my-6 rounded-lg border border-gray-100 w-full">
                            <table className="min-w-full text-sm">
                                {children}
                            </table>
                        </div>
                    ),
            th: ({ children }) => (
                <th className="bg-gray-50 px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">
                    {children}
                </th>
            ),
                td: ({ children }) => (
                    <td className="px-4 py-2.5 text-sm text-gray-600 border-b border-gray-100 break-words">
                        {children}
                    </td>
                ),
                    img: ({ src, alt }) => (
                        <img
                            src={src}
                            alt={alt ?? ''}
                            className="rounded-xl w-full object-cover my-4 sm:my-6"
                        />
                    ),
                }}
            >
    { content }
            </ReactMarkdown >
        </div >
    );
}