import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ['en', 'ar'];
const defaultLocale = 'ar';

// ✅ THE FIX: Export the function as 'proxy' to match Next.js expectations
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    const proxyUrl = request.nextUrl.clone();

    proxyUrl.pathname = `/${defaultLocale}${pathname}`;

    return NextResponse.rewrite(proxyUrl);
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ]
}