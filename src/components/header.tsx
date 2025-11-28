

import { useTranslation } from '@/lib/i18n-utils';
// Import LanguageSwitcher but it won't be used yet
import LanguageSwitcher from '@/components/language-switcher';

export default function Header() {
    const { t } = useTranslation();
    
    return  (
        <div className="bg-secondary py-2 px-4 ">
        <div className="container mx-auto flex justify-between items-center">
          <p className="hidden lg:flex">{t('welcome')}</p>
          <p className="flex items-center justify-center w-full lg:w-fit">{t('promo')}</p>
          <div className="items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    )
}
