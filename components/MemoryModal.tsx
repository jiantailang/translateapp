import React, { useState, useEffect } from 'react';
import { X, Save, Brain, Info } from 'lucide-react';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: string;
  onSave: (rules: string) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose, rules, onSave }) => {
  const [localRules, setLocalRules] = useState(rules);

  useEffect(() => {
    setLocalRules(rules);
  }, [rules, isOpen]);

  const handleSave = () => {
    onSave(localRules);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all flex flex-col max-h-[90vh] z-50 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 text-blue-600">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Translation Memory</h2>
              <p className="text-xs text-gray-500 font-medium">Teach the AI your preferences</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800 space-y-1">
              <p className="font-semibold">How to use:</p>
              <p>Enter specific rules, terminology, or style guides here. The AI will apply these instructions to every translation.</p>
              <ul className="list-disc list-inside opacity-80 mt-1 pl-1 space-y-1 text-xs">
                <li>Always translate "Company X" as "X社"</li>
                <li>Use a formal, business-appropriate tone</li>
                <li>Never use contractions</li>
              </ul>
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Rules & Terminology
          </label>
          <textarea
            value={localRules}
            onChange={(e) => setLocalRules(e.target.value)}
            placeholder="e.g.&#10;1. Translate 'Stakeholder' as '利害関係者'&#10;2. Keep the tone polite (Desu/Masu form)&#10;3. Do not translate product names."
            className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-base leading-relaxed bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center space-x-2 transition-all transform active:scale-95"
          >
            <Save size={18} />
            <span>Save Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};