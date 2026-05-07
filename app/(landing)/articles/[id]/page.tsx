import React from 'react'
import ArticleDetailClient from './ArticleDetailClient';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Metadata } from 'next';
import Article from '@/models/articles.model';
import { connectDB } from '@/utils/connect';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    await connectDB();
    const article = await Article.findById(id);

    if (!article) {
        return {
            title: 'Article Not Found | WikiDev',
        };
    }

    const description = article.content.slice(0, 160).replace(/[#*_~`]/g, '');

    return {
        title: `${article.title} | WikiDev`,
        description,
        openGraph: {
            title: article.title,
            description,
            type: 'article',
            authors: [article.author],
            section: article.category,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description,
        }
    };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const cookieStorage = await cookies()
    const token = cookieStorage.get('token')?.value

    let user = null

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);
            user = {
                id: payload.id as string,
                email: payload.email as string,
                firstName: payload.firstName as string,
                lastName: payload.lastName as string,
                role: payload.role as string
            };
        } catch (error) {
            console.error("Invalid or expired token")
            user = null;
        }
    }

    return <ArticleDetailClient articleId={id} user={user ?? undefined} />
}
