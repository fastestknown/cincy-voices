import { MetadataRoute } from 'next';
import { getAllLeaderSlugs, getAllTopicSlugs } from '@/lib/queries';
import { SITE } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [leaderSlugs, topicSlugs] = await Promise.all([
    getAllLeaderSlugs(),
    getAllTopicSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/leaders`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/topics`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/connect`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const leaderRoutes: MetadataRoute.Sitemap = leaderSlugs.map(slug => ({
    url: `${SITE.url}/leaders/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const topicRoutes: MetadataRoute.Sitemap = topicSlugs.map(slug => ({
    url: `${SITE.url}/topics/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...leaderRoutes, ...topicRoutes];
}
