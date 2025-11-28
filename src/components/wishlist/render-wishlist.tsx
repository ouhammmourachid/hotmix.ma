import { useState, useEffect } from 'react';
import emptyWishList from "@/components/wishlist/empty-wishlist";
import { useWishlist } from "@/contexts/wishlist-context";
import { Grid } from "@/components/small-pieces";
import Product from "@/types/product";
import HorizontalProductCard from '@/components/product/card/horizontal-product-card';
import ProductCard from '@/components/product/card/product-card';
import { useGrid } from "@/contexts/grid-context";
import styles from '@/styles/wishlist.module.css';
import { useApiService } from '@/services/api.service';
import { useTranslation } from '@/lib/i18n-utils';

function WishListItem({ item, grid }:{item:Product, grid:number}){
    return grid === 1 ? (
        <HorizontalProductCard product={item}/>
    ) : (
        <ProductCard product={item}/>
    );
}

export default function RenderWishList(){
    const { t } = useTranslation();
    const { wishListItems } = useWishlist();
    const { gridSize } = useGrid();
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const api = useApiService();

    useEffect(() => {
        // Only fetch if there are items in the wishlist
        if (wishListItems.length > 0) {
            setLoading(true);
            setError(null);

            // Since your backend uses Django REST Framework's ModelViewSet,
            // we can fetch multiple products by their IDs
            // The API likely supports a filter by ids approach

            const fetchProducts = async () => {
                try {
                    // Create an array of promises to fetch each product by ID
                    const productPromises = wishListItems.map(id =>
                        api.product.get(id).then(response => response.data)
                    );

                    // Wait for all requests to complete
                    const products = await Promise.all(productPromises);
                    setWishlistProducts(products);
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching wishlist products:', err);
                    setError('Failed to load wishlist products. Please try again later.');
                    setLoading(false);
                }
            };

            fetchProducts();
        } else {
            setWishlistProducts([]);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setWishlistProducts(wishlistProducts.filter(product => wishListItems.includes(product.id)));
    }
    , [wishListItems]);

    if (loading) {
        return <div className="text-center py-12">{t('wishlist_loading')}</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">{t('wishlist_error')}</div>;
    }

    return (
        <div>
            <div className={styles.wishlist_header}>
                <h1 className="text-4xl font-bold text-center">Your wishlist</h1>
            </div>
            <div className="flex justify-between items-center py-12 w-full text-white">
                <Grid />
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gap: '2rem',
                    justifyContent: 'center'
                }}
                className={`gap-8 items-center justify-center w-full px-4`}>
                {wishlistProducts.map((product) => (
                    <WishListItem item={product} key={product.id} grid={gridSize}/>
                ))}
            </div>
        </div>
    );
}
