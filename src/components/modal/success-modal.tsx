import React, { useRef } from 'react';
import ModalLayout from './modal-layout';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n-utils';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  onButtonClick
}: SuccessModalProps) {
  const modalRef = useRef(null);
  const { t } = useTranslation();

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      modalRef={modalRef}
      modalId="success-modal"
    >
      <div
        ref={modalRef}
        className="bg-primary border-2 border-greny rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all"
      >
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-greny"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {/* Content */}
          <h3 className="text-2xl font-bold text-whity mb-2">
            {t(title)}
          </h3>
          <p className="text-whity/80 mb-6">
            {t(message)}
          </p>

          {/* Action Button */}
          <Button
            onClick={onButtonClick}
            className="w-full bg-greny hover:bg-greny/90 text-primary font-medium py-2 px-4 rounded-md"
          >
            {t(buttonText)}
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}