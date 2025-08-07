import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("accessToken")?.value;
    const secret = process.env.JWT_SECRET!

    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(secret),
                { algorithms: ['HS512'] }
            );

            if (payload.scope !== "ROLE_ADMIN") {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            }
            return NextResponse.next();
        } catch (err: any) {
            console.error("JWT Verification failed:", err.message);
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};