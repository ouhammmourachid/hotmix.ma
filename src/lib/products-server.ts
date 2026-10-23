import { cache } from 'react';
import pb from '@/lib/pocketbase';
import { withNetworkRetry } from '@/lib/pocketbase-retry';
import { mapProduct } from '@/lib/product-mapper';
import Product from '@/types/product';

export interface ProductSeoData {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  status: 'draft' | 'published' | 'archived';
  imageUrl?: string;
}

// One fetch per request, shared by the SEO metadata and the page render
const getProductRecord = cache(async (id: string) => {
  try {
    return await withNetworkRetry(() => pb.collection('products').getOne(id, {
      expand: 'category,sizes,colors,tags',
      requestKey: null,
    }));
  } catch (error: any) {
    if (error?.status === 404 || error?.status === 400) {
      return null;
    }
    throw error;
  }
});

export const getProductForSeo = cache(async (id: string): Promise<ProductSeoData | null> => {
  const record = await getProductRecord(id);
  if (!record) return null;
  const images: string[] = Array.isArray(record.images) ? record.images : [];
  return {
    id: record.id,
    name: record.name,
    description: record.description ?? '',
    price: record.price,
    sale_price: record.salePrice || undefined,
    status: record.status,
    imageUrl: images.length > 0
      ? `https://hotmix-files.s3.eu-north-1.amazonaws.com/${record.collectionId}/${record.id}/${images[0]}`
      : undefined,
  };
});

// Same shape as the client API's product.get, so the page can render without a client fetch
export const getProductForPage = cache(async (id: string): Promise<Product | null> => {
  const record = await getProductRecord(id);
  if (!record) return null;
  // Round-trip through JSON so only plain data crosses the server/client boundary
  return JSON.parse(JSON.stringify(mapProduct(record)));
});

// Used by generateStaticParams: if the backend is unreachable at build time, prerender
// nothing and let ISR render each product on first request instead of failing the build.
export const getAllPublishedProductIds = cache(async (): Promise<string[]> => {
  try {
    const products = await withNetworkRetry(() => pb.collection('products').getFullList({
      filter: 'status = "published"',
      fields: 'id',
      requestKey: null,
    }));
    return products.map((product) => product.id);
  } catch (error) {
    console.warn('getAllPublishedProductIds: backend unreachable, skipping prerender', error);
    return [];
  }
});
