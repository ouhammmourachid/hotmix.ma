import { axiosPublic } from '@/api/axios';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import pb from '@/lib/pocketbase';
import { convertToPocketBaseFilter } from '@/lib/utils';

const mapRecord = (record) => {
    const data = { ...record };
    if (record.expand) {
        Object.keys(record.expand).forEach(key => {
            data[key] = record.expand[key];
        });
    }
    return data;
};

const mapProduct = (record) => {
    const data = mapRecord(record);

    // Map fields to match frontend expectations
    data.sale_price = data.salePrice;
    data.created_at = data.created;
    data.updated_at = data.updated;

    // Handle images - using direct S3 links
    if (data.images && Array.isArray(data.images)) {
        data.images = data.images.map((filename, index) => ({
            id: index,
            path: `https://hotmix-files.s3.eu-north-1.amazonaws.com/${record.collectionId}/${record.id}/${filename}`
        }));
    } else {
        data.images = [];
    }

    // Handle discount (ensure it's a string if needed, or keep as number if frontend handles it)
    // Based on types/product.ts, discount is string | undefined.
    if (data.discount !== undefined && data.discount !== null) {
        data.discount = String(data.discount);
    }

    return data;
};

const createSizeService = () => ({
    getAll: async () => {
        const records = await pb.collection('sizes').getFullList({ requestKey: null });
        return { data: records.map(mapRecord) };
    },
})

const createColorService = () => ({
    getAll: async () => {
        const records = await pb.collection('colors').getFullList({ requestKey: null });
        return { data: records.map(mapRecord) };
    },
})

const createTagService = () => ({
    getAll: async () => {
        const records = await pb.collection('tags').getFullList({ requestKey: null });
        return { data: records.map(mapRecord) };
    },
})

const createCategoryService = () => ({
    getAll: async () => {
        const records = await pb.collection('categories').getFullList({ requestKey: null });
        return { data: records.map(mapRecord) };
    },
})

const createProductService = () => ({
    getAll: async (filterStr) => {
        const params = new URLSearchParams(filterStr);
        const page = parseInt(params.get('page') || '1');
        let filter = convertToPocketBaseFilter(filterStr);

        const statusFilter = "status='published'";
        filter = filter ? `${statusFilter} && (${filter})` : statusFilter;

        const result = await pb.collection('products').getList(page, 30, {
            filter,
            expand: 'category,sizes,colors,tags', // Removed images from expand
            sort: '-created', // Changed from -created_at
            requestKey: null
        });

        return {
            data: {
                results: result.items.map(mapProduct),
                count: result.totalItems,
                next: result.page < result.totalPages ? 'next' : null
            }
        };
    },
    get: async (id) => {
        const record = await pb.collection('products').getOne(id, {
            expand: 'category,sizes,colors,tags', // Removed images from expand
            requestKey: null
        });
        return { data: mapProduct(record) };
    },
})

const createOrderService = (axiosPrivate, axiosPublic) => ({
    create: async (orderData) => {
        return await pb.send('/api/orders/create-full', {
            method: 'POST',
            body: orderData
        });
    }
})

const createCustomerService = (axiosPublic, axiosPrivate) => ({
    signUp: async (data) => {
        return await axiosPublic.post('/users/', data);
    },
    info: async () => {
        return await axiosPrivate.get('/users/info/');
    },
})

export const useApiService = () => {
    const axiosPrivate = useAxiosPrivate();
    return {
        size: createSizeService(),
        color: createColorService(),
        tag: createTagService(),
        category: createCategoryService(),
        auth: createCustomerService(axiosPublic, axiosPrivate),
        product: createProductService(),
        order: createOrderService(axiosPrivate, axiosPublic),
    };
};
