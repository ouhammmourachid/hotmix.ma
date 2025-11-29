import { Heart, Eye, Trash2, ShoppingCart } from "lucide-react";
import ProductModal from "@/components/modal/product-modal";
import { useState, useEffect, useRef } from "react";
import QuickAddModal from "@/components/modal/quick-add-modal";
import Link from "next/link";
import Product from "@/types/product";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCartModal } from "@/contexts/cart-modal-context";
import styles from "@/styles/product.module.css";
import { motion } from "framer-motion";
import Size from "@/types/size";
import { formatPrice } from "@/lib/utils";
import { Discount } from "@/components/ui/discount";

// Simple Size component for displaying size options
const SizeComponent = ({ size, className }: { size: Size; className?: string }) => (
  <div className={`px-2 py-1 bg-secondary text-white text-xs rounded ${className || ''}`}>
    {size.name}
  </div>
);

export default function HorizontalProductCard({
  product,
  ref
}: {
  product: Product,
  ref?: any
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomActive, setZoomActive] = useState(false); const [firstTransitionDone, setFirstTransitionDone] = useState(false);
  const { addToWithList, removeFromWithList, isInWithList } = useWishlist();
  const { openCart } = useCartModal();
  const animationConfig = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 } };

  // Transition timing in ms (2000ms = 2 seconds)
  const transitionTime = 2000;
  const zoomDelay = 100; // Delay before changing image after zoom (in ms)
  const imageChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClickHeart = () => {
    if (isInWithList(product.id)) {
      removeFromWithList(product.id);
    } else {
      addToWithList(product.id);
    }
  }

  // Set zoom active on hover for all images
  useEffect(() => {
    if (isHovered) {
      setZoomActive(true);
    } else {
      setZoomActive(false);
    }
  }, [isHovered]);

  useEffect(() => {
    // Only handle image transitions if the product has multiple images and card is hovered
    if (!isHovered || !product.images || product.images.length <= 1) return;

    // First transition happens immediately to index 1
    if (!firstTransitionDone && currentImageIndex === 0) {
      setCurrentImageIndex(1);
      setFirstTransitionDone(true);
      return;
    }

    // Create an interval to cycle through images when hovering
    const intervalId = setInterval(() => {
      const nextIndex = (currentImageIndex === product.images.length - 1) ? 0 : currentImageIndex + 1;

      // Apply zoom to all images (already set by the isHovered effect)
      if (imageChangeTimeoutRef.current) {
        clearTimeout(imageChangeTimeoutRef.current);
      }

      imageChangeTimeoutRef.current = setTimeout(() => {
        setCurrentImageIndex(nextIndex);
      }, zoomDelay);

    }, transitionTime);

    return () => {
      clearInterval(intervalId);
      if (imageChangeTimeoutRef.current) {
        clearTimeout(imageChangeTimeoutRef.current);
      }
    };
  }, [isHovered, product.images, currentImageIndex, transitionTime, firstTransitionDone]);

  // Handle manual image change through indicator dots
  const handleImageChange = (index: number, e: React.MouseEvent) => {
    // Stop event propagation to prevent navigating to product page
    e.stopPropagation();

    if (currentImageIndex !== index) {
      // Clear any existing transition timeouts
      if (imageChangeTimeoutRef.current) {
        clearTimeout(imageChangeTimeoutRef.current);
      }

      // Apply zoom effect first then change the image
      imageChangeTimeoutRef.current = setTimeout(() => {
        setCurrentImageIndex(index);
      }, zoomDelay);
    }
  };

  // Reset to first image when hover ends
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
      setFirstTransitionDone(false);
      if (imageChangeTimeoutRef.current) {
        clearTimeout(imageChangeTimeoutRef.current);
      }
    }
  }, [isHovered]);

  // Current image to display
  const currentImagePath = product.images?.[currentImageIndex]?.path || product.images?.[0]?.path;

  return (
    <motion.div
      {...animationConfig}
      ref={ref}
      className={styles.horizontal_product}>
      <div className="flex flex-row gap-2 md:gap-6">
        {/* Product Image with hover effect */}
        <div className="relative lg:w-1/4 w-1/3">
          {/* Discount Badge using the new Discount component */}
          <Discount
            discount={product.discount}
            absolute
            position="top-right"
            size="sm"
            variant="filled"
          />
          {/* Image Container with zoom effect */}
          <div
            className="overflow-hidden rounded-lg h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Link href={`/products/${product.id}`}>
              <img
                src={currentImagePath}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 ${zoomActive ? 'scale-110' : 'scale-100'}`}
              />
            </Link>

            {/* Image indicator dots for multiple images - moved outside the Link to avoid navigation conflicts */}
            {product.images && product.images.length > 1 && isHovered && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-white scale-110' : 'bg-gray-400/70'}`}
                    onClick={(e) => handleImageChange(index, e)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Product title, price, etc. */}
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className={styles.horizontal_product_header}>
                {product.name}
              </h3>
            </Link>            <div className="flex items-center justify-between mt-1">
              <div className={styles.horizontal_product_prices}>
                {product.sale_price && product.sale_price !== product.price && (
                  <span className={styles.horizontal_product_price}>
                    {formatPrice(product.price)} DH
                  </span>
                )}
                <span className={styles.horizontal_product_sale_price}>
                  {formatPrice(product.sale_price ? product.sale_price : product.price)} DH
                </span>
              </div>
            </div>

            {/* Description - visible on larger screens */}
            <div
              className="text-gray-300 w-3/4 hidden md:block mt-3 mb-4 prose prose-sm prose-invert max-w-none line-clamp-3"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Mobile Layout: Sizes and Buttons */}
            <div className="flex flex-col gap-2 sm:hidden mt-2">
              {/* Sizes for small screens */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size: Size) => (
                    <SizeComponent
                      key={size.id}
                      size={size}
                      className='border-none px-1' />
                  ))}
                </div>
              )}

              {/* Action Buttons for small screens */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className={styles.horizontal_product_button}>
                  <ShoppingCart className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClickHeart}
                  className={styles.horizontal_product_button}>
                  {isInWithList(product.id) ? <Trash2 className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Desktop Layout: Sizes and Buttons - Directly under description */}
            <div className="hidden sm:block">
              {/* Sizes for larger screens */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {product.sizes.map((size: Size) => (
                    <SizeComponent
                      key={size.id}
                      size={size}
                      className="border-none lg:px-1" />
                  ))}
                </div>
              )}

              {/* Action Buttons for larger screens */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className={styles.horizontal_product_button}>
                  <ShoppingCart className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClickHeart}
                  className={styles.horizontal_product_button}>
                  {isInWithList(product.id) ? <Trash2 className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={styles.horizontal_product_button + " hidden lg:block"}>
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        product={product}
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        onCartOpen={openCart} />
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        product={product}
        onCartOpen={openCart} />
    </motion.div>
  );
}
