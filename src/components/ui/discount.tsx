import React from 'react';
import { cn } from '@/lib/utils';
import styles from '@/styles/small.module.css';

export interface DiscountProps {
  discount?: string | number | null;
  withOff?: boolean;
  className?: string;
  absolute?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
}

/**
 * Discount component for displaying product discounts
 * Can be used both inline or as an absolute positioned badge
 */
export function Discount({
  discount,
  withOff = false,
  className,
  absolute = false,
  position = 'top-right',
  size = 'md',
  variant = 'default',
}: DiscountProps) {
  // Return null if discount is 0, undefined, null, or empty string
  if (!discount || Number(discount) === 0) return null;
  
  // Parse discount as number (if it's a string)
  const discountValue = typeof discount === 'string' ? parseInt(discount) : discount;
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-xs sm:text-sm py-1 px-2',
    lg: 'text-sm sm:text-base py-1.5 px-2.5',
  };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-[#d8e8dd] text-black font-semibold',
    outline: 'bg-transparent border border-[#d8e8dd] text-[#d8e8dd]', 
    filled: 'bg-green-500 text-white',
  };
  
  return (
    <span
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        absolute && 'absolute z-30',
        absolute && positionClasses[position],
        discount && styles.discount_badge,
        className
      )}
    >
      {withOff 
        ? `${discountValue}% OFF` 
        : `-${discountValue}%`
      }
    </span>
  );
}

// For backward compatibility with existing implementation
export function DiscountBadge({ 
  discount,
  withOff = false,
  className
}: {
  discount: string | undefined,
  withOff?: boolean,
  className?: string,
}) {
  return (
    <Discount discount={discount} withOff={withOff} className={className} />
  );
}
