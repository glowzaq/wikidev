import React from 'react'
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import ContributionsClient from './ContributionsClient';

export default async function ContributionsPage() {
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
        };
        return <ContributionsClient user={user} />;
    } catch {
        cookieStorage.delete('token');
        redirect('/login');
    }
}
