import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin_dashboard") || pathname.startsWith("/contributions") || pathname.startsWith("/bookmarks");
    const isAuthPage = pathname === "/login" || pathname === "/register";

    // No token at all — redirect protected routes to login
    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Token exists — verify it
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);

            // Valid token on auth page → send to dashboard
            if (isAuthPage) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch {
            // Token is expired or invalid — clear it and redirect to login
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.set("token", "", { path: "/", maxAge: 0 });
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin_dashboard/:path*", "/contributions/:path*", "/bookmarks/:path*", "/login", "/register"],
};