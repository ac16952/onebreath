import React, { useState } from 'react';
import { SOUND_TRACKS } from '../constants';
import { audioGenerator } from '../services/audioService';

const SoundTherapy: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const handlePlay = (id: string, type: 'brown' | 'pink' | 'white') => {
    if (activeSound === id) {
      audioGenerator.stop();
      setActiveSound(null);
    } else {
      audioGenerator.playNoise(type);
      setActiveSound(id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full max-w-2xl mx-auto px-4 sm:px-6 animate-fade-in py-4 sm:py-6 md:py-8 overflow-y-auto">
      <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-light text-morandi-charcoal tracking-widest">聽覺療癒</h2>
        <p className="text-morandi-charcoal/60 text-xs sm:text-sm">使用生成式白噪音遮蔽環境干擾</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full">
        {SOUND_TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => handlePlay(track.id, track.type)}
            className={`
              relative overflow-auto group rounded-2xl p-4 sm:p-6 h-40 sm:h-48 flex flex-col items-center justify-center space-y-3 sm:space-y-4 transition-all duration-500
              ${activeSound === track.id ? 'shadow-inner scale-95 ring-2 ring-morandi-charcoal/10' : 'shadow-lg hover:-translate-y-1'}
              ${track.color}
            `}
          >
            {/* Animated Background overlay when active */}
            {activeSound === track.id && (
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            )}

            <div className={`p-4 rounded-full bg-white/30 backdrop-blur-sm text-3xl transition-transform duration-700 ${activeSound === track.id ? 'animate-spin-slow' : 'group-hover:scale-110'}`}>
              {activeSound === track.id ? '⏸' : '▶'}
            </div>
            
            <span className="font-medium text-morandi-charcoal/90 tracking-wide z-10">
              {track.name}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 bg-white/40 rounded-xl max-w-lg text-center backdrop-blur-sm border border-white/30">
        <p className="text-xs sm:text-sm text-morandi-charcoal/70 leading-relaxed">
          我們使用 Web Audio API 即時生成音訊。粉紅噪音模擬風聲與樹葉聲，適合提高專注；棕色噪音模擬大雨或瀑布聲，適合深度放鬆。
        </p>
      </div>
    </div>
  );
};

export default SoundTherapy;
