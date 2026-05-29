import React from 'react'
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import ProfileClient from './ProfileClient';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const cookieStorage = await cookies();
    const token = cookieStorage.get('token')?.value;

    // Profile is public — user context is optional
    // But if a token exists and is invalid, clear it silently
    let user = null;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);
            user = {
                id: payload.id as string,
                email: payload.email as string,
                firstName: payload.firstName as string,
                lastName: payload.lastName as string,
                role: payload.role as string,
            };
        } catch {
            // Expired token — clear it so the user appears logged out
            cookieStorage.delete('token');
        }
    }

    return <ProfileClient profileId={id} currentUser={user ?? undefined} />;
}
