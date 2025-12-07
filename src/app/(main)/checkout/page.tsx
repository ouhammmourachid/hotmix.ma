"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  HoverInfo,
  CustomInput
} from '@/components/small-pieces';
import CollapsibleBankTransfer from '@/components/payment/bank-transfer';
import { OrderSummarySide, OrderSummary } from './checkout-item';
import { useCart } from '@/contexts/cart-context';
import CartItem from '@/types/cart-item';
import { useApiService } from '@/services/api.service';
import Size from '@/types/size';
import SuccessModal from '@/components/modal/success-modal';
import { useTranslation } from '@/lib/i18n-utils';

export default function CheckoutForm() {

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
      // Replace with your actual API endpoint
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
      const quantity = parseInt(urlParams.get('quantity') || '1');

      if (productId) {
        try {
          const product = await fetchProduct(productId);
          const size = product?.sizes?.find((size: Size) => size.id === sizeId);

          if (product) {
            const price = product.sale_price || product.price;
            setCheckoutState({
              items: [{
                id: Date.now(),
                product,
                size,
                quantity: quantity,
                price
              }],
              totalItems: 1,
              subtotal: price
            });
          }
        } catch (error) {
          console.error("Error loading product:", error);
        }
      } else {
        // Update with cart context when params are removed
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
    payment: {
      method: string;
      status: "pending" | "completed" | "failed";
    };
    items: { product: string; size?: string; quantity: number }[];
  }>({
    full_name: '',
    shipping_address: '',
    phone_number: '',
    payment: {
      method: "At Delivery",
      status: "pending"
    },
    items: [] // Initialize as empty array
  });

  const [isLoaded, setIsLoaded] = useState(false);

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
          // We don't restore payment method as it might be sensitive or context-dependent, 
          // but user asked for payment data too. Let's restore method if available.
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
      paymentMethod: formData.payment.method
    };
    localStorage.setItem('checkoutFormData', JSON.stringify(dataToSave));
  }, [formData.full_name, formData.shipping_address, formData.phone_number, formData.payment.method, isLoaded]);

  // Update formData.items whenever checkoutState.items changes
  useEffect(() => {
    if (checkoutState.items.length > 0) {
      setFormData(prevFormData => ({
        ...prevFormData,
        items: checkoutState.items.map(item => ({
          product: String(item.product.id),
          size: item.size?.id ? String(item.size.id) : undefined,
          quantity: item.quantity
        }))
      }));
    }
  }, [checkoutState.items]);

  const handleClickPaymentChoice = () => {
    setFormData({ ...formData, payment: { ...formData.payment, method: "At Delivery" } });
  }

  const handlesubmit = async () => {
    // Validate form data
    if (!formData.full_name.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!formData.shipping_address.trim()) {
      alert('Please enter your shipping address');
      return;
    }
    if (!formData.phone_number.trim()) {
      alert('Please enter your phone number');
      return;
    }
    if (formData.items.length === 0) {
      alert('Your order is empty');
      return;
    }

    try {
      await api.order.create(formData);
      // Clear cart and redirect to home page with success parameter
      clearCart();
      // Redirect to home page with success parameter
      window.location.href = '/?orderSuccess=true';
    } catch (error) {
      alert('There was a problem submitting your order. Please try again.');
    }
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
  }

  const navigateToHome = () => {
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <OrderSummary
          totalItems={checkoutState.totalItems}
          subtotal={checkoutState.subtotal}
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
              type="text" />
            <CustomInput
              placeholder={t('checkout_phone')}
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              type="text">
              <HoverInfo message={t('checkout_phone_info')} />
            </CustomInput>
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
              <CollapsibleBankTransfer
                isOpen={formData.payment.method === 'Bank Transfer'}
                formData={formData}
                setFormData={setFormData}
                first
              />
              <div
                onClick={handleClickPaymentChoice}
                className={`flex pr-4 gap-3 p-4 rounded-b-md cursor-pointer border-2 border-${formData.payment.method == 'At Delivery' ? 'greny' : 'secondary'}`}>
                <input
                  className="checkout_radio"
                  checked={formData.payment.method === 'At Delivery'}
                  type="radio"
                  name="payment"
                  value="At Delivery"
                  readOnly />
                <span>{t('checkout_cash_on_delivery')}</span>
              </div>
            </div>
            <Button
              onClick={handlesubmit}
              className="complete_order_button">
              {t('checkout_complete_order')}
            </Button>
          </div>
        </div>

        <OrderSummarySide
          totalItems={checkoutState.totalItems}
          subtotal={checkoutState.subtotal}
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
