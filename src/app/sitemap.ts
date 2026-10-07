import { MetadataRoute } from 'next'
import pb from '@/lib/pocketbase'
import { absoluteUrl } from '@/lib/seo'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let products: any[] = []
    try {
        // Fetch all published products
        // We only need id and updated time for the sitemap
        products = await pb.collection('products').getFullList({
            filter: 'status = "published"',
            fields: 'id,updated',
            requestKey: null
        })
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error)
    }

    const productUrls = products.map((product) => ({
        url: absoluteUrl(`/products/${product.id}`),
        lastModified: new Date(product.updated),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: absoluteUrl('/'),
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: absoluteUrl('/products'),
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: absoluteUrl('/collections'),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: absoluteUrl('/sale'),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...productUrls,
    ]
}
