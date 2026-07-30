"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, MapPin, Check, X } from 'lucide-react';
import citiesData from '@/data/cities.json';

export interface CityItem {
  id: number;
  name: string;
  delivering_price: number;
  return_price?: number;
  deliv_period?: string;
  logo?: string;
}

interface CitySelectProps {
  value: string;
  onChange: (city: CityItem) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export function CitySelect({
  value,
  onChange,
  placeholder = "Sélectionnez votre ville",
  searchPlaceholder = "Rechercher une ville...",
  className = "",
}: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cities: CityItem[] = citiesData as CityItem[];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedCity = cities.find(
    (c) => c.name.toLowerCase() === value?.toLowerCase()
  );

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (city: CityItem) => {
    onChange(city);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ id: 0, name: "", delivering_price: 0 });
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Trigger Box matching checkout_input_with_icon */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="checkout_input_with_icon cursor-pointer select-none items-center justify-between min-h-[50px] px-3 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <MapPin size={18} className="text-gray-400 shrink-0" />
          {selectedCity ? (
            <div className="flex items-center justify-between w-full pr-2 overflow-hidden">
              <span className="text-white font-medium truncate">{selectedCity.name}</span>
              <span className="text-xs bg-greny/20 text-greny border border-greny/40 px-2 py-0.5 rounded-full shrink-0 font-semibold ml-2">
                +{selectedCity.delivering_price} DH
              </span>
            </div>
          ) : value ? (
            <span className="text-white font-medium truncate">{value}</span>
          ) : (
            <span className="text-gray-400 truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-red-400 text-gray-400 transition-colors"
              title="Clear selection"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-[#002f35] border border-gray-600 rounded-md shadow-xl overflow-hidden max-h-72 flex flex-col">
          {/* Search Header */}
          <div className="p-2 border-b border-gray-700/80 bg-[#00252a] sticky top-0 z-10 flex items-center gap-2">
            <Search size={16} className="text-gray-400 ml-1 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-500 py-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* City Options List */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-800/40">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => {
                const isSelected =
                  value?.toLowerCase() === city.name.toLowerCase();
                return (
                  <div
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-greny/20 text-white font-medium"
                        : "text-gray-200 hover:bg-[#003d45]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected && <Check size={16} className="text-greny shrink-0" />}
                      <span>{city.name}</span>
                      {city.deliv_period && (
                        <span className="text-[10px] text-gray-400 border border-gray-700 px-1 rounded">
                          {city.deliv_period}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-greny bg-[#004750] px-2 py-0.5 rounded">
                      {city.delivering_price} DH
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-gray-400">
                Aucune ville trouvée
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
