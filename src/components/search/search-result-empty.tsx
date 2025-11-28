import { SearchX } from 'lucide-react';
import styles from '@/styles/search.module.css';
import { useTranslation } from '@/lib/i18n-utils';

export default function SearchResultsEmpty(){
  const { t } = useTranslation();
    
  return (
    <div className={styles.search_result_empty}>
      <SearchX size={40}/>
      <span>{t('search_empty_state')}</span>
    </div>
  )
}
