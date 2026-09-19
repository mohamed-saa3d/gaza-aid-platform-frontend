import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const access = request.cookies.get("accessToken")?.value
  const refresh = request.cookies.get("refreshToken")?.value
  const userRole = request.cookies.get("userRole")?.value

  console.log("Middleware hit, tokens:", {
    pathname,
    access: !!access,
    refresh: !!refresh,
    userRole,
  })

  if (pathname.startsWith("/admin")) {
    if (!refresh) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

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
