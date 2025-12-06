import React, { useState, useEffect } from 'react';
import { STATIC_QUOTES } from '../constants';
import { Quote } from '../types';

const InsightCard: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [opacity, setOpacity] = useState('opacity-0');

  const pickRandomQuote = () => {
    setOpacity('opacity-0');
    setTimeout(() => {
      const random = STATIC_QUOTES[Math.floor(Math.random() * STATIC_QUOTES.length)];
      setQuote(random);
      setOpacity('opacity-100');
    }, 500);
  };

  useEffect(() => {
    pickRandomQuote();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full px-4 sm:px-6 animate-fade-in py-6 sm:py-8 md:py-12 overflow-y-auto">
      <div className="relative max-w-xl w-full">
        {/* Decorative elements */}
        <div className="absolute -top-6 sm:-top-10 -left-6 sm:-left-10 text-6xl sm:text-8xl md:text-9xl text-morandi-green/10 font-serif">"</div>
        <div className="absolute -bottom-12 sm:-bottom-20 -right-6 sm:-right-10 text-6xl sm:text-8xl md:text-9xl text-morandi-green/10 font-serif">"</div>

        <div className={`relative bg-white/60 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 text-center transition-opacity duration-1000 ${opacity} overflow-y-auto`}>
          {quote && (
            <>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-morandi-charcoal font-light leading-relaxed mb-6 sm:mb-8 font-sans">
                {quote.text}
              </p>
              <div className="w-12 sm:w-16 h-1 bg-morandi-green/40 mx-auto mb-4 sm:mb-6"></div>
              <p className="text-morandi-charcoal/60 uppercase tracking-widest text-xs sm:text-sm">
                — {quote.author}
              </p>
            </>
          )}
        </div>
      </div>

      <button
        onClick={pickRandomQuote}
        className="mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6 py-2 text-xs sm:text-sm text-morandi-charcoal/50 hover:text-morandi-charcoal border-b border-transparent hover:border-morandi-charcoal/30 transition-all"
      >
        抽取下一張籤詩
      </button>
    </div>
  );
};

export default InsightCard;
