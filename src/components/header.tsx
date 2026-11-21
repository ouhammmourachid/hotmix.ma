

import { useTranslation } from '@/lib/i18n-utils';
import LanguageSwitcher from '@/components/language-switcher';

export default function Header() {
    const { t } = useTranslation();

    return (
      <div className="bg-secondary text-label">
        {/* 1fr / auto / 1fr keeps the promo optically centred whatever sits beside it */}
        <div className="container mx-auto h-9 px-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-footnote">
          <p className="hidden lg:block text-label-2 truncate">{t('welcome')}</p>
          <p className="col-start-2 text-center font-medium truncate">{t('promo')}</p>
          <div className="col-start-3 justify-self-end">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    )
}
