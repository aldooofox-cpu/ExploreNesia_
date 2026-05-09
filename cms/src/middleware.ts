import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PREFIXES = ['/admin'];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdmin = ADMIN_PREFIXES.some((p) => path.startsWith(p));
  if (!isAdmin) return NextResponse.next();

  const loggedIn = req.cookies.get('cms_logged_in')?.value === '1';
  if (!loggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    // tidak perlu redirect query next supaya login bisa langsung terlihat
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

