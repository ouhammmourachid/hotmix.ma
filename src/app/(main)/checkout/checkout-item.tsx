import CartItemType from '@/types/cart-item';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n-utils';

export default function CheckoutItem({ item }: { item: CartItemType }) {
    const price = item.price * item.quantity;


    return (
        <div className="flex gap-4 items-center">
            <div className="relative w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
                <img src={item.product.images[0].path} alt={item.product.name} className="max-h-full max-w-full" />
                <span
                    className="absolute -top-2 -right-2 bg-white text-black font-semibold text-sm rounded-full w-6 h-6 flex items-center justify-center bg-opacity-60">
                    {item.quantity}
                </span>
            </div>
            <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-gray-400">{item.size?.name}</p>
            </div>
            <div className="text-right">
                <p>{Number(price).toFixed(0)} DH</p>
            </div>
        </div>
    )
}


export function CheckoutTotal({ totalItems, subtotal }: { totalItems: number, subtotal: number }) {
    const { t } = useTranslation();
    // Convert to number to ensure proper calculation
    const subtotalValue = Number(subtotal);
    const shippingCost = 20;
    const totalValue = subtotalValue + shippingCost;

    return (
        <div className="space-y-4">
            <div className="flex justify-between text-sm">
                <span>{t('cart_subtotal')} • {totalItems} {t('checkout_items')}</span>
                <span>{subtotalValue.toFixed(0)} DH</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>{t('cart_shipping')}</span>
                <span>{shippingCost} DH</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
                <span>{t('cart_total')}</span>
                <span>{totalValue.toFixed(0)} DH</span>
            </div>
        </div>
    )
}


export function OrderItems({ items }: { items: CartItemType[] }) {
    return (
        <div className="pb-4 space-y-4">
            {items.map((item, index) => (
                <CheckoutItem key={index} item={item} />
            ))}
        </div>
    )
}


export function OrderSummary({
    items,
    totalItems,
    subtotal
}: {
    items: CartItemType[],
    totalItems: number,
    subtotal: number
}) {
    const [isOpen, setIsOpen] = useState(false);
    const subtotalValue = Number(subtotal) + 20;
    const { t } = useTranslation();

    return (
        <div className='lg:hidden'>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="text-xl p-6 font-semibold flex justify-between cursor-pointer bg-secondary">
                <div
                    className='flex text-greny'>
                    {t('checkout_order_summary')} {isOpen ? <ChevronUp className='mt-1' /> : <ChevronDown className='mt-1' />}
                </div>
                <div>{subtotalValue.toFixed(0)} DH</div>
            </div>
            {isOpen &&
                <div className="p-6 border-b border-secondary">
                    <OrderItems items={items} />
                    <CheckoutTotal
                        totalItems={totalItems}
                        subtotal={subtotal} />
                </div>
            }
        </div>
    )
}


export function OrderSummarySide({
    items,
    totalItems,
    subtotal
}: {
    items: CartItemType[],
    totalItems: number,
    subtotal: number
}) {
    const [isOpen, setIsOpen] = useState(false);
    const subtotalValue = Number(subtotal);
    const { t } = useTranslation();

    return (
        <div className="space-y-6 lg:sticky lg:top-4 lg:h-fit p-6">
            <div
                className='flex justify-between cursor-pointer lg:hidden'
                onClick={() => setIsOpen(!isOpen)}>
                <span>{t('checkout_order_summary')}</span>
                <div className='flex text-greny'>
                    {isOpen ?
                        <>
                            {t('checkout_hide')} <ChevronUp />
                        </>
                        :
                        <>
                            {t('checkout_show')} <ChevronDown />
                        </>
                    }
                </div>
            </div>
            {isOpen &&
                <div className='lg:hidden'>
                    <OrderItems items={items} />
                </div>
            }
            <div className='hidden lg:block'>
                <OrderItems items={items} />
            </div>

            <CheckoutTotal
                subtotal={subtotalValue}
                totalItems={totalItems} />
        </div>
    )
}
