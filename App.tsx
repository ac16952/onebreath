import React, { useState } from 'react';
import Navigation from './components/Navigation';
import BreathingExercise from './components/BreathingExercise';
import SoundTherapy from './components/SoundTherapy';
import InsightCard from './components/InsightCard';
import AIGuide from './components/AIGuide';
import About from './components/About';
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
      default:
        return <BreathingExercise />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-morandi-bg overflow-hidden font-sans selection:bg-morandi-green/30 selection:text-morandi-charcoal">
      
      {/* Background Layer: Nature Texture */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618520803517-573e8e2e92c0?q=80&w=2574&auto=format&fit=crop" 
          alt="Soft Sage Texture" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay animate-fade-in"
        />
        {/* Gradient Overlay for Fade Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-morandi-bg/40 via-transparent to-morandi-bg/90"></div>
        {/* Subtle Noise Texture Overlay (CSS Pattern) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Ambient Shapes (Mist effect) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vh] h-[60vh] bg-white/40 rounded-full blur-[100px] animate-float opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vh] h-[70vh] bg-morandi-green/20 rounded-full blur-[120px] animate-float-slow opacity-60 pointer-events-none"></div>
      <div className="absolute top-[40%] left-[60%] w-[40vh] h-[40vh] bg-morandi-blue/10 rounded-full blur-[80px] animate-float opacity-40 pointer-events-none" style={{ animationDelay: '5s' }}></div>

      {/* Navigation */}
      <Navigation 
        isOpen={isMenuOpen} 
        setIsOpen={setIsMenuOpen} 
        currentMode={viewMode}
        setMode={setViewMode}
      />

      {/* Main Content Area */}
      <main className={`relative z-10 h-screen w-full transition-all duration-700 ease-out ${isMenuOpen ? 'blur-sm scale-95 opacity-80' : 'opacity-100'}`}>
        <div className="h-full w-full flex flex-col">
          {/* Header Spacer (for burger button) */}
          <div className="h-24 w-full flex-none"></div>
          
          {/* Content Container */}
          <div className="flex-grow w-full max-w-7xl mx-auto flex items-center justify-center p-4">
             {renderContent()}
          </div>
          
          {/* Footer / Copyright */}
          <div className="h-16 w-full flex-none text-center text-morandi-charcoal/40 text-xs flex items-center justify-center tracking-widest uppercase">
            One Breath Rest Stop &bull; Digital Sanctuary
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;