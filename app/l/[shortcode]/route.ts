import { getLinkBySlug } from '@/data/links';
import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> },
) {
  const { shortcode } = await params;
  const link = await getLinkBySlug(shortcode);

  if (!link) {
    return new Response(null, { status: 404 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(link.url);
  } catch {
    return new Response(null, { status: 400 });
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return new Response(null, { status: 400 });
  }

  return Response.redirect(link.url, 301);
}
