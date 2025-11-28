import {Button} from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import styles from '@/styles/main.module.css';
import {motion} from 'framer-motion';
import { useTranslation } from '@/lib/i18n-utils';

export default function HeroSection() {
    const { t } = useTranslation();
    
    return (
        <div className="relative h-[900px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://dxlr-eg.com/cdn/shop/files/DSC04279.jpg?v=1734952029&width=3504"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className={styles.hero_section_content}>
          <div className="text-center space-y-8">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}>
              <h1 className="text-6xl font-bold">
                {t('hero_title')}
              </h1>
            </motion.div>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <Button className={styles.hero_section_button}>
                {t('hero_shop_now')} <ArrowUpRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    )
}
