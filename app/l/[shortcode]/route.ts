import { getLinkBySlug } from '@/data/links';
import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;
  const link = await getLinkBySlug(shortcode);

  if (!link) {
    return new Response(null, { status: 404 });
  }

  return Response.redirect(link.url, 301);
}
