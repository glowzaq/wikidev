import React from 'react'
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export default async function AdminPage() {
    const cookieStorage = await cookies()
    const token = cookieStorage.get('token')?.value

    if (!token) redirect('/login');

    let user = null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        if (payload.role !== 'admin') {
            redirect('/dashboard');
        }

        user = {
            id: payload.id as string,
            email: payload.email as string,
            firstName: payload.firstName as string,
            lastName: payload.lastName as string,
            role: payload.role as string
        };
    } catch {
        (await cookies()).delete('token');
        redirect('/login');
    }

    return <AdminClient user={user} />
}
