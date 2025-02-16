import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    console.log("Middleware triggered for:", req.nextUrl.pathname);

    const originalUrl = req.nextUrl.pathname + req.nextUrl.search; // Preserve full URL

    if (req.cookies.get("isLogined")?.value && req.nextUrl.pathname.startsWith("/dashboard")) {
        console.log("User is logged in, allowing access.");
        return NextResponse.next();
    } else if (req.cookies.get("isTailoredLogin")?.value && req.nextUrl.pathname.startsWith("/tailor")) {
        console.log("User is logged in, allowing access.");
        return NextResponse.next();
    } else if (req.cookies.get("isLogined")?.value && req.nextUrl.pathname.startsWith("/system")) {
        console.log("User is logged in, allowing access.");
        return NextResponse.next();
    }  

    console.log("User is not logged in, redirecting to /callback");

    return NextResponse.redirect(new URL(`/callback?url=${encodeURIComponent(originalUrl)}`, req.url));
}


// Apply middleware to protected routes
export const config = {
    matcher: ["/admin", "/dashboard/:path*", "/tailor/:path*", "/system/:path*"] // Add your protected routes
};
