import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

/** Set FORCE_HTTPS_REDIRECT=1 on self-hosted production behind a reverse proxy that sets x-forwarded-proto. */
export function middleware(request: NextRequest) {
  if (process.env.FORCE_HTTPS_REDIRECT === "1") {
    const proto = request.headers.get("x-forwarded-proto")
    if (proto === "http") {
      const url = request.nextUrl.clone()
      url.protocol = "https:"
      return NextResponse.redirect(url, 308)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
