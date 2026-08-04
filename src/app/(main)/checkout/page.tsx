"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  HoverInfo,
  CustomInput
} from '@/components/small-pieces';

import { OrderSummarySide, OrderSummary } from './checkout-item';
import { useCart } from '@/contexts/cart-context';
import CartItem from '@/types/cart-item';
import { useApiService } from '@/services/api.service';
import Size from '@/types/size';
import Color from '@/types/color';
import SuccessModal from '@/components/modal/success-modal';
import { useTranslation } from '@/lib/i18n-utils';
import { trackPurchase } from '@/lib/pixel';
import { CitySelect, CityItem } from '@/components/ui/city-select';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CheckoutForm() {
  const router = useRouter();
  const { cartItems, totalItems, subtotal, clearCart } = useCart();
  const api = useApiService();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { t } = useTranslation();

  // Initialize state directly from URL params if they exist
  const [checkoutState, setCheckoutState] = useState<{
    items: CartItem[],
    totalItems: number,
    subtotal: number
  }>({
    items: [],
    totalItems: 0,
    subtotal: 0
  });

  const fetchProduct = async (productId: string) => {
    try {
      const response = await api.product.get(productId);
      return response.data;
    } catch (err) {
      console.error("Error fetching product:", err);
      return null;
    }
  };

  useEffect(() => {
    const loadProductData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('productId') || '';
      const sizeId = urlParams.get('sizeId') || '';
      const colorId = urlParams.get('colorId') || '';
      const rawQuantity = parseInt(urlParams.get('quantity') || '1', 10);
      const quantity = isNaN(rawQuantity) || rawQuantity < 1 ? 1 : rawQuantity;

      if (productId) {
        try {
          const product = await fetchProduct(productId);
          const size = product?.sizes?.find((size: Size) => size.id === sizeId);
          const color = product?.colors?.find((color: Color) => color.id === colorId);
          if (product) {
            const price = product.sale_price || product.price;
            setCheckoutState({
              items: [{
                id: Date.now(),
                product,
                size,
                color,
                quantity: quantity,
                price
              }],
              totalItems: quantity,
              subtotal: price * quantity
            });
          }
        } catch (error) {
          console.error("Error loading product:", error);
        }
      } else {
        setCheckoutState({
          items: cartItems,
          totalItems,
          subtotal
        });
      }
    };

    loadProductData();
  }, [cartItems, totalItems, subtotal]);

  const [formData, setFormData] = useState<{
    full_name: string;
    shipping_address: string;
    phone_number: string;
    city: string;
    shipping_price: number;
    payment: {
      method: string;
      status: "pending" | "completed" | "failed";
    };
    items: { product: string; size?: string; color?: string; quantity: number }[];
  }>({
    full_name: '',
    shipping_address: '',
    phone_number: '',
    city: '',
    shipping_price: 30,
    payment: {
      method: "At Delivery",
      status: "pending"
    },
    items: []
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('checkoutFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          full_name: parsedData.full_name || '',
          shipping_address: parsedData.shipping_address || '',
          phone_number: parsedData.phone_number || '',
          city: parsedData.city || '',
          shipping_price: typeof parsedData.shipping_price === 'number' ? parsedData.shipping_price : 30,
          payment: {
            ...prev.payment,
            method: parsedData.paymentMethod || "At Delivery"
          }
        }));
      } catch (e) {
        console.error("Failed to parse saved checkout data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever relevant fields change
  useEffect(() => {
    if (!isLoaded) return;
    const dataToSave = {
      full_name: formData.full_name,
      shipping_address: formData.shipping_address,
      phone_number: formData.phone_number,
      city: formData.city,
      shipping_price: formData.shipping_price,
      paymentMethod: formData.payment.method
    };
    localStorage.setItem('checkoutFormData', JSON.stringify(dataToSave));
  }, [formData.full_name, formData.shipping_address, formData.phone_number, formData.city, formData.shipping_price, formData.payment.method, isLoaded]);

  // Update formData.items whenever checkoutState.items changes
  useEffect(() => {
    if (checkoutState.items.length > 0) {
      setFormData(prevFormData => ({
        ...prevFormData,
        items: checkoutState.items.map(item => ({
          product: String(item.product.id),
          size: item.size?.id ? String(item.size.id) : undefined,
          color: item.color?.id ? String(item.color.id) : undefined,
          quantity: item.quantity
        }))
      }));
    }
  }, [checkoutState.items]);

  // Handle phone input change to accept ONLY phone numbers starting with 0, +212, or 212
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow leading + and digits only
    let sanitized = val.replace(/(?!^\+)[^\d]/g, '');

    if (!sanitized) {
      setPhoneError('');
      setFormData(prev => ({ ...prev, phone_number: '' }));
      return;
    }

    // Must start with '0', '+', or '2'
    if (!/^(0|\+|2)/.test(sanitized)) {
      setPhoneError(t('checkout_err_phone_prefix'));
      return;
    }

    if (sanitized.startsWith('+')) {
      const validPlusPrefixes = ['+', '+2', '+21', '+212'];
      if (sanitized.length <= 4) {
        if (!validPlusPrefixes.some(p => p.startsWith(sanitized))) {
          setPhoneError(t('checkout_err_phone_prefix'));
          return;
        }
      } else if (!sanitized.startsWith('+212')) {
        setPhoneError(t('checkout_err_phone_prefix'));
        return;
      }
      sanitized = sanitized.slice(0, 13);
    } else if (sanitized.startsWith('2')) {
      const valid2Prefixes = ['2', '21', '212'];
      if (sanitized.length <= 3) {
        if (!valid2Prefixes.some(p => p.startsWith(sanitized))) {
          setPhoneError(t('checkout_err_phone_prefix'));
          return;
        }
      } else if (!sanitized.startsWith('212')) {
        setPhoneError(t('checkout_err_phone_prefix'));
        return;
      }
      sanitized = sanitized.slice(0, 12);
    } else if (sanitized.startsWith('0')) {
      sanitized = sanitized.slice(0, 10);
    }

    setPhoneError('');
    setFormData(prev => ({ ...prev, phone_number: sanitized }));
  };

  const handlesubmit = async () => {
    if (isSubmitting) return;

    // Validate form data
    if (!formData.full_name.trim()) {
      alert(t('checkout_err_name'));
      return;
    }
    if (!formData.city.trim()) {
      alert(t('checkout_err_city'));
      return;
    }
    if (!formData.shipping_address.trim()) {
      alert(t('checkout_err_address'));
      return;
    }
    if (!formData.phone_number.trim()) {
      alert(t('checkout_err_phone'));
      return;
    }
    
    // Phone validation (must start with 0, +212, or 212 followed by 9 digits)
    let isValidPhone = false;

    if (formData.phone_number.startsWith('0')) {
      isValidPhone = /^0\d{9}$/.test(formData.phone_number);
    } else if (formData.phone_number.startsWith('+212')) {
      isValidPhone = /^\+212\d{9}$/.test(formData.phone_number);
    } else if (formData.phone_number.startsWith('212')) {
      isValidPhone = /^212\d{9}$/.test(formData.phone_number);
    }

    if (!isValidPhone) {
      setPhoneError(t('checkout_err_phone_prefix'));
      alert(t('checkout_err_invalid_phone'));
      return;
    }

    if (formData.items.length === 0) {
      alert(t('checkout_err_empty'));
      return;
    }

    setIsSubmitting(true);

    // Normalize phone number (replace leading +212 or 212 with 0)
    let normalizedPhone = formData.phone_number;
    if (normalizedPhone.startsWith('+212')) {
      normalizedPhone = '0' + normalizedPhone.slice(4);
    } else if (normalizedPhone.startsWith('212')) {
      normalizedPhone = '0' + normalizedPhone.slice(3);
    }

    const orderData = {
      ...formData,
      phone_number: normalizedPhone
    };

    // Fire Meta Pixel Purchase event as soon as the user confirms the order
    trackPurchase(
      checkoutState.subtotal + formData.shipping_price,
      'MAD',
      checkoutState.items.map(item => String(item.product.id))
    );

    try {
      await api.order.create(orderData);
      clearCart();
      router.push('/?orderSuccess=true');
    } catch (error) {
      setIsSubmitting(false);
      alert(t('checkout_err_submit'));
    }
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
  }

  const navigateToHome = () => {
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <OrderSummary
          totalItems={checkoutState.totalItems}
          subtotal={checkoutState.subtotal}
          shippingCost={formData.shipping_price}
          items={checkoutState.items} />

        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-4 lg:h-fit p-6 pt-0 lg:pt-6 lg:border-r-2 lg:border-secondary lg:pr-12">
          {/* Delivery Section */}
          <div className="space-y-4">
            <h2 className="checkout_title">
              {t('checkout_delivery_title')}
            </h2>
            <CustomInput
              placeholder={t('checkout_full_name')}
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              type="text"
            />

            <CustomInput
              placeholder={t('checkout_address')}
              value={formData.shipping_address}
              onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
              type="text"
            />

            {/* City Selection Combobox */}
            <CitySelect
              value={formData.city}
              onChange={(cityItem: CityItem) => {
                setFormData(prev => ({
                  ...prev,
                  city: cityItem.name,
                  shipping_price: cityItem.delivering_price || 30
                }));
              }}
              placeholder={t('checkout_select_city')}
              searchPlaceholder={t('checkout_search_city')}
            />

            <div>
              <CustomInput
                placeholder={t('checkout_phone')}
                value={formData.phone_number}
                onChange={handlePhoneChange}
                type="tel">
                <HoverInfo message={t('checkout_phone_info')} />
              </CustomInput>
              {phoneError && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {phoneError}
                </p>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-4">
            <h2 className="checkout_title">
              {t('checkout_payment_title')}
            </h2>
            <p className="checkout_subtitle">
              {t('checkout_payment_secure')}
            </p>
            <div>
              <div
                className="flex pr-4 gap-3 p-4 rounded-md border-2 border-greny">
                <input
                  className="checkout_radio"
                  checked={true}
                  type="radio"
                  name="payment"
                  value="At Delivery"
                  readOnly />
                <span>{t('checkout_cash_on_delivery')}</span>
              </div>
            </div>
            <Button
              onClick={handlesubmit}
              disabled={isSubmitting}
              className="complete_order_button flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('checkout_complete_order')}...</span>
                </>
              ) : (
                t('checkout_complete_order')
              )}
            </Button>
          </div>
        </div>

        <OrderSummarySide
          totalItems={checkoutState.totalItems}
          subtotal={checkoutState.subtotal}
          shippingCost={formData.shipping_price}
          items={checkoutState.items} />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title={t('checkout_success_title')}
        message={t('checkout_success_message')}
        buttonText={t('checkout_continue_shopping')}
        onButtonClick={navigateToHome}
      />
    </div>
  );
}
