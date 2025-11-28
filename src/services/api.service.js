import { axiosPublic} from '@/api/axios';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

const createSizeService = (axiosPublic) => ({
    getAll: async () => {
        return await axiosPublic.get('/sizes/');
    },
})

const createColorService = (axiosPublic) => ({
    getAll: async () => {
        return await axiosPublic.get('/colors/');
    },
})

const createTagService = (axiosPublic) => ({
    getAll: async () => {
        return await axiosPublic.get('/tags/');
    },
})

const createCategoryService = (axiosPublic) => ({
    getAll: async () => {
        return await axiosPublic.get('/categories/');
    },
})

const createProductService = (axiosPublic) => ({
    getAll: async (filter)=>{
        return await axiosPublic.get('/products/'+'?status=published&'+filter);
    },
    get: async (id) => {
        return await axiosPublic.get('/products/'+id);
    },
})

const createOrderService = (axiosPrivate, axiosPublic) => ({
    create: async (orderData) => {
        return await axiosPublic.post('/orders/', orderData);
    }
})

const createCustomerService = (axiosPublic,axiosPrivate) => ({
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
        size: createSizeService(axiosPublic),
        color: createColorService(axiosPublic),
        tag: createTagService(axiosPublic),
        category: createCategoryService(axiosPublic),
        auth: createCustomerService(axiosPublic,axiosPrivate),
        product: createProductService(axiosPublic),
        order: createOrderService(axiosPrivate, axiosPublic),
    };
};
