import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config';
import { projects } from '@/lib/projects';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl('/'), changeFrequency: 'weekly', priority: 1.0, lastModified: now },
    { url: siteUrl('/projects'), changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: siteUrl('/works'), changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: siteUrl('/team'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/founder'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/co-founder'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/team/yashwanth-c'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/portfolio'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/portfolio/sabeel-ahamed'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/portfolio/yashwanth-c'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/resume'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/resume/sabeel-ahamed'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/resume/yashwanth-c'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/ideas'), changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: siteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.2, lastModified: now },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map(p => ({
    url: siteUrl(`/projects/${p.id}`),
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: now,
  }));

  return [...coreRoutes, ...projectRoutes];
}
