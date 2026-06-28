import { NextRequest, NextResponse } from "next/server";
import { HOMEPAGE, SIGNINPAGE } from "./lib/constants";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;
    if (!token && pathname !== SIGNINPAGE) {
        const loginUrl = new URL(SIGNINPAGE, request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (token && pathname === SIGNINPAGE) {
        const homeUrl = new URL(HOMEPAGE, request.url);
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}

// regex para não aplicar o middleware em rotas internas
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
    ]
}