import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("accessToken")?.value
    const userRole = request.cookies.get("userRole")?.value

    // 1. Unauthenticated users -> Redirect to /login
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 2. Protect Super Admin route (/admin/admins)
    if (pathname.startsWith("/admin/admins")) {
      if (userRole && userRole !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin/content", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
