import {
  Heart, X, Plus,
  Minus,
  ChevronUp,
  ChevronDown, Trash2,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { useWishlist } from '@/contexts/wishlist-context';
import { Grid2X1, Grid2X2, Grid2X3, Grid2X4, Grid2X5, Grid2X6 } from '@/components/icon/grid';
import Filter from '@/components/icon/filter';
import SizeType from '@/types/size';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useFilter } from '@/contexts/filter-context';
import { useGrid } from '@/contexts/grid-context';
import styles from '@/styles/small.module.css';
import { motion } from 'framer-motion';
import { useApiService } from '@/services/api.service';
import Color from '@/types/color';
import Tag from '@/types/tag';
import Category from '@/types/category';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-utils';
import { saveBuyNowProduct } from '@/lib/buy-now';
import Product from '@/types/product';

export function Size({ size, selectedSize, onClick, className, isArchived }: { size: SizeType, selectedSize?: SizeType, onClick?: () => void, className?: string, isArchived?: boolean }) {
  return (
    <button
      key={size.id}
      disabled={isArchived}
      className={`${styles.size} ${
        isArchived
          ? selectedSize?.id === size.id
            ? 'border-label-3 bg-fill text-label-2 cursor-not-allowed'
            : 'border-separator bg-transparent text-label-3 cursor-not-allowed'
          : selectedSize?.id === size.id
            ? 'border-greny bg-greny/10 text-label shadow-[inset_0_0_0_1px_rgb(134_223_14)]'
            : 'border-separator text-label hover:border-label-3'
      } ${className || ''}`}
      onClick={!isArchived ? onClick : undefined}>
      <span className={isArchived ? "line-through decoration-1" : ""}>
        {size.name}
      </span>
    </button>
  )
}



export function ThreeButtons({
  price,
  className,
  onClickAddToCart,
  onCartOpen,
  productId,
  selectedSize,
  selectedColor,
  quantity,
  isArchived,
  product,
}: {
  price: number,
  className?: string,
  onClickAddToCart?: () => void,
  onCartOpen?: () => void,
  productId: string,
  selectedSize?: SizeType,
  selectedColor?: Color,
  quantity: number,
  isArchived?: boolean,
  // Handed to the checkout so Buy now opens it instantly
  product?: Product,
}) {
  const { addToWithList, isInWithList, removeFromWithList } = useWishlist();
  const { t, language } = useTranslation();
  const handleClickHeart = () => {
    if (isInWithList(productId)) {
      removeFromWithList(productId);
    } else {
      addToWithList(productId);
    }
  };
  // Only send the size/color the product actually has, so the URL never carries "undefined"
  const buyNowParams = new URLSearchParams({ productId, quantity: String(quantity) });
  if (selectedSize?.id) buyNowParams.set('sizeId', selectedSize.id);
  if (selectedColor?.id) buyNowParams.set('colorId', selectedColor.id);
  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={isArchived}
          onClick={() => {
            if (!isArchived) {
              onClickAddToCart?.();
              onCartOpen?.();
            }
          }}
          className={`${styles.three_buttons_add_to_cart} ${
            isArchived
              ? 'bg-fill text-label-2 cursor-not-allowed hover:bg-fill hover:text-label-2'
              : ''
          }`}>
          {isArchived
            ? `${t('sold_out')} - ${formatPrice(price, 'DH', language)}`
            : `${t('add_to_cart')} - ${formatPrice(price, 'DH', language)}`}
        </Button>
        <Button
          variant="ghost"
          onClick={handleClickHeart}
          aria-label="Wishlist"
          className="h-12 w-12 p-0 shrink-0 rounded-full bg-fill hover:bg-fill-2 text-label [&_svg]:size-5">
          {!isInWithList(productId) ? (
            <Heart size={20} />
          ) : (
            <Trash2 size={20} />
          )}
        </Button>
      </div>
      {!isArchived && (
        <Link
          href={`/checkout?${buyNowParams.toString()}`}
          onClick={() => product && saveBuyNowProduct(product)}
          data-button-tracker
          className={styles.three_buttons_quick_buy}
        >
          {t('buy_now')}
        </Link>
      )}
    </div>
  )
}


export function XButton({ onClick, className }: { onClick: () => void, className?: string }) {
  const { language } = useTranslation();
  const isRTL = language === 'ar';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      data-close="true"
      aria-label="Close"
      className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-3 w-9 h-9 flex items-center justify-center rounded-full bg-fill text-label hover:bg-fill-2 transition-colors z-50 ${className}`}
    >
      <X className='w-[18px] h-[18px]' strokeWidth={2.25} />
    </button>
  )
}

export function XCursor({ mousePosition, show }: { mousePosition: { x: number, y: number }, show: boolean }) {
  return (
    <>
      {show && (
        <div
          className={styles.x_cursor}
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        >
          <div className={styles.x_cursor_x}>
            <X className="w-4 h-4 text-black" />
          </div>
        </div>
      )}
    </>
  )
}


export function QuantityChanger({
  quantity,
  setQuantity,
  className,
  withLabel,
  small
}: {
  quantity: number,
  setQuantity: (quantity: number) => void,
  className?: string,
  withLabel?: boolean,
  small?: boolean
}) {
  const { t } = useTranslation();
  const handleQuantityChange = (action: any) => {
    if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (action === 'increase') {
      setQuantity(quantity + 1);
    }
  };
  if (small) return (
    <div className="flex items-center gap-1 bg-fill w-fit rounded-full p-0.5">
      <button
        onClick={() => handleQuantityChange('decrease')}
        aria-label="Decrease quantity"
        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-fill-2 transition-colors"
      >
        <Minus size={12} />
      </button>
      <span className="w-5 text-center text-footnote font-medium tnum">{quantity}</span>
      <button
        onClick={() => handleQuantityChange('increase')}
        aria-label="Increase quantity"
        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-fill-2 transition-colors"
      >
        <Plus size={12} />
      </button>
    </div>
  );

  return (
    <div className={`${className || 'mb-4'} ${className?.includes('sticky-footer') ? 'flex items-center' : 'flex flex-col gap-1'}`}>
      {withLabel && <label className="block mb-2 text-subhead text-label-2">{t('quantity')}</label>}
      <div className="flex items-center bg-fill w-fit rounded-full">
        <button
          onClick={() => handleQuantityChange('decrease')}
          aria-label="Decrease quantity"
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-fill-2 transition-colors active:scale-95"
        >
          <Minus size={18} />
        </button>
        <span className="w-8 text-center text-body font-medium tnum">{quantity}</span>
        <button
          onClick={() => handleQuantityChange('increase')}
          aria-label="Increase quantity"
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-fill-2 transition-colors active:scale-95"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}


export function ScrollArrow() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isProductPage = Boolean(pathname?.startsWith('/products/') && pathname !== '/products');

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled up 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        // wait for 500ms before hiding the button
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return isVisible ? (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`${styles.scroll_arrow} ${isProductPage ? '!bottom-36 md:!bottom-28' : ''}`}>
      <ChevronUp className='w-5 h-5' />
    </Button>
  ) : null;
};

export function Grid({ hideOnMobile = false }: { hideOnMobile?: boolean }) {
  const { gridSize, setGridSize } = useGrid();

  return (
    <div className={`${styles.grid_group} ${hideOnMobile ? styles.grid_group_hide_mobile : ''}`}>
      <Grid2X1
        onClick={() => setGridSize(1)}
        className={`${styles.grid_item} ${gridSize === 1 ? styles.grid_item_selected : ''}`} />
      <Grid2X2
        onClick={() => setGridSize(2)}
        className={`${styles.grid_item} ${gridSize === 2 ? styles.grid_item_selected : ''}`} />
      <Grid2X3
        onClick={() => setGridSize(3)}
        className={`${styles.grid_item} ${gridSize === 3 ? styles.grid_item_selected : ''} hidden lg:flex`} />
      <Grid2X4
        onClick={() => setGridSize(4)}
        className={`${styles.grid_item} ${gridSize === 4 ? styles.grid_item_selected : ''} hidden lg:flex`} />
      <Grid2X5
        onClick={() => setGridSize(5)}
        className={`${styles.grid_item} ${gridSize === 5 ? styles.grid_item_selected : ''} hidden lg:flex`} />
      <Grid2X6
        onClick={() => setGridSize(6)}
        className={`${styles.grid_item} ${gridSize === 6 ? styles.grid_item_selected : ''} hidden lg:flex`} />
    </div>
  )
}

export function HoverInfo({ message }: { message?: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Info className="text-gray-400 cursor-pointer" size={20} />
      </HoverCardTrigger>
      <HoverCardContent className="w-44 bg-whity text-black">
        <div className="flex space-x-4 text-xs items-center justify-center text-center">
          {message}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}





export function FilterFeature({
  title,
  children
}: {
  title: string,
  children: React.ReactNode
}) {
  const [showFilter, setShowFilter] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  // const {filterState,toString} = useFilter();
  // // const router = useRouter();
  // // useEffect(() => {
  // //   router.replace(`/products?${toString()}`);
  // // }, [filterState])

  return (
    <div className="flex flex-col gap-2 mx-6 py-5 border-b border-[#014751]">
      <div
        className='flex items-center justify-between w-full gap-2 cursor-pointer pr-1'
        onClick={() => setShowFilter(!showFilter)}>
        <span>{title}</span>
        <motion.div
          initial={false}
          animate={{ rotate: showFilter ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: showFilter ? "auto" : 0,
          opacity: showFilter ? 1 : 0
        }}
        transition={{
          height: {
            duration: 0.3,
            ease: "easeOut"
          },
          opacity: {
            duration: 0.2
          }
        }}
        className="overflow-hidden"
      >
        <div ref={contentRef}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

function Feature({
  name,
  onClick,
  className
}: {
  name: string | undefined,
  onClick?: () => void
  className?: string
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`flex items-center border-l border-secondary pl-3 gap-1 cursor-pointer hover:text-greny ${className}`}>
      {isHovered ? (
        <Minus size={16} />
      ) : (
        <X size={16} />
      )}
      {name}
    </div>
  )
}

export function FilterSummary({
  base,
  count
}: {
  base?: string,
  count: number
}) {
  const { t } = useTranslation();
  const { filterState, setFilterState, isFilterEmpty, toString } = useFilter();
  const [sizes, setSizes] = useState<SizeType[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const api = useApiService();
  const router = useRouter();
  const isFirstRender = useRef(true);
  const fetchData = async () => {
    try {
      const response = await api.size.getAll();
      setSizes(response.data);
      const response2 = await api.color.getAll();
      setColors(response2.data);
      const response3 = await api.tag.getAll();
      setTags(response3.data);
      const response4 = await api.category.getAll();
      setCategories(response4.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Skip on mount: filterState hasn't been hydrated from the URL yet at
    // this point (that hydration effect lives in the parent page and runs
    // after this one, since child effects fire before parent effects on
    // mount), so writing it back here would overwrite query params like
    // ?q=... with the still-default, empty filter state before they're
    // ever read.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    router.replace(`${base}?${toString()}`);
  }, [filterState])
  const handleClick = (type: string, id: string) => {
    if (type === 'color') {
      setFilterState((prev: any) => ({
        ...prev,
        colors: prev.colors.filter((colorId: string) => colorId !== id)
      }))
    } else if (type === 'tag') {
      setFilterState((prev: any) => ({
        ...prev,
        tags: prev.tags.filter((tagId: string) => tagId !== id)
      }))
    } else if (type === 'size') {
      setFilterState((prev: any) => ({
        ...prev,
        sizes: prev.sizes.filter((sizeId: string) => sizeId !== id)
      }))
    } else if (type === 'category') {
      setFilterState((prev: any) => ({
        ...prev,
        category: null
      }))
    }
  }
  if (isFilterEmpty()) return null;
  return (
    <div className='flex flex-wrap gap-2 py-4'>
      <div>{count} {t('products_found')}</div>
      {
        filterState.colors.map((colorId: string) => (
          <Feature
            onClick={() => handleClick('color', colorId)}
            key={colorId}
            name={colors.find(color => color.id === colorId)?.name} />
        ))
      }
      {
        filterState.tags.map((tagId: string) => (
          <Feature
            onClick={() => handleClick('tag', tagId)}
            key={tagId}
            name={tags.find(tag => tag.id == tagId)?.name} />
        ))
      }
      {
        filterState.sizes.map((sizeId: string) => (
          <Feature
            onClick={() => handleClick('size', sizeId)}
            key={sizeId}
            name={sizes.find(size => size.id === sizeId)?.name} />
        ))
      }
      {
        filterState.category && (
          <Feature
            onClick={() => handleClick('category', String(filterState.category))}
            name={categories.find(category => category.id === filterState.category)?.name} />
        )
      }
      <Feature
        onClick={() => setFilterState({
          tags: [],
          colors: [],
          sizes: [],
          category: null
        })}
        className='bg-secondary rounded-xl pr-2 hover:text-white'
        name={t('remove_all_filters')} />
    </div>
  )
}


export function CustomInput({
  value,
  onChange,
  placeholder,
  type,
  children,
  invalid,
}: {
  value: string,
  onChange: (e: any) => void,
  placeholder: string,
  type: string,
  children?: React.ReactNode,
  invalid?: boolean
}) {
  return (
    <div className={`checkout_input_with_icon ${invalid ? '!border-red-500' : ''}`}>
      <Input
        type={type}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className="checkout_input_with_icon_input focus-visible:ring-0"
        value={value}
        onChange={onChange} />
      <div className='flex items-center'>
        {children}
      </div>
    </div>
  )
}


export function FilterButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <div className='flex-none'>
      <button
        onClick={onClick}
        className="filter_button">
        <Filter />
        {t('filter_button')}
      </button>
    </div>
  )
}
