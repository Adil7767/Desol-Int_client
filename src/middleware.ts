import { type NextRequest, NextResponse } from "next/server";

const hasAuthToken = (request: NextRequest) => {
  const token = request.cookies.get("auth-token")?.value;
  return Boolean(token);
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!hasAuthToken(request) && pathname === "/") {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
