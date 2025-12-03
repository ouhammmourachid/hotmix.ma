import {
  Heart,X,Plus,
  Minus,Star,
  ChevronUp,SearchX,
  ChevronDown,Trash2,
  Info,Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect,useRef} from 'react';
import { useWishlist } from '@/contexts/wishlist-context';
import { Grid2X1,Grid2X2,Grid2X3,Grid2X4,Grid2X5, Grid2X6 } from '@/components/icon/grid';
import Filter from '@/components/icon/filter';
import SizeType from '@/types/size';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFilter } from '@/contexts/filter-context';
import { useGrid } from '@/contexts/grid-context';
import styles from '@/styles/small.module.css';
import {motion} from 'framer-motion';
import { useApiService } from '@/services/api.service';
import Color from '@/types/color';
import Tag from '@/types/tag';
import Category from '@/types/category';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-utils';

export function Size({size,selectedSize,onClick,className}:{size:SizeType,selectedSize?:SizeType,onClick?:()=>void,className?:string}) {
    return (
        <button
            key={size.id}
            className={`${styles.size}
                ${selectedSize?.id === size.id
                      ? ' border-greny bg-secondary'
                      : ' border-secondary'
                    }  ${className}`}
            onClick={onClick}>
            {size.name}
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
                        quantity,
                      }:{
                        price:number,
                        className?:string,
                        onClickAddToCart?:()=>void,
                        onCartOpen?:()=>void,
                        productId:string,
                        selectedSize?:SizeType,
                        quantity:number
                      }) {
    const { addToWithList, isInWithList,removeFromWithList } = useWishlist();
    const { t, language } = useTranslation();
    const handleClickHeart = () => {
        if (isInWithList(productId)) {
          removeFromWithList(productId);
        } else {
          addToWithList(productId);
        }
      };
    return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
            variant="outline"
            onClick={() => {
              onClickAddToCart?.();
              onCartOpen?.();
            }}
            className={styles.three_buttons_add_to_cart}>
            {t('add_to_cart')} - {formatPrice(price, 'DH', language)}
        </Button>
        <Button
            variant="ghost"
            onClick={handleClickHeart}
            className="h-12 w-12 p-0 border border-white/20 rounded-sm">
            {!isInWithList(productId) ? (
              <Heart size={20} />
            ) : (
              <Trash2 size={20} />
            )}
        </Button>
      </div>
      <Link
        href={`/checkout?productId=${productId}&sizeId=${selectedSize?.id}&quantity=${quantity}`}
        data-button-tracker
        className={styles.three_buttons_quick_buy}
        >
        {t('buy_now')}
      </Link>
    </div>
    )
}


export function XButton({onClick,className}:{onClick:()=>void,className?:string}) {
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
            className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-4 text-white hover:opacity-75 z-50 ${className}`}
        >
            <X className='w-6 h-6'/>
        </button>
    )
}

export function XCursor({mousePosition,show }:{mousePosition:{x:number,y:number},show :boolean}) {
    return (
    <>
      {show  && (
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
                                }:{
                                  quantity:number,
                                  setQuantity:(quantity:number)=>void,
                                  className?:string,
                                  withLabel?:boolean,
                                  small?:boolean
                                }) {
    const { t } = useTranslation();
    const handleQuantityChange = (action:any) => {
        if (action === 'decrease' && quantity > 1) {
          setQuantity(quantity - 1);
        } else if (action === 'increase') {
          setQuantity(quantity + 1);
        }
      };
    if (small) return(
      <div className="flex items-center gap-2 bg-[#004750] w-fit rounded-sm p-0.5">
        <button
          onClick={() => handleQuantityChange('decrease')}
          className="w-5 h-5 flex items-center justify-center"
        >
          <Minus size={12} />
        </button>
        <span className="w-4 text-center text-xs">{quantity}</span>
        <button
          onClick={() => handleQuantityChange('increase')}
          className="w-5 h-5 flex items-center justify-center"
        >
          <Plus size={12} />
        </button>
      </div>
    );
    
    return (
    <div className={`${className || 'mb-4'} ${className?.includes('sticky-footer') ? 'flex items-center' : 'flex flex-col gap-1'}`}>
              {withLabel && <label className="block mb-2">{t('quantity')}</label>}
              <div className="flex items-center gap-2 bg-[#004750] w-fit rounded-sm">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
          </div>
    )
}


export function Rating({ rating,withNumber }: { rating: number,withNumber?:boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          className={`${
            Math.round(rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
          }`}
        />
      ))}
      {withNumber && <span className="text-gray-500 ml-2">{rating}</span>}
    </div>
  );
}


export function ScrollArrow(){
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId = null;
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
      className={styles.scroll_arrow}>
      <ChevronUp className='w-5 h-5'/>
    </Button>
  ) : null;
};

export function Grid() {
  const { gridSize, setGridSize, getResponsiveGridSize } = useGrid();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Check screen size on mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return (
    <div className={styles.grid_group}>
      <Grid2X1
        onClick={()=>setGridSize(1)}
        className={`${styles.grid_item} ${gridSize === 1 ? styles.grid_item_selected : ''}`} />
      <Grid2X2
        onClick={()=>setGridSize(2)}
        className={`${styles.grid_item} ${gridSize === 2 ? styles.grid_item_selected : ''}`} />
      <Grid2X3
        onClick={()=>setGridSize(3)}
        className={`${styles.grid_item} ${gridSize === 3 ? styles.grid_item_selected : ''} hidden lg:flex`} />
      <Grid2X4
        onClick={()=>setGridSize(4)}
        className={`${styles.grid_item} ${gridSize === 4 ? styles.grid_item_selected : ''} hidden lg:flex`} />
      <Grid2X5
        onClick={()=>setGridSize(5)}
        className={`${styles.grid_item} ${gridSize === 5 ? styles.grid_item_selected : ''} hidden lg:flex`} />
      <Grid2X6
        onClick={()=>setGridSize(6)}
        className={`${styles.grid_item} ${gridSize === 6 ? styles.grid_item_selected : ''} hidden lg:flex`} />
    </div>
  )
}

export function HoverInfo({message}:{message?:string}) {
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
                              }:{
                                title:string,
                                children:React.ReactNode
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
        className='flex items-center justify-between w-full gap-2 cursor-pointer '
        onClick={()=>setShowFilter(!showFilter)}>
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
                }:{
                  name:string|undefined,
                  onClick?:()=>void
                  className?:string
                }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`flex items-center border-l border-secondary pl-3 gap-1 cursor-pointer hover:text-greny ${className}`}>
      {isHovered ? (
        <Minus size={16}/>
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
                              }:{
                                base?:string,
                                count:number
                              }) {
  const { t } = useTranslation();
  const {filterState,setFilterState,isFilterEmpty,toString} = useFilter();
  const [sizes, setSizes] = useState<SizeType[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const api = useApiService();
  const router = useRouter();
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
    } catch (err ) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    router.replace(`${base}?${toString()}`);
  }, [filterState])
  const handleClick = (type:string,id:number) => {
    if (type === 'color') {
      setFilterState((prev:any) => ({
        ...prev,
        colors: prev.colors.filter((colorId:number) => colorId !== id)
      }))
    } else if (type === 'tag') {
      setFilterState((prev:any) => ({
        ...prev,
        tags: prev.tags.filter((tagId:number) => tagId !== id)
      }))
    } else if (type === 'size') {
      setFilterState((prev:any) => ({
        ...prev,
        sizes: prev.sizes.filter((sizeId:number) => sizeId !== id)
      }))
    } else if (type === 'category') {
      setFilterState((prev:any) => ({
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
        filterState.colors.map((colorId:number) => (
          <Feature
            onClick={() => handleClick('color',colorId)}
            key={colorId} 
            name={colors.find(color => color.id === colorId)?.name}/>
        ))
      }
      {
        filterState.tags.map((tagId:number) => (
          <Feature
            onClick={() => handleClick('tag',tagId)}
            key={tagId}
            name={tags.find(tag => tag.id == tagId)?.name}/>
        ))
      }
      {
        filterState.sizes.map((sizeId:number) => (
          <Feature
            onClick={() => handleClick('size',sizeId)}
            key={sizeId}
            name={sizes.find(size => size.id === sizeId)?.name}/>
        ))
      }
      {
        filterState.category && (
          <Feature
            onClick={() => handleClick('category',0)}
            name={categories.find(category => category.id === filterState.category)?.name}/>
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
        name={t('remove_all_filters')}/>
    </div>
  )
}


export function CustomInput({
                              value,
                              onChange,
                              placeholder,
                              type,
                              children,
                              }:{
                                value:string,
                                onChange:(e:any)=>void,
                                placeholder:string,
                                type:string,
                                children?:React.ReactNode
                              }){
  return (
  <div className='checkout_input_with_icon'>
    <Input
      type={type}
      placeholder={placeholder}
      className="checkout_input_with_icon_input focus-visible:ring-0"
      value={value}
      onChange={onChange}/>
    <div className='flex items-center'>
      {children}
    </div>
  </div>
  )
}


export function FilterButton({onClick}:{onClick:()=>void}) {
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
