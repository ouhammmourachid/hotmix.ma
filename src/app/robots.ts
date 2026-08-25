import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/cart',
        '/checkout',
        '/account',
        '/account/',
        '/login',
        '/sign-up',
        '/wishlist',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
