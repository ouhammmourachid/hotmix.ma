"use client"
import React, { useEffect, useRef, useState } from 'react';
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
import Product from '@/types/product';
import SuccessModal from '@/components/modal/success-modal';
import { useTranslation } from '@/lib/i18n-utils';
import { trackPurchase } from '@/lib/pixel';
import posthog from 'posthog-js';
import { CitySelect, CityItem } from '@/components/ui/city-select';
import { getShippingPrice, DEFAULT_SHIPPING_PRICE } from '@/lib/shipping';
import { readBuyNowProduct } from '@/lib/buy-now';
import EmptyCartPage from '@/components/cart/empty-cart-page';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// In on-screen order, so the first invalid one is the one scrolled to
const CHECKOUT_FIELDS = ['full_name', 'shipping_address', 'city', 'phone_number'] as const;
type CheckoutField = typeof CHECKOUT_FIELDS[number];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-red-500 text-xs font-medium mt-1">
      {message}
    </p>
  );
}

export default function CheckoutForm() {
  const router = useRouter();
  const { cartItems, totalItems, subtotal, clearCart, isInitialized: isCartLoaded } = useCart();
  const api = useApiService();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { t } = useTranslation();

  const [checkoutState, setCheckoutState] = useState<{
    items: CartItem[],
    totalItems: number,
    subtotal: number
  }>({
    items: [],
    totalItems: 0,
    subtotal: 0
  });
  // 'loading' until the items are known, so the summary never shows a made-up empty order
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  // Read from the URL after mount: the Buy now product, or null for a checkout of the cart
  const [buyNowProductId, setBuyNowProductId] = useState<string | null | undefined>(undefined);
  const [reloadKey, setReloadKey] = useState(0);
  // The cart is cleared once the order is placed; don't switch to the empty-cart screen while redirecting
  const isOrderPlaced = useRef(false);

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
    setBuyNowProductId(new URLSearchParams(window.location.search).get('productId'));
  }, []);

  // Buy now: shown instantly when the product page handed the product over, then refreshed
  // from the API so price and options are current. Runs once, not again when the cart loads.
  useEffect(() => {
    if (!buyNowProductId) return;
    const urlParams = new URLSearchParams(window.location.search);
    const sizeId = urlParams.get('sizeId') || '';
    const colorId = urlParams.get('colorId') || '';
    const rawQuantity = parseInt(urlParams.get('quantity') || '1', 10);
    const quantity = isNaN(rawQuantity) || rawQuantity < 1 ? 1 : rawQuantity;

    const showProduct = (product: Product) => {
      const size = product.sizes?.find((size: Size) => size.id === sizeId);
      const color = product.colors?.find((color: Color) => color.id === colorId);
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
      setLoadStatus('ready');
    };

    const handedOver = readBuyNowProduct(buyNowProductId);
    if (handedOver) showProduct(handedOver);
    else setLoadStatus('loading');

    let cancelled = false;
    fetchProduct(buyNowProductId).then((product) => {
      if (cancelled) return;
      if (product) showProduct(product);
      // Only an error when there is nothing to show; a failed refresh keeps the handed-over product
      else if (!handedOver) setLoadStatus('error');
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyNowProductId, reloadKey]);

  // Cart checkout: wait until the cart has been read from storage before deciding it's empty
  useEffect(() => {
    if (buyNowProductId !== null || !isCartLoaded || isOrderPlaced.current) return;
    setCheckoutState({
      items: cartItems,
      totalItems,
      subtotal
    });
    setLoadStatus(cartItems.length > 0 ? 'ready' : 'empty');
  }, [buyNowProductId, isCartLoaded, cartItems, totalItems, subtotal]);

  // Fire checkout_started once, as soon as the checkout has items to show
  const hasTrackedCheckoutStart = useRef(false);
  useEffect(() => {
    if (hasTrackedCheckoutStart.current || checkoutState.items.length === 0) return;
    hasTrackedCheckoutStart.current = true;
    const isBuyNow = new URLSearchParams(window.location.search).has('productId');
    posthog.capture('checkout_started', {
      source: isBuyNow ? 'buy_now' : 'cart',
      value: checkoutState.subtotal,
      currency: 'MAD',
      total_items: checkoutState.totalItems,
      product_ids: checkoutState.items.map(item => String(item.product.id)),
    });
  }, [checkoutState]);

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
    shipping_price: DEFAULT_SHIPPING_PRICE,
    payment: {
      method: "At Delivery",
      status: "pending"
    },
    items: []
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  // Shown under each field after a submit attempt, cleared as soon as the field is edited
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CheckoutField, string>>>({});
  // Errors not tied to one field (empty order, failed request), shown above the submit button
  const [formError, setFormError] = useState<string>('');

  const updateField = (field: CheckoutField, patch: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...patch }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };
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
          // Recomputed from the city rather than restored, so a fee saved under old rates isn't reused
          shipping_price: getShippingPrice(parsedData.city || ''),
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
      updateField('phone_number', { phone_number: '' });
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
    updateField('phone_number', { phone_number: sanitized });
  };

  const handlesubmit = async () => {
    if (isSubmitting) return;

    const trackValidationError = (field: string) => {
      posthog.capture('checkout_validation_error', { field });
    };

    // Validate every field at once so the shopper sees all problems in one pass
    const errors: Partial<Record<CheckoutField, string>> = {};
    if (!formData.full_name.trim()) errors.full_name = t('checkout_err_name');
    if (!formData.shipping_address.trim()) errors.shipping_address = t('checkout_err_address');
    if (!formData.city.trim()) errors.city = t('checkout_err_city');
    if (!formData.phone_number.trim()) {
      errors.phone_number = t('checkout_err_phone');
    } else {
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
        trackValidationError('phone_number_format');
        errors.phone_number = t('checkout_err_invalid_phone');
      }
    }

    const invalidFields = CHECKOUT_FIELDS.filter(field => errors[field]);
    if (invalidFields.length > 0) {
      invalidFields.forEach(field => {
        // phone_number_format was already reported above with its own name
        if (field !== 'phone_number' || !formData.phone_number.trim()) trackValidationError(field);
      });
      setFieldErrors(errors);
      setFormError('');
      const firstInvalid = document.querySelector<HTMLElement>(`[data-checkout-field="${invalidFields[0]}"]`);
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
      return;
    }

    if (formData.items.length === 0) {
      trackValidationError('items');
      setFormError(t('checkout_err_empty'));
      return;
    }

    setFormError('');
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

    const orderValue = checkoutState.subtotal + formData.shipping_price;
    const productIds = checkoutState.items.map(item => String(item.product.id));

    try {
      await api.order.create(orderData);
      // Only report the purchase once the order is actually saved
      trackPurchase(orderValue, 'MAD', productIds);
      posthog.capture('order_completed', {
        value: orderValue,
        subtotal: checkoutState.subtotal,
        shipping_price: formData.shipping_price,
        currency: 'MAD',
        city: formData.city,
        total_items: checkoutState.totalItems,
        product_ids: productIds,
      });
      isOrderPlaced.current = true;
      clearCart();
      router.push('/?orderSuccess=true');
    } catch (error) {
      posthog.capture('order_failed', { value: orderValue });
      setIsSubmitting(false);
      setFormError(t('checkout_err_submit'));
    }
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
  }

  const navigateToHome = () => {
    router.push('/');
  }

  if (loadStatus === 'empty') {
    return (
      <div className="min-h-screen bg-primary px-6 py-16">
        <EmptyCartPage />
      </div>
    );
  }

  if (loadStatus === 'error') {
    return (
      <div className="min-h-screen bg-primary flex items-start justify-center px-6 py-16">
        <div role="alert" className="max-w-md w-full text-center space-y-6">
          <p className="text-lg">{t('checkout_err_load')}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setReloadKey((key) => key + 1)} className="complete_order_button">
              {t('checkout_try_again')}
            </Button>
            <Link
              href={`/products/${buyNowProductId}`}
              className="h-12 flex items-center justify-center rounded-sm border border-white/20 hover:bg-white/10 transition-colors">
              {t('checkout_back_to_product')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLoadingItems = loadStatus === 'loading';

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <OrderSummary
          totalItems={checkoutState.totalItems}
          subtotal={checkoutState.subtotal}
          shippingCost={formData.shipping_price}
          items={checkoutState.items}
          isLoading={isLoadingItems} />

        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-4 lg:h-fit p-6 pt-0 lg:pt-6 lg:border-r-2 lg:border-secondary lg:pr-12">
          {/* Delivery Section */}
          <div className="space-y-4">
            <h2 className="checkout_title">
              {t('checkout_delivery_title')}
            </h2>
            <div data-checkout-field="full_name">
              <CustomInput
                placeholder={t('checkout_full_name')}
                value={formData.full_name}
                onChange={(e) => updateField('full_name', { full_name: e.target.value })}
                type="text"
                invalid={Boolean(fieldErrors.full_name)}
              />
              <FieldError message={fieldErrors.full_name} />
            </div>

            <div data-checkout-field="shipping_address">
              <CustomInput
                placeholder={t('checkout_address')}
                value={formData.shipping_address}
                onChange={(e) => updateField('shipping_address', { shipping_address: e.target.value })}
                type="text"
                invalid={Boolean(fieldErrors.shipping_address)}
              />
              <FieldError message={fieldErrors.shipping_address} />
            </div>

            {/* City Selection Combobox */}
            <div data-checkout-field="city">
              <CitySelect
                value={formData.city}
                onChange={(cityItem: CityItem) => {
                  updateField('city', {
                    city: cityItem.name,
                    shipping_price: getShippingPrice(cityItem.name)
                  });
                }}
                placeholder={t('checkout_select_city')}
                searchPlaceholder={t('checkout_search_city')}
                invalid={Boolean(fieldErrors.city)}
              />
              <FieldError message={fieldErrors.city} />
            </div>

            <div data-checkout-field="phone_number">
              <CustomInput
                placeholder={t('checkout_phone')}
                value={formData.phone_number}
                onChange={handlePhoneChange}
                type="tel"
                invalid={Boolean(phoneError || fieldErrors.phone_number)}>
                <HoverInfo message={t('checkout_phone_info')} />
              </CustomInput>
              <FieldError message={phoneError || fieldErrors.phone_number} />
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
            {formError && (
              <p role="alert" className="text-red-500 text-sm font-medium">
                {formError}
              </p>
            )}
            <Button
              onClick={handlesubmit}
              disabled={isSubmitting || loadStatus !== 'ready'}
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
          items={checkoutState.items}
          isLoading={isLoadingItems} />
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
