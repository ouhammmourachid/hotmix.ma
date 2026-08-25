import { cache } from 'react';
import pb from '@/lib/pocketbase';
import { findCategoryBySlug, createCategorySlug } from '@/lib/utils';

export interface CategorySeoData {
  id: string;
  name: string;
}

export const getCategoryBySlug = cache(async (slug: string): Promise<CategorySeoData | null> => {
  try {
    const categories = await pb.collection('available_categories').getFullList<CategorySeoData>({ requestKey: null });
    const match = findCategoryBySlug(categories, slug);
    return match ? { id: match.id, name: match.name } : null;
  } catch (error) {
    return null;
  }
});

export const getAllCategorySlugs = cache(async (): Promise<string[]> => {
  const categories = await pb.collection('available_categories').getFullList<CategorySeoData>({ requestKey: null });
  return categories.map((category) => createCategorySlug(category));
});
