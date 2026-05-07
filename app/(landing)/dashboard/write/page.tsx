import React from 'react'
import WriteArticleClient from './WriteArticleClient';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export default async function WriteArticlePage() {
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
    return <WriteArticleClient user={user ?? undefined} />
}
