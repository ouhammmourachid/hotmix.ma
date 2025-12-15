"use client";
import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/hero-section';
import NewCollection from '@/components/new-collection';
import SuccessModal from '@/components/modal/success-modal';

const Homepage = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    // Check URL parameters for order success flag
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('orderSuccess') === 'true') {
      setIsSuccessModalOpen(true);
      // Remove the parameter from URL to prevent modal from showing on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
  };

  const handleContinueShopping = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <HeroSection />
      <NewCollection />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="order_success_title"
        message="order_success_message"
        buttonText="order_continue_shopping"
        onButtonClick={handleContinueShopping}
      />
    </>
  );
};

export default Homepage;
