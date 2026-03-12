import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');
  
  // Legacy contact.php redirect
  if (url.pathname === '/contact.php') {
    url.pathname = '/contact';
    return NextResponse.redirect(url, 301);
  }
  
  // Force HTTPS
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }
  
  // Redirect www to non-www
  if (hostname?.startsWith('www.')) {
    url.host = hostname.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
