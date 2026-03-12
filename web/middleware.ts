import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');
  
  // Legacy PHP page redirects (permanent 301)
  if (url.pathname === '/contact.php') {
    url.pathname = '/contact';
    return NextResponse.redirect(url, 301);
  }
  
  if (url.pathname === '/about-us.php') {
    url.pathname = '/about';
    return NextResponse.redirect(url, 301);
  }
  
  if (url.pathname === '/services.php') {
    url.pathname = '/engineering-services';
    return NextResponse.redirect(url, 301);
  }
  
  // Force HTTPS (permanent 301)
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }
  
  // Redirect www to non-www (permanent 301)
  if (hostname?.startsWith('www.')) {
    url.host = hostname.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
