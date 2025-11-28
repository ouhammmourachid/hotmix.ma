
import React, { useEffect, useState, useRef } from 'react';
import { XCursor } from '@/components/small-pieces';
import { AnimatePresence, motion } from 'framer-motion';

// Modal manager to track open modals
class ModalManager {
  private static instance: ModalManager;
  private openModals: Set<string> = new Set();
  private modalStack: string[] = [];

  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  addModal(modalId: string): void {
    this.openModals.add(modalId);
    // Remove from stack if already exists and add to top
    this.modalStack = this.modalStack.filter(id => id !== modalId);
    this.modalStack.push(modalId);
  }

  removeModal(modalId: string): void {
    this.openModals.delete(modalId);
    this.modalStack = this.modalStack.filter(id => id !== modalId);
  }

  getTopModal(): string | null {
    return this.modalStack.length > 0 ? this.modalStack[this.modalStack.length - 1] : null;
  }

  isTopModal(modalId: string): boolean {
    return this.getTopModal() === modalId;
  }

  hasModals(): boolean {
    return this.openModals.size > 0;
  }

  getAllModals(): string[] {
    return Array.from(this.openModals);
  }
}

export default function ModalLayout({
  isOpen,
  onClose,
  children,
  className,
  cursorPadding,
  modalRef,
  modalId = 'default'
}: {
  isOpen: boolean,
  onClose: () => any,
  children: React.ReactNode,
  className: string,
  modalRef: React.MutableRefObject<any>
  cursorPadding?: number,
  modalId?: string
}) {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const modalManager = useRef(ModalManager.getInstance());

  // Register/unregister modal with manager
  useEffect(() => {
    if (isOpen) {
      modalManager.current.addModal(modalId);
    } else {
      modalManager.current.removeModal(modalId);
    }

    return () => {
      modalManager.current.removeModal(modalId);
    };
  }, [isOpen, modalId]);
  useEffect(() => {
    const nav = document.querySelector('.navigation') as HTMLElement;
    const stickyProduct = document.querySelector('.sticky-product-footer') as HTMLElement;
    const ButtomNav = document.querySelector('.bottom-nav') as HTMLElement;
    if (isOpen) {
      nav.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth + 10}px`;
      if (stickyProduct) stickyProduct.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      if (ButtomNav) ButtomNav.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth + 15}px`;
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      nav.style.paddingRight = "10px";
      if (stickyProduct) stickyProduct.style.paddingRight = "0px";
      if (ButtomNav) ButtomNav.style.paddingRight = "15px";
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  useEffect(() => {
    const handleMouseMove = (e: any) => {
      if (!modalRef.current) return;

      const rect = modalRef.current.getBoundingClientRect();
      const isInsideModal = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );

      setMousePosition({ x: e.clientX, y: e.clientY - (cursorPadding || 0) });
      setShowCursor(!isInsideModal);

      // Only hide the default cursor when outside the modal
      document.body.style.cursor = isInsideModal ? 'auto' : 'none';
    };

    const handleMouseLeave = () => {
      setShowCursor(false);
      document.body.style.cursor = 'auto';
    };

    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only handle clicks if this is the top modal
      if (!modalManager.current.isTopModal(modalId)) {
        return;
      }

      // Check if the clicked element is an X button or inside an X button
      const target = event.target as HTMLElement;
      if (target) {
        // Check if it's a button with X icon or SVG inside
        const button = target.closest('button');
        if (button) {
          // Check if button contains X icon (SVG) or has X-related classes
          const hasSvg = button.querySelector('svg');
          const hasXClass = button.className.includes('x-button') ||
            button.className.includes('close') ||
            button.getAttribute('data-close') === 'true';

          if (hasSvg || hasXClass) {
            return; // Don't close if clicking X button - let the button handle it
          }
        }
      }

      // Check if the click is outside the modal content
      if (modalRef.current && event.target && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Use capture phase to handle the event before other handlers
      document.addEventListener('mousedown', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClose, modalId]);

  // if (!isOpen) return null;

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <motion.div
          className={className}
          data-modal-id={modalId}
          style={{ zIndex: 1000 + modalManager.current.getAllModals().indexOf(modalId) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <XCursor
            mousePosition={mousePosition}
            show={showCursor}
          />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
