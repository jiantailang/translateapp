import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, LanguageOption } from '../types';
import { LANGUAGE_OPTIONS } from '../constants';
import { ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  selected: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
  options: SupportedLanguage[]; // Subset of options to show (e.g. source vs target)
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = LANGUAGE_OPTIONS[selected];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100"
      >
        <span>{selectedOption.label}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((langKey) => {
            const option = LANGUAGE_OPTIONS[langKey];
            const isSelected = selected === langKey;
            return (
              <button
                key={langKey}
                onClick={() => {
                  onChange(langKey);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-3 transition-colors
                  ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-lg">{option.flag}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};