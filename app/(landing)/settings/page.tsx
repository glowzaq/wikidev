import React from 'react'
import SettingsClient from '@/app/(landing)/settings/SettingsClient';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export default async function SettingsPage() {
    const cookieStorage = await cookies();
    const token = cookieStorage.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const user = {
            id: payload.id as string,
            email: payload.email as string,
            firstName: payload.firstName as string,
            lastName: payload.lastName as string,
            role: payload.role as string,
            bio: payload.bio as string,
        };
        return <SettingsClient user={user} />;
    } catch {
        cookieStorage.delete('token');
        redirect('/login');
    }
}
