import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Product from '@/types/product';
import {ScrollArea} from '@/components/ui/scroll-area';
import { useTranslation } from '@/lib/i18n-utils';

export default function SearchResults({
                                results,
                                onClickLink,
                                query,
                            }:{
                                results:Product[]
                                onClickLink:()=>void,
                                query:string
                            }) {
    const { t } = useTranslation();
                                
    return (
        <ScrollArea
            className="h-[550px] text-whity pt-4">
            <div
                className="flex items-center justify-between py-2">
                <h1>{t('search_products_header')}</h1>
                <Link
                    onClick={onClickLink}
                    href={`/search?q=${query.trim().replace(/\s/g,'+')}`}
                    className="w-fit p-0 flex items-center hover:text-greny border-b hover:border-greny">
                    {t('search_view_all')}
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
            {results.map((product,index) => (
                <div
                    key={product.id}
                    className={`flex items-center gap-4 py-2 ${results.length-1!=index&&'border-b'} border-secondary`}>
                    <Link
                        onClick={onClickLink}
                        href={`/products/${product.id}`}>
                        <img
                            src={product.images[0].path}
                            alt={product.name}
                            className="w-16 object-cover rounded-sm"
                        />
                    </Link>
                    <div className="flex flex-col gap-2 items-start">
                    <Link
                        onClick={onClickLink}
                        href={`/products/${product.id}`}>
                        <h4 className="text-base font-normal text-whity hover:text-greny">
                            {product.name}
                        </h4>
                    </Link>
                    <div className='flex items-center gap-2'>
                        {product.sale_price && (
                        <span
                            className="text-gray-400 line-through">
                            {product.price} DH
                        </span>
                        )}
                        <span
                            className="text-greny font-bold">
                            {product.sale_price ? product.sale_price : product.price} DH
                        </span>
                        </div>
                    </div>
                </div>
        ))}
    </ScrollArea>
    )
}
