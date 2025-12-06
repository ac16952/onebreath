import React, { useState, useEffect } from 'react';
import { BREATH_TIMING } from '../constants';
import { BreathingPhase } from '../types';

const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<BreathingPhase>(BreathingPhase.IDLE);
  const [instruction, setInstruction] = useState('點擊開始，找回平靜');
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!active) {
      setPhase(BreathingPhase.IDLE);
      setInstruction('點擊圓圈開始');
      return;
    }

    const runCycle = () => {
      // Inhale (4s)
      setPhase(BreathingPhase.INHALE);
      setInstruction('吸氣 (Inhale)');
      
      timeout = setTimeout(() => {
        // Hold (7s)
        setPhase(BreathingPhase.HOLD);
        setInstruction('止息 (Hold)');
        
        timeout = setTimeout(() => {
          // Exhale (8s)
          setPhase(BreathingPhase.EXHALE);
          setInstruction('呼氣 (Exhale)');
          
          timeout = setTimeout(() => {
            // Loop
            runCycle();
          }, BREATH_TIMING.EXHALE);
        }, BREATH_TIMING.HOLD);
      }, BREATH_TIMING.INHALE);
    };

    runCycle();

    return () => clearTimeout(timeout);
  }, [active]);

  const toggleBreath = () => {
    setActive(!active);
  };

  const getCircleClasses = () => {
    const base = "w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-xl backdrop-blur-md border border-white/20";
    switch (phase) {
      case BreathingPhase.INHALE:
        return `${base} bg-morandi-blue/40 animate-breathe-in`;
      case BreathingPhase.HOLD:
        return `${base} bg-morandi-green/40 animate-breathe-hold scale-150`;
      case BreathingPhase.EXHALE:
        return `${base} bg-morandi-sand/40 animate-breathe-out`;
      default:
        return `${base} bg-morandi-white/60 hover:scale-105 duration-300`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full animate-fade-in space-y-6 sm:space-y-8 md:space-y-12 py-4 sm:py-6 md:py-8 overflow-y-auto">
      <div className="text-center space-y-2 px-4">
        <h2 className="text-2xl sm:text-3xl font-light text-morandi-charcoal tracking-widest">4-7-8 呼吸法</h2>
        <p className="text-morandi-charcoal/60 text-xs sm:text-sm">幫助副交感神經運作，快速降低焦慮</p>
      </div>

      <div className="relative flex items-center justify-center h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96">
        {/* Outer subtle rings for visual depth */}
        <div className={`absolute border border-morandi-charcoal/5 rounded-full w-full h-full transition-all duration-[4000ms] ${phase === BreathingPhase.INHALE ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}></div>
        <div className={`absolute border border-morandi-charcoal/5 rounded-full w-3/4 h-3/4 transition-all duration-[4000ms] ${phase === BreathingPhase.INHALE ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}></div>

        <div onClick={toggleBreath} className={getCircleClasses()}>
          <span className="text-morandi-charcoal font-medium text-lg tracking-widest pointer-events-none select-none">
            {instruction}
          </span>
        </div>
      </div>

      <button 
        onClick={toggleBreath}
        className="px-6 sm:px-8 py-2 sm:py-3 rounded-full border border-morandi-charcoal/20 text-morandi-charcoal/80 hover:bg-morandi-white hover:shadow-md transition-all tracking-wide text-sm sm:text-base"
      >
        {active ? '停止練習' : '開始練習'}
      </button>
    </div>
  );
};

export default BreathingExercise;