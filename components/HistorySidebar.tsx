import React from 'react';
import { TranslationHistoryItem } from '../types';
import { Clock, Trash2, ArrowRight } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../constants';

interface HistorySidebarProps {
  history: TranslationHistoryItem[];
  onSelect: (item: TranslationHistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex items-center space-x-2 text-gray-700">
          <Clock size={18} />
          <h2 className="font-semibold">History</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm">
            No recent translations.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="group bg-white border border-gray-100 rounded-lg p-3 hover:shadow-md cursor-pointer transition-all hover:border-blue-200"
            >
              <div className="flex items-center text-xs text-gray-500 mb-2 space-x-1">
                <span>{LANGUAGE_OPTIONS[item.sourceLang].label}</span>
                <ArrowRight size={10} />
                <span>{LANGUAGE_OPTIONS[item.targetLang].label}</span>
              </div>
              <p className="text-sm text-gray-800 line-clamp-2 mb-1 font-medium">{item.original}</p>
              <p className="text-sm text-gray-500 line-clamp-2">{item.translated}</p>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClear}
            className="w-full flex items-center justify-center space-x-2 text-red-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        </div>
      )}
    </div>
  );
};