import React, { useState } from 'react';
import Navigation from './components/Navigation';
import BreathingExercise from './components/BreathingExercise';
import SoundTherapy from './components/SoundTherapy';
import InsightCard from './components/InsightCard';
import AIGuide from './components/AIGuide';
import About from './components/About';
import BottleRelease from './components/BottleRelease';
import NatureDialogue from './components/NatureDialogue';
import SleepWell from './components/SleepWell';
import Articles from './components/Articles';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ABOUT);

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.BREATHE:
        return <BreathingExercise />;
      case ViewMode.SOUND:
        return <SoundTherapy />;
      case ViewMode.INSIGHT:
        return <InsightCard />;
      case ViewMode.AI_GUIDE:
        return <AIGuide />;
      case ViewMode.ABOUT:
        return <About />;
      case ViewMode.RELEASE:
        return <BottleRelease />;
      case ViewMode.NATURE_DIALOGUE:
        return <NatureDialogue />;
      case ViewMode.SLEEP_HEAL:
        return <SleepWell />;
      case ViewMode.ARTICLES:
        return <Articles />;
      default:
        return <BreathingExercise />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#E8F0E6] via-morandi-bg to-[#D0DCC8] overflow-y-auto font-sans selection:bg-morandi-green/30 selection:text-morandi-charcoal">
      
      {/* Background Layer: Clover & Nature */}
      <div className="absolute inset-0 z-0">
        {/* Soft nature paper texture */}
        <div className="absolute inset-0 bg-opacity-20" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperTexture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch' seed='2'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='3'/%3E%3C/filter%3E%3Crect width='100' height='100' fill='%23D9E2D5' filter='url(%23paperTexture)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}></div>

        {/* Scattered Clover SVG Elements */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <g id="clover">
              <circle cx="0" cy="-80" r="50" fill="#6B8E5F"/>
              <circle cx="70" cy="-30" r="50" fill="#7A9E6F"/>
              <circle cx="70" cy="50" r="50" fill="#6B8E5F"/>
              <circle cx="0" cy="100" r="50" fill="#7A9E6F"/>
              <circle cx="-70" cy="50" r="50" fill="#6B8E5F"/>
              <circle cx="-70" cy="-30" r="50" fill="#7A9E6F"/>
              <line x1="0" y1="0" x2="0" y2="150" stroke="#5A7B52" strokeWidth="8"/>
            </g>
          </defs>
          
          {/* Scattered clovers across background */}
          <use href="#clover" x="150" y="100" opacity="0.6"/>
          <use href="#clover" x="900" y="150" opacity="0.5"/>
          <use href="#clover" x="300" y="400" opacity="0.55"/>
          <use href="#clover" x="1050" y="600" opacity="0.6"/>
          <use href="#clover" x="200" y="650" opacity="0.5"/>
          <use href="#clover" x="800" y="450" opacity="0.55"/>
          <use href="#clover" x="450" y="200" opacity="0.6"/>
          <use href="#clover" x="650" y="700" opacity="0.5"/>
          <use href="#clover" x="100" y="350" opacity="0.55"/>
          <use href="#clover" x="950" y="300" opacity="0.6"/>
          <use href="#clover" x="500" y="550" opacity="0.5"/>
          <use href="#clover" x="350" y="750" opacity="0.55"/>
        </svg>

        {/* Gradient Overlay for Fade Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#D9E2D5]/60"></div>
      </div>

      {/* Ambient Shapes (Mist effect - enhanced for nature feel) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vh] h-[60vh] bg-[#B8D4A8]/20 rounded-full blur-[120px] animate-float opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vh] h-[70vh] bg-morandi-green/15 rounded-full blur-[120px] animate-float-slow opacity-40 pointer-events-none"></div>
      <div className="absolute top-[40%] left-[60%] w-[40vh] h-[40vh] bg-[#A8C491]/15 rounded-full blur-[80px] animate-float opacity-30 pointer-events-none" style={{ animationDelay: '5s' }}></div>

      {/* Navigation */}
      <Navigation 
        isOpen={isMenuOpen} 
        setIsOpen={setIsMenuOpen} 
        currentMode={viewMode}
        setMode={setViewMode}
      />

      {/* Main Content Area */}
      <main className={`relative z-10 min-h-screen w-full overflow-y-auto transition-all duration-700 ease-out ${isMenuOpen ? 'blur-sm scale-95 opacity-80' : 'opacity-100'}`}>
        <div className="min-h-screen w-full flex flex-col">
          {/* Header Spacer (for burger button) */}
          <div className="h-16 sm:h-20 md:h-24 w-full flex-none"></div>

          {/* Content Container - allow vertical flow and scrolling on overflow */}
          <div className="flex-grow w-full max-w-7xl mx-auto flex flex-col items-start justify-start p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="w-full">
              {renderContent()}
            </div>
          </div>

          {/* Footer / Copyright */}
          <div className="h-16 w-full flex-none text-center text-morandi-charcoal/40 text-xs flex items-center justify-center tracking-widest uppercase px-4">
            One Breath Rest Stop &bull; Digital Sanctuary
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;