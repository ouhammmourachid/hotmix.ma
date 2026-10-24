"use client";
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { ThreeButtons, Size, QuantityChanger } from '@/components/small-pieces';
import ProductDetails from '@/components/product/product-details';
import RecommendedProducts from '@/components/product/recommended-products';
import StickyProductFooter from '@/components/product/sticky-product-footer';
import { useCart } from '@/contexts/cart-context';
import SizeType from '@/types/size';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { useApiService } from '@/services/api.service';
import Product from '@/types/product';
import { formatPrice, isLightColor } from '@/lib/utils';
import { Discount } from '@/components/ui/discount';
import { useTranslation } from '@/lib/i18n-utils';
import { useCartModal } from '@/contexts/cart-modal-context';
import filterStyles from '@/styles/filter.module.css';
import Color from '@/types/color';
import { useRecentlyViewed } from '@/contexts/recently-viewed-context';
import RecentlyViewedProducts from '@/components/product/recently-viewed-products';

import ProductImageLightbox from '@/components/product/product-image-lightbox';
import ProductGallery from '@/components/product/product-gallery';
import { Maximize2 } from 'lucide-react';

// Returns the index of the image that best matches the given color, or -1 if none
function findColorImageIndex(product: Product, color: Color): number {
  if (!product.images || product.images.length === 0) return -1;

  // 1. Try to find image matching color ID, color name, or path keyword
  const matchedIndex = product.images.findIndex((img: any) => {
    if (img.color_id && String(img.color_id) === String(color.id)) return true;
    if (img.color && (String(img.color) === String(color.id) || String(img.color).toLowerCase() === color.name.toLowerCase())) return true;
    if (img.path) {
      const lowerPath = img.path.toLowerCase();
      if (color.name && lowerPath.includes(color.name.toLowerCase())) return true;
      if (color.id && lowerPath.includes(color.id.toLowerCase())) return true;
    }
    return false;
  });
  if (matchedIndex !== -1) return matchedIndex;

  // 2. Fallback to matching image by color index position in colors array
  const colorIndex = product.colors?.findIndex(c => c.id === color.id) ?? -1;
  return colorIndex < product.images.length ? colorIndex : -1;
}

export default function ProductPageClient({ params, initialProduct }: {
  params: Promise<{ id: string }>;
  // Rendered on the server so the product and its main image show without waiting for a client fetch
  initialProduct?: Product | null;
}) {
  // Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  // Initialize translation hook
  const { t } = useTranslation();
  const { openCart } = useCartModal();

  const [product, setProduct] = useState<Product | null>(initialProduct ?? null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { addToCart, totalItems } = useCart();
  const api = useApiService();
  const [selectedSize, setSelectedSize] = useState<SizeType | undefined>(initialProduct?.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(initialProduct?.colors?.[0]);
  const [price, setPrice] = useState<number>(initialProduct ? (initialProduct.sale_price || initialProduct.price) : 0);
  const { addToRecentlyViewed } = useRecentlyViewed();
  // Fetch product data from API
  useEffect(() => {
    if (initialProduct && String(initialProduct.id) === productId) {
      addToRecentlyViewed(initialProduct);
      // The URL is only readable after mount, so apply ?color= here instead of during render
      const colorParam = new URLSearchParams(window.location.search).get('color');
      const urlColor = colorParam
        ? initialProduct.colors?.find((c: Color) => String(c.id) === colorParam)
        : undefined;
      if (urlColor) {
        setSelectedColor(urlColor);
        const imageIndex = findColorImageIndex(initialProduct, urlColor);
        if (imageIndex !== -1) setCurrentImageIndex(imageIndex);
      }
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.product.get(productId);
        if (response.data) {
          setProduct(response.data);
          addToRecentlyViewed(response.data);
          setPrice(response.data.sale_price ? response.data.sale_price : response.data.price);

          // Initialize selected size with the first available size
          if (response.data.sizes && response.data.sizes.length > 0) {
            setSelectedSize(response.data.sizes[0]);
          }
          if (response.data.colors && response.data.colors.length > 0) {
            // Preselect the color given in the URL (?color=<colorId>), falling back to the first one
            const colorParam = new URLSearchParams(window.location.search).get('color');
            const urlColor = colorParam
              ? response.data.colors.find((c: Color) => String(c.id) === colorParam)
              : undefined;
            const initialColor = urlColor ?? response.data.colors[0];
            setSelectedColor(initialColor);
            if (urlColor) {
              const imageIndex = findColorImageIndex(response.data, urlColor);
              if (imageIndex !== -1) setCurrentImageIndex(imageIndex);
            }
          }

          setError(null);
        } else {
          setProduct(null);
        }
      } catch (err) {
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

  const handleColorSelect = (color: Color) => {
    if (isArchived) return;
    setSelectedColor(color);

    // Keep the selected color in the URL so the link can be shared
    const url = new URL(window.location.href);
    url.searchParams.set('color', color.id);
    window.history.replaceState(window.history.state, '', url);

    if (product) {
      const imageIndex = findColorImageIndex(product, color);
      if (imageIndex !== -1) setCurrentImageIndex(imageIndex);
    }
  };

  const handleClickAddToCart = () => {
    if (product && selectedSize) {
      addToCart({
        id: totalItems,
        product: product,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        price: price
      });
      setQuantity(1);
      openCart();
    }
  };

  // Show loading state — skeleton that matches page layout to prevent CLS
  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row w-full mx-auto lg:px-12 p-4 gap-8 lg:gap-10 min-h-screen animate-pulse max-w-[1450px]">
        {/* Image gallery skeleton */}
        <div className="flex gap-4 lg:w-[55%] ml-0 flex-col-reverse md:flex-row">
          {/* Thumbnails */}
          <div className="flex flex-row md:flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-20 rounded-lg bg-gray-700" style={{ aspectRatio: '1000/1500' }} />
            ))}
          </div>
          {/* Main image */}
          <div className="relative w-full rounded-lg bg-gray-700" style={{ aspectRatio: '1000/1500' }} />
        </div>
        {/* Product info skeleton */}
        <div className="lg:w-[45%] space-y-6">
          <div className="h-8 bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-700 rounded w-1/4" />
          <div className="h-10 bg-gray-700 rounded w-1/3" />
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => <div key={i} className="w-8 h-8 rounded-full bg-gray-700" />)}
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => <div key={i} className="w-12 h-10 bg-gray-700 rounded" />)}
          </div>
          <div className="h-14 bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  // Show error / 404 state
  if (error || !product) {
    notFound();
  }  // Prepare meta description from product description


  const isArchived = product.status === "archived" || Boolean((product as any).is_archived) || Boolean((product as any).isArchived);

  return (
    <div>
      <div className="product">
        {/* Left side - Image gallery */}
        <ProductGallery
          images={product.images}
          alt={product.name}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
          onOpenLightbox={() => setIsLightboxOpen(true)}
        />

        {/* Right side - Product info with sticky positioning */}
        <div className="lg:sticky lg:top-4 lg:w-[45%] w-full h-fit">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{product.name}</h1>
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
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">
                      {t('color')}: {selectedColor?.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map(color => (
                      <div
                        key={color.id}
                        onClick={() => handleColorSelect(color)}
                        className={`relative w-8 h-8 ${isArchived ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        title={color.name}
                      >
                        <div className={`${filterStyles.filter_color_ring} ${selectedColor?.id === color.id ? 'border-2' : ''}`} />
                        <div
                          style={{ backgroundColor: color.code }}
                          className={`${filterStyles.filter_color_circle} relative overflow-hidden`}
                        >
                          {selectedColor?.id === color.id && !isArchived && (
                            <Check size={15} className={isLightColor(color) ? "text-black" : "text-white"} />
                          )}
                          {isArchived && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-[120%] h-[1.5px] bg-white/90 rotate-45 shadow-sm" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    isArchived={isArchived}
                    onClick={() => setSelectedSize(size)}
                  />
                ))}
              </div>
            </div>
            <QuantityChanger quantity={quantity} setQuantity={setQuantity} withLabel className={isArchived ? "opacity-50 pointer-events-none" : ""} />
            <ThreeButtons
              quantity={quantity}
              productId={product.id}
              price={price * quantity}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              isArchived={isArchived}
              className="w-full"
              onClickAddToCart={handleClickAddToCart}
              onCartOpen={openCart} />
          </div>
        </div>
      </div>
      <ProductDetails product={product} />
      <RecommendedProducts currentProductId={product.id} />
      <RecentlyViewedProducts currentProductId={product.id} />
      <StickyProductFooter
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
        onClickAddToCart={handleClickAddToCart}
        onCartOpen={openCart}
      />
      <ProductImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={product.images}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
}
