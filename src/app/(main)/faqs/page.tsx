"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n-utils';
import { Search, ChevronDown, HelpCircle, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import styles from '@/styles/main.module.css';

interface FAQItem {
  id: string;
  category: 'orders' | 'shipping' | 'returns' | 'products';
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'orders',
    question: 'How do I place an order on HOTMIX?',
    answer: 'Simply browse our collection, select your desired size and color, click "Add to Cart", and proceed to checkout. You can easily complete your order using Cash on Delivery or Bank Transfer.'
  },
  {
    id: '2',
    category: 'orders',
    question: 'Can I modify or cancel my order after placing it?',
    answer: 'If you need to change your size or order details, please contact our WhatsApp customer support team as soon as possible before your package is dispatched.'
  },
  {
    id: '3',
    category: 'shipping',
    question: 'How long does shipping take in Morocco?',
    answer: 'Deliveries to Casablanca and nearby areas take between 24 to 48 hours. Deliveries to all other major Moroccan cities take between 2 to 4 business days.'
  },
  {
    id: '4',
    category: 'shipping',
    question: 'How much does delivery cost?',
    answer: 'Standard shipping fees are calculated at checkout depending on your location. We also periodically run free shipping promotions on orders above a specified threshold!'
  },
  {
    id: '5',
    category: 'returns',
    question: 'What is your return and exchange policy?',
    answer: 'We offer a 7-day return and exchange policy from the date you receive your order. Items must be unused, unwashed, and in their original packaging with all tags attached.'
  },
  {
    id: '6',
    category: 'returns',
    question: 'How do I exchange an item for a different size?',
    answer: 'Contact our WhatsApp support with your Order Number and desired size. Our delivery service will bring your new item and collect the return at your doorstep.'
  },
  {
    id: '7',
    category: 'products',
    question: 'How do I choose the correct size?',
    answer: 'Each product page includes detailed size guide measurements. Our designs are tailored for a comfortable, standard fit. Feel free to contact support for sizing advice!'
  },
  {
    id: '8',
    category: 'products',
    question: 'Are all products authentic HOTMIX items?',
    answer: 'Yes, 100%! All items are designed, crafted, and quality-inspected directly under the HOTMIX brand.'
  }
];

export default function FAQsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ '1': true });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 pt-4">
        <span className="text-greny text-sm font-semibold tracking-widest uppercase">
          {t('footer_faqs')}
        </span>
        <h1 className={styles.main_pages_title + " text-3xl sm:text-5xl font-bold"}>
          {t('faq_title')}
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
          {t('faq_subtitle')}
        </p>

        {/* Search Input */}
        <div className="max-w-xl mx-auto pt-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-4" />
            <Input
              type="text"
              placeholder={t('faq_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/90 border-gray-700 text-white pl-12 pr-4 py-6 rounded-full focus:border-greny focus:ring-1 focus:ring-greny rtl:pl-4 rtl:pr-12 text-base"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { id: 'all', label: 'All FAQs', icon: HelpCircle },
          { id: 'orders', label: 'Orders & Payment', icon: ShoppingBag },
          { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
          { id: 'returns', label: 'Returns & Exchange', icon: RotateCcw },
          { id: 'products', label: 'Products & Quality', icon: ShieldCheck }
        ].map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-greny text-primary font-bold shadow-md'
                  : 'bg-secondary/60 text-gray-300 hover:bg-secondary hover:text-white border border-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-secondary/70 border border-gray-800/80 rounded-2xl overflow-hidden transition-colors hover:border-greny/30"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left rtl:text-right flex items-center justify-between gap-4 font-semibold text-base sm:text-lg text-white"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-greny shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-gray-300 border-t border-gray-800/50 pt-4 leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-secondary/30 rounded-2xl border border-gray-800 text-gray-400">
            No questions matched your search query. Try another keyword or contact us!
          </div>
        )}
      </div>

      {/* Footer Support Prompt */}
      <div className="bg-secondary/50 border border-secondary p-8 rounded-2xl text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Still have questions?</h3>
        <p className="text-gray-300 text-sm max-w-md mx-auto">
          Can’t find the answer you’re looking for? Please contact our friendly customer service team.
        </p>
        <Link
          href="/contact-us"
          className="inline-block bg-greny text-primary font-semibold px-6 py-2.5 rounded-full hover:bg-white transition-colors text-sm"
        >
          {t('footer_contact_us')}
        </Link>
      </div>
    </div>
  );
}
