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
    <div className="flex flex-col items-center justify-center h-full w-full px-6 animate-fade-in">
      <div className="relative max-w-xl w-full">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 text-9xl text-morandi-green/10 font-serif">"</div>
        <div className="absolute -bottom-20 -right-10 text-9xl text-morandi-green/10 font-serif">"</div>

        <div className={`relative bg-white/60 backdrop-blur-md p-12 rounded-3xl shadow-xl border border-white/50 text-center transition-opacity duration-1000 ${opacity}`}>
          {quote && (
            <>
              <p className="text-2xl md:text-3xl text-morandi-charcoal font-light leading-relaxed mb-8 font-sans">
                {quote.text}
              </p>
              <div className="w-16 h-1 bg-morandi-green/40 mx-auto mb-6"></div>
              <p className="text-morandi-charcoal/60 uppercase tracking-widest text-sm">
                — {quote.author}
              </p>
            </>
          )}
        </div>
      </div>

      <button
        onClick={pickRandomQuote}
        className="mt-16 px-6 py-2 text-sm text-morandi-charcoal/50 hover:text-morandi-charcoal border-b border-transparent hover:border-morandi-charcoal/30 transition-all"
      >
        抽取下一張籤詩
      </button>
    </div>
  );
};

export default InsightCard;
