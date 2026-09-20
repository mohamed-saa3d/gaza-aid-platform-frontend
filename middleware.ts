import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const adminRefresh = request.cookies.get("adminRefreshToken")?.value
  const userRefresh = request.cookies.get("userRefreshToken")?.value
  const adminRole = request.cookies.get("adminRole")?.value
  const userRole = request.cookies.get("userRole")?.value

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    const hasAnyRefresh = Boolean(adminRefresh || userRefresh)

    if (!hasAnyRefresh) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (pathname.startsWith("/admin/admins")) {
      const effectiveAdminRole = adminRole || userRole
      if (effectiveAdminRole && effectiveAdminRole !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin/content", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
