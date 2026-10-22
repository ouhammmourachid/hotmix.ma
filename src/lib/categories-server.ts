import { cache } from 'react';
import pb from '@/lib/pocketbase';
import { withNetworkRetry } from '@/lib/pocketbase-retry';
import { findCategoryBySlug, createCategorySlug } from '@/lib/utils';

export interface CategorySeoData {
  id: string;
  name: string;
}

export const getCategoryBySlug = cache(async (slug: string): Promise<CategorySeoData | null> => {
  try {
    const categories = await withNetworkRetry(() => pb.collection('available_categories').getFullList<CategorySeoData>({ requestKey: null }));
    const match = findCategoryBySlug(categories, slug);
    return match ? { id: match.id, name: match.name } : null;
  } catch (error) {
    return null;
  }
});

// Used by generateStaticParams: if the backend is unreachable at build time, prerender
// nothing and let ISR render each collection on first request instead of failing the build.
export const getAllCategorySlugs = cache(async (): Promise<string[]> => {
  try {
    const categories = await withNetworkRetry(() => pb.collection('available_categories').getFullList<CategorySeoData>({ requestKey: null }));
    return categories.map((category) => createCategorySlug(category)).filter(Boolean);
  } catch (error) {
    console.warn('getAllCategorySlugs: backend unreachable, skipping prerender', error);
    return [];
  }
});
