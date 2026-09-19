import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config';
import { projects } from '@/lib/projects';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [ { url: siteUrl('/'), changeFrequency: 'monthly', priority: 1 }, { url: siteUrl('/projects'), changeFrequency: 'monthly', priority: .9 }, { url: siteUrl('/portfolio'), changeFrequency: 'monthly', priority: .9 }, { url: siteUrl('/resume'), changeFrequency: 'monthly', priority: .8 }, ...projects.map(p => ({ url: siteUrl(`/projects/${p.id}`), changeFrequency: 'monthly' as const, priority: .7 })), { url: siteUrl('/privacy'), changeFrequency: 'yearly', priority: .2 } ];
}
