"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Rating } from '@/components/small-pieces';
import { ThreeButtons, Size, QuantityChanger } from '@/components/small-pieces';
import ImageMagnifier from '@/components/image-magnifier';
import ProductDetails from '@/components/product/product-details';
import RecommendedProducts from '@/components/product/recommended-products';
import StickyProductFooter from '@/components/product/sticky-product-footer';
import { useCart } from '@/contexts/cart-context';
import SizeType from '@/types/size';
import { motion } from 'framer-motion';
import { use } from 'react';
import { useApiService } from '@/services/api.service';
import Product from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { Discount } from '@/components/ui/discount';
import { useTranslation } from '@/lib/i18n-utils';
import { useCartModal } from '@/contexts/cart-modal-context';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  // Initialize translation hook
  const { t } = useTranslation();
  const { openCart } = useCartModal();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart, totalItems } = useCart();
  const api = useApiService();
  const [selectedSize, setSelectedSize] = useState<SizeType | undefined>(undefined);
  const [price, setPrice] = useState<number>(0);
  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);        // Replace with your actual API endpoint
        const response = await api.product.get(productId);
        setProduct(response.data);
        setPrice(response.data.sale_price ? response.data.sale_price : response.data.price);

        // Update document title and metadata
        const productName = response.data.name;
        document.title = `${productName} | HotMix - Elegant Clothing`;

        // Initialize selected size with the first available size
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle price calculation

  const handleClickAddToCart = () => {
    if (product && selectedSize) {
      addToCart({
        id: totalItems,
        product: product,
        size: selectedSize,
        quantity: quantity,
        price: price
      });
      setQuantity(1);
      openCart();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greny mx-auto"></div>
          <p className="mt-4 text-white">{t('loading_product')}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (<div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 max-w-md bg-red-100 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">{t('error_loading_product')}</h2>
        <p className="text-red-700">{t('product_not_found')}</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          {t('return_to_homepage')}
        </button>
      </div>
    </div>
    );
  }  // Prepare meta description from product description
  const metaDescription = product.description
    ? `${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}`
    : `Explore ${product.name} from HotMix's elegant clothing collection. Minimalist design with exceptional comfort.`;

  // Prepare main image URL for meta tags
  const mainImage = product.images && product.images.length > 0
    ? product.images[0].path
    : '/images/default-product.jpg';

  // Check product availability based on status
  const isAvailable = product.status === "published";

  return (
    <div>
      <div className="product">
        {/* Left side - Image gallery */}
        <div className="flex gap-4 lg:w-1/2 ml-0 flex-col-reverse md:flex-row">
          <div className="flex flex-row md:flex-col gap-2">
            {product.images.map((img, index) => (
              <motion.button
                key={index}
                initial={{
                  rotate: 60,
                  scale: 0.9,
                  opacity: 0
                }}
                animate={{
                  rotate: 0,
                  scale: 1,
                  opacity: 1
                }}
                transition={{
                  duration: 0.3,
                  delay: (index + 1) * 0.4
                }}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-fit rounded-lg overflow-hidden ${currentImageIndex === index ? 'ring-2 ring-greny' : ''
                  }`}
              >
                <img
                  src={img.path}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>

          <div className="relative w-full">
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <ImageMagnifier src={product.images[currentImageIndex].path} />
            </div>
            <button
              onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : prev)}
              className="product_image_skip left-4 top-1/2"
              disabled={currentImageIndex === 0}>
              <ChevronLeft className="text-black" />
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => prev < product.images.length - 1 ? prev + 1 : prev)}
              className="product_image_skip right-4 top-1/2"
              disabled={currentImageIndex === product.images.length - 1}>
              <ChevronRight className="text-black" />
            </button>
          </div>
        </div>

        {/* Right side - Product info with sticky positioning */}
        <div className="lg:sticky lg:top-4 w-full h-fit">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{product.name}</h1>
              <Rating rating={5} withNumber />
            </div>

            <div className="flex items-center gap-4">
              <span className="product_sale_price">
                {formatPrice(product.sale_price ? product.sale_price : product.price)} DH
              </span>
              {product.sale_price && product.sale_price !== product.price && (
                <span
                  className='product_price'>
                  {formatPrice(product.price)} DH
                </span>
              )}
              <Discount
                discount={product.discount}
                withOff
                className="product_discount"
                size='sm'
                variant='default' />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  {t('size')}: {selectedSize?.name}
                </span>
              </div>
              <div className="flex gap-2">
                {product.sizes?.map(size => (
                  <Size
                    key={size.id}
                    size={size}
                    selectedSize={selectedSize}
                    onClick={() => setSelectedSize(size)}
                  />
                ))}
              </div>
            </div>
            <QuantityChanger quantity={quantity} setQuantity={setQuantity} withLabel />
            <ThreeButtons
              quantity={quantity}
              productId={product.id}
              price={price * quantity}
              selectedSize={selectedSize}
              className="w-full"
              onClickAddToCart={handleClickAddToCart}
              onCartOpen={openCart} />
          </div>
        </div>
      </div>
      <ProductDetails product={product} />
      <RecommendedProducts category={product.category?.id} />
      <StickyProductFooter
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
        onClickAddToCart={handleClickAddToCart}
        onCartOpen={openCart}
      />
    </div>
  );
}
