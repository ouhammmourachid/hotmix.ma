import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import styles from '@/styles/main.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n-utils';
import Link from 'next/link';

const BANNERS = [
  {
    desktop: '/banner-16-9.png',
    mobile: '/banner-9-16.png',
    alt: 'Hotmix Hero Banner 1',
  },
  {
    desktop: '/banner-2-16-9.png',
    mobile: '/banner-2-9-16.png',
    alt: 'Hotmix Hero Banner 2',
  },
];

export default function HeroSection() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNERS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[600px] md:h-[900px] overflow-hidden">
      {/* Background Image Carousel with Fade Transition */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <picture className="w-full h-full block">
              <source media="(max-width: 767px)" srcSet={BANNERS[currentIndex].mobile} />
              <source media="(min-width: 768px)" srcSet={BANNERS[currentIndex].desktop} />
              <img
                src={BANNERS[currentIndex].desktop}
                alt={BANNERS[currentIndex].alt}
                className="w-full h-full object-cover"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className={`${styles.hero_section_content} pointer-events-none`}>
        <div className="text-center space-y-8 pointer-events-auto">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <Link href="/products">
              <Button className={styles.hero_section_button}>
                {t('hero_shop_now')} <ArrowUpRight className="w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
