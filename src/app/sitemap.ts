import { MetadataRoute } from 'next'
import pb from '@/lib/pocketbase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.hotmix.ma'

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
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(product.updated),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/collections`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/new-collection`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/sale`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...productUrls,
    ]
}
