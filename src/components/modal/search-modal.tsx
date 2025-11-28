import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { XButton } from "@/components/small-pieces";
import ModalLayout from '@/components/modal/modal-layout';
import styles from '@/styles/modal.module.css';
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useApiService } from '@/services/api.service';
import SearchResults from "@/components/search/search-results";
import SearchResultsLoading from "@/components/search/search-loading";
import SearchResultsEmpty from "@/components/search/search-result-empty";
import { useTranslation } from '@/lib/i18n-utils';

export default function SearchModal({ isOpen, onClose }: Readonly<{ isOpen: boolean, onClose: () => void }>) {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApiService();
  const animationConfig = {
    initial: { y: -600, opacity: 1 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -800, opacity: 1 },
  };

  const transitionConfig = {
    enter: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.5
    },
    exit: {
      duration: 0.5
    }
  };
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery.trim().replace(/\s+/g, "+"));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Make API call to your backend
      const response = await api.product.getAll(`q=${query}&page_size=30`);
      setSearchResults(response.data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleClickLink = () => {
    onClose();
    setSearchQuery("");
  };
  // Add handler for Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Close the modal 
      onClose();
      // Redirect to search page with query parameter
      const formattedQuery = searchQuery.trim().replace(/\s+/g, "+");
      window.location.href = `/search?q=${formattedQuery}`;
    }
  };
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      modalRef={modalRef}
      modalId="search-modal"
      className={styles.search_modal}>
      <motion.div
        {...animationConfig}
        transition={isOpen ? transitionConfig.enter : transitionConfig.exit}
        ref={modalRef}
        className={styles.search}>
        <XButton
          onClick={onClose}
          className="p-2 text-white hover:text-greny rounded-full transition-colors" />
        <div className="flex items-center justify-center h-full mt-6">
          <div className="text-center max-w-full">
            {/* Header */}
            <h2 className={styles.search_header}>
              {t('search_modal_title')}
            </h2>
            {/* Search Input */}
            <div className="relative flex justify-center">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('search_input_placeholder')}
                className={styles.search_input}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {searchQuery &&
                <X
                  size={16}
                  onClick={() => setSearchQuery("")}
                  className='absolute right-2 top-1/3 text-black/80 ' />}
            </div>
            {isLoading && (
              <SearchResultsLoading />
            )}
            {!isLoading && !error && searchQuery.trim().length > 2 && searchResults.length === 0 && (
              <SearchResultsEmpty />
            )}
            {!isLoading && !error && searchResults.length > 0 && (
              <SearchResults
                query={searchQuery}
                onClickLink={handleClickLink}
                results={searchResults} />
            )}
          </div>
        </div>
      </motion.div>
    </ModalLayout>
  );
}
