import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SupportedLanguage, TranslationHistoryItem } from './types';
import { LANGUAGE_OPTIONS } from './constants';
import { streamTranslation } from './services/geminiService';
import { LanguageSelector } from './components/LanguageSelector';
import { HistorySidebar } from './components/HistorySidebar';
import { MemoryModal } from './components/MemoryModal';
import { ArrowRightLeft, Copy, Check, History, Sparkles, X, Brain } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState<SupportedLanguage>(SupportedLanguage.AUTO);
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(SupportedLanguage.EN);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // UI State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  
  const [history, setHistory] = useState<TranslationHistoryItem[]>(() => {
    const saved = localStorage.getItem('translation_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [customRules, setCustomRules] = useState<string>(() => {
    return localStorage.getItem('translation_rules') || '';
  });

  const [error, setError] = useState<string | null>(null);
  
  // Copy feedback state
  const [sourceCopied, setSourceCopied] = useState(false);
  const [targetCopied, setTargetCopied] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('translation_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('translation_rules', customRules);
  }, [customRules]);

  // Handlers
  const handleSwapLanguages = () => {
    if (sourceLang === SupportedLanguage.AUTO) {
       // Cannot swap if auto. Set source to current target, target to EN (default fallback)
       setSourceLang(targetLang);
       setTargetLang(SupportedLanguage.EN);
    } else {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
    }
    // Swap text too if there is a result
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText(sourceText); 
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setError(null);
    setTranslatedText(''); // Clear previous
    
    // Create history item draft
    const historyId = Date.now().toString();

    try {
      const targetLangName = LANGUAGE_OPTIONS[targetLang].apiName;
      
      const finalTranslation = await streamTranslation(
        sourceText, 
        targetLangName, 
        customRules,
        (chunk) => {
          setTranslatedText(chunk);
        }
      );

      // Add to history after completion
      const newItem: TranslationHistoryItem = {
        id: historyId,
        sourceLang,
        targetLang,
        original: sourceText,
        translated: finalTranslation,
        timestamp: Date.now(),
      };

      setHistory((prev) => [newItem, ...prev].slice(0, 50)); // Keep last 50

    } catch (err: any) {
      setError(err.message || "An error occurred during translation.");
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async (text: string, isSource: boolean) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (isSource) {
        setSourceCopied(true);
        setTimeout(() => setSourceCopied(false), 2000);
      } else {
        setTargetCopied(true);
        setTimeout(() => setTargetCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleHistorySelect = (item: TranslationHistoryItem) => {
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setSourceText(item.original);
    setTranslatedText(item.translated);
    setHistoryOpen(false);
  };

  const clearSource = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:inline">ProTranslate <span className="text-blue-600">AI</span></span>
            <span className="font-bold text-xl tracking-tight text-gray-900 sm:hidden">ProTranslate</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setMemoryOpen(true)}
              className={`p-2 rounded-full transition-colors relative group border border-transparent
                ${customRules.trim() ? 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100' : 'text-gray-500 hover:bg-gray-100'}
              `}
              title="Translation Memory & Rules"
            >
              <Brain size={20} />
              {customRules.trim() && (
                 <span className="absolute top-1.5 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>

            <button 
              onClick={() => setHistoryOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
              title="History"
            >
              <History size={20} />
              {history.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        
        {/* Controls */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between p-2 md:p-4 gap-4 z-20">
          
          <div className="flex-1 w-full md:w-auto flex justify-start">
            <LanguageSelector 
              selected={sourceLang} 
              onChange={setSourceLang} 
              options={[SupportedLanguage.AUTO, SupportedLanguage.EN, SupportedLanguage.JA, SupportedLanguage.ZH_CN, SupportedLanguage.ZH_TW]} 
            />
          </div>

          <button 
            onClick={handleSwapLanguages}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ArrowRightLeft size={20} />
          </button>

          <div className="flex-1 w-full md:w-auto flex justify-end">
             <LanguageSelector 
              selected={targetLang} 
              onChange={setTargetLang} 
              options={[SupportedLanguage.EN, SupportedLanguage.JA, SupportedLanguage.ZH_CN, SupportedLanguage.ZH_TW]} 
            />
          </div>
        </div>

        {/* Translation Area */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-lg rounded-b-xl overflow-hidden bg-white min-h-[500px] border-x border-b border-gray-200">
          
          {/* Source Input */}
          <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-gray-100 relative group">
            <div className="flex-1 relative">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Type to translate..."
                className="w-full h-full p-6 text-lg md:text-xl text-gray-800 bg-white resize-none outline-none placeholder-gray-300 leading-relaxed"
                spellCheck={false}
              />
              {sourceText && (
                <button 
                  onClick={clearSource}
                  className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 p-1"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            <div className="h-12 border-t border-gray-50 flex items-center justify-between px-4 bg-white">
              {sourceText && (
                 <button 
                 onClick={() => copyToClipboard(sourceText, true)}
                 className="text-gray-400 hover:text-gray-600 flex items-center space-x-1 text-xs font-medium uppercase tracking-wider"
               >
                 {sourceCopied ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
               </button>
              )}
              {/* Character count or tools could go here */}
              <span className="text-xs text-gray-300">{sourceText.length} chars</span>
            </div>
          </div>

          {/* Target Output */}
          <div className="flex-1 flex flex-col bg-[#F9FAFB] relative group">
            <div className="flex-1 relative">
              {isTranslating && !translatedText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              )}
              
              <textarea
                readOnly
                value={translatedText}
                placeholder={isTranslating ? "Translating..." : "Translation"}
                className="w-full h-full p-6 text-lg md:text-xl text-gray-800 bg-[#F9FAFB] resize-none outline-none leading-relaxed"
              />
            </div>

            <div className="h-12 border-t border-gray-100 flex items-center justify-between px-4 bg-[#F9FAFB]">
              {translatedText && (
                <button 
                  onClick={() => copyToClipboard(translatedText, false)}
                  className="text-gray-400 hover:text-gray-600 flex items-center space-x-1 text-xs font-medium uppercase tracking-wider"
                >
                  {targetCopied ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
                </button>
              )}
              {isTranslating && <span className="text-xs text-blue-500 font-medium animate-pulse">Translating...</span>}
            </div>
          </div>
        </div>

        {/* Translate Action (Sticky/Floating for mobile ease) */}
        <div className="mt-6 md:mt-8 w-full max-w-5xl flex justify-end">
           <button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className={`
              px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/30
              transition-all transform active:scale-95 flex items-center space-x-2
              ${!sourceText.trim() || isTranslating 
                ? 'bg-blue-300 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5'
              }
            `}
           >
             <Sparkles size={20} className={isTranslating ? "animate-spin" : ""} />
             <span>{isTranslating ? 'Translating' : 'Translate'}</span>
           </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 max-w-xl text-center shadow-sm text-sm">
            {error}
          </div>
        )}

        <div className="mt-12 text-center text-gray-400 text-sm max-w-2xl">
          <p>Professional AI-powered translation for English, Japanese, and Chinese.</p>
          <p className="mt-1 text-xs opacity-70">Context-aware • Nuance-preserving • Secure</p>
        </div>

      </main>

      {/* Modals */}
      <HistorySidebar 
        isOpen={historyOpen} 
        onClose={() => setHistoryOpen(false)} 
        history={history}
        onSelect={handleHistorySelect}
        onClear={() => setHistory([])}
      />
      
      <MemoryModal
        isOpen={memoryOpen}
        onClose={() => setMemoryOpen(false)}
        rules={customRules}
        onSave={setCustomRules}
      />

      {/* Overlay for History (Memory has its own) */}
      {historyOpen && (
        <div 
          onClick={() => setHistoryOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
        />
      )}

    </div>
  );
};

export default App;