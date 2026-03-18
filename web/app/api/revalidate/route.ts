import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Map Sanity document types to Next.js paths
const TYPE_TO_PATH_MAP: Record<string, string> = {
  home: '/',
  servicesPage: '/engineering-services',
  about: '/about',
  contact: '/contact',
  // service type handled separately (has dynamic slug)
  // siteSettings handled separately (affects all pages)
};

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secret = request.headers.get('x-sanity-webhook-secret');
    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid or missing webhook secret' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const documentType = body._type;
    const slug = body.slug;

    console.log('[Webhook] Received revalidation request:', {
      type: documentType,
      slug,
    });

    const revalidatedPaths: string[] = [];

    // Handle siteSettings (affects all pages via layout)
    if (documentType === 'siteSettings') {
      console.log('[Webhook] Revalidating layout (siteSettings changed)');
      revalidatePath('/', 'layout');
      revalidatedPaths.push('layout');
    }
    // Handle individual service pages (dynamic slug)
    else if (documentType === 'service' && slug) {
      const servicePath = `/engineering-services/${slug}`;
      console.log('[Webhook] Revalidating service page:', servicePath);
      revalidatePath(servicePath);
      revalidatedPaths.push(servicePath);
      
      // Also revalidate services list page
      console.log('[Webhook] Revalidating services list page');
      revalidatePath('/engineering-services');
      revalidatedPaths.push('/engineering-services');
    }
    // Handle static pages using the map
    else if (TYPE_TO_PATH_MAP[documentType]) {
      const path = TYPE_TO_PATH_MAP[documentType];
      console.log('[Webhook] Revalidating page:', path);
      revalidatePath(path);
      revalidatedPaths.push(path);
    } else {
      console.log('[Webhook] Unknown document type:', documentType);
      return NextResponse.json(
        { error: 'Unknown document type', type: documentType },
        { status: 400 }
      );
    }

    // Cache warming: fetch the pages to warm the cache
    // Fire and forget - don't wait for response
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    revalidatedPaths.forEach((path) => {
      if (path !== 'layout') {
        const warmUrl = `${baseUrl}${path}`;
        console.log('[Webhook] Warming cache:', warmUrl);
        fetch(warmUrl, {
          headers: { 'User-Agent': 'Sanity-Webhook-Cache-Warmer' },
          cache: 'no-store',
        }).catch((err) =>
          console.error('[Webhook] Cache warming failed:', err.message)
        );
      }
    });

    return NextResponse.json(
      {
        revalidated: true,
        paths: revalidatedPaths,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Error processing webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
