import React, { createContext, useContext, useState } from 'react';

type FilterContextType = {
  isFilterOpen: boolean;
  filterState: any;
  setIsFilterOpen: (isOpen: boolean) => void;
  setFilterState: (state: any) => void;
  toString: () => string;
  isFilterEmpty: () => boolean;
  setFilterStateWithUrl: (searchParams:any) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<{
    sizes: number[];
    colors: number[];
    tags: number[];
    category: number | null;
    searchQuery: string | null;
  }>({
    sizes: [],
    colors: [],
    tags: [],
    category: null,
    searchQuery: null,
  });
  const toString = () => {
    let filter = "";
    if (filterState.sizes.length > 0) {
      filter += `sizes=${filterState.sizes.join(',')}&`;
    }
    if (filterState.colors.length > 0) {
      filter += `colors=${filterState.colors.join(',')}&`;
    }
    if (filterState.tags.length > 0) {
      filter += `tags=${filterState.tags.join(',')}&`;
    }
    if (filterState.category) {
      filter += `category=${filterState.category}&`;
    }
    if (filterState.searchQuery) {
      filter += `q=${filterState.searchQuery}&`;
    }
    return filter.slice(0, -1);
  }
  const isFilterEmpty = () => {
    return filterState.sizes.length === 0 && filterState.colors.length === 0 && filterState.tags.length === 0 && !filterState.category;
  }
  const setFilterStateWithUrl = (searchParams:any) => {
    const sizesParam = searchParams.getAll('sizes')[0];
    const sizes = sizesParam ? sizesParam.split(',').map((num:string) => parseInt(num, 10)) : [];

    // Handle colors parameter
    const colorsParam = searchParams.getAll('colors')[0];
    const colors = colorsParam ? colorsParam.split(',').map((num:string) => parseInt(num, 10)) : [];

    // Handle tags parameter
    const tagsParam = searchParams.getAll('tags')[0];
    const tags = tagsParam ? tagsParam.split(',').map((num:string) => parseInt(num, 10)) : [];

    // Handle category parameter
    const categoryParam = searchParams.get('category');
    const category = categoryParam ? parseInt(categoryParam, 10) : null;

    // Handle search query parameter
    const searchQueryParam = searchParams.get('q');
    const searchQuery = searchQueryParam ? searchQueryParam : null;

    setFilterState({
      sizes,
      colors,
      tags,
      category,
      searchQuery
    });
  }
  return (
    <FilterContext.Provider value={{
                      isFilterOpen,
                      filterState,
                      setIsFilterOpen,
                      setFilterState,
                      toString,
                      isFilterEmpty,
                      setFilterStateWithUrl
                      }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
