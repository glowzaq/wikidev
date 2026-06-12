'use client'
import { extractHeadings } from "@/lib/extractHeadings";

interface Heading {
    text: string;
    level: number;
    id: string;
}

export default function TableOfContents({ content }: { content: string }) {
    const headings = extractHeadings(content);

    if (headings.length === 0) return null;

    return (
        <nav className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Table of Contents</h4>
            <ul className="space-y-3">
                {headings.map((heading, index) => (
                    <li 
                        key={index} 
                        style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                        className="group"
                    >
                        <a 
                            href={`#${heading.id}`}
                            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-200"
                        >
                            <span className={`w-1 h-1 rounded-full bg-gray-200 group-hover:bg-indigo-400 transition-colors ${heading.level === 1 ? 'hidden' : ''}`} />
                            <span className={heading.level === 1 ? 'font-bold text-gray-900' : 'font-medium'}>
                                {heading.text}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
