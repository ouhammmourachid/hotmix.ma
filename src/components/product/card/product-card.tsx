import { Button } from "@/components/ui/button";
import { Heart, Eye, Trash2 } from "lucide-react";
import ProductModal from "@/components/modal/product-modal";
import { useState, useEffect, useRef } from "react";
import QuickAddModal from "@/components/modal/quick-add-modal";
import Link from "next/link";
import Product from "@/types/product";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCartModal } from "@/contexts/cart-modal-context";
import styles from "@/styles/product.module.css";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { Discount } from "@/components/ui/discount";

export default function ProductCard({
  product,
  delay,
  ref
}: {
  product: Product,
  delay?: number,
  ref?: any
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomActive, setZoomActive] = useState(false); 
  const [firstTransitionDone, setFirstTransitionDone] = useState(false);
  const { addToWithList, removeFromWithList, isInWithList } = useWishlist();
  const { openCart } = useCartModal();

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
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: delay }}
      ref={ref}
      className={styles.product_card + " group"}>      {/* Discount Badge - using the new Discount component */}
      <Discount
        discount={product.discount}
        absolute
        position="top-right"
      />

      {/* Product Image */}
      <div className="p-0 relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div className="relative">
          <Link
            href={`/products/${product.id}`}
            className="cursor-pointer block relative z-10"
          >
            {/* Image with zoom effect for all images */}
            <div className="overflow-hidden rounded-lg">
              <img
                src={currentImagePath}
                alt={product.name}
                className={`w-full object-cover rounded-lg transition-all duration-700 ${zoomActive ? 'scale-110' : 'scale-100'}`}
                style={{ height: '100%' }}
              />
            </div>
          </Link>

          {/* Image indicator dots for multiple images - placed outside Link to prevent navigation conflicts */}
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

        {/* Hover Overlay with Quick Actions */}
        <div className={styles.product_card_quick_actions + ' group-hover:opacity-100 pointer-events-none absolute inset-0 z-20'}>
          {/* Quick Actions */}
          <div className="hidden lg:flex justify-center gap-2 mb-4 pointer-events-auto">
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={handleClickHeart}
              className={styles.product_card_quick_actions_button}>
              {!isInWithList(product.id) ? (
                <Heart size={20} />
              ) : (
                <Trash2 size={20} />
              )}
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={styles.product_card_quick_actions_button}
              onClick={() => setIsModalOpen(true)}>
              <Eye size={20} />
            </motion.div>
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className={styles.product_card_sizes + " pointer-events-auto"}>
              {product.sizes.map((size) => (
                <span
                  key={size.id}
                  className="text-xs text-white font-bold"
                >
                  {size.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>      {/* Product Info */}
      <div className="pt-3 space-y-4">
        <Link href={`/products/${product.id}`}>
          <h3 className={styles.product_card_name}>
            {product.name}
          </h3>
        </Link>        
        <div className="flex items-center justify-between">
          <div className={styles.product_card_prices}>
            {product.sale_price && product.sale_price !== product.price && (
              <span className={styles.product_card_price}>
                {formatPrice(product.price)} DH
              </span>
            )}
            <span className={styles.product_card_sale_price}>
              {formatPrice(product.sale_price ? product.sale_price : product.price)} DH
            </span>
          </div>
        </div>
      </div>
      {/* Quick Add Button */}
      <Button
        className={styles.product_card_quick_add + " group-hover:opacity-100"}
        onClick={() => setIsQuickAddOpen(true)}>
        QUICK ADD
      </Button>
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
