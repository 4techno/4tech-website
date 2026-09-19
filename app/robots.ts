import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/', disallow: ['/account'] }, sitemap: siteUrl('/sitemap.xml') }; }
export const dynamic = 'force-static';
