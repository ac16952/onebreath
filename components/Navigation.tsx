import React, { useState } from 'react';
import { ViewMode } from '../types';

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentMode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, setIsOpen, currentMode, setMode }) => {
  // menuItems supports optional `children` for nested submenus
  const menuItems: Array<any> = [
    { mode: ViewMode.ABOUT, label: '關於我們 (About)', icon: '🏡' },
    { mode: ViewMode.BREATHE, label: '一息呼吸 (Breathe)', icon: '🌬️' },
    // Parent menu: 自我療癒 (Self-Heal) with children
    {
      mode: ViewMode.SELF_HEAL,
      label: '自我療癒 (Self-Heal)',
      icon: '🧘',
      children: [
        { mode: ViewMode.SOUND, label: '聽覺療癒 (Sound)', icon: '🎵' },
        { mode: ViewMode.RELEASE, label: '釋放煩憂 (Bottle & Release)', icon: '🏺' },
        { mode: ViewMode.SLEEP_HEAL, label: '睡好覺是最好的療癒', icon: '😴' },
      ],
    },
    { mode: ViewMode.INSIGHT, label: '靈感籤詩 (Insight)', icon: '🎋' },
    { mode: ViewMode.AI_GUIDE, label: 'AI 撫慰 (AI Guide)', icon: '✨' },
    { mode: ViewMode.NATURE_DIALOGUE, label: '與自然對話 (Nature)', icon: '🌿' },
    // { mode: ViewMode.VISUAL, label: '視覺沉浸 (Visual)', icon: '🌿' },
  ];

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-6 left-6 z-50 p-3 rounded-full bg-morandi-white shadow-sm hover:shadow-md transition-all duration-300 text-morandi-charcoal ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Open Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-morandi-charcoal/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#F2F2F2] shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-morandi-green tracking-widest">一息休息站 BreathNest</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.mode}>
              <button
                onClick={() => {
                  if (item.children && item.children.length) {
                    // toggle submenu
                    setExpanded((prev) => (prev === item.mode ? null : item.mode));
                  } else {
                    setMode(item.mode);
                    setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between space-x-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                  currentMode === item.mode && !item.children
                    ? 'bg-morandi-green text-white shadow-md'
                    : 'hover:bg-morandi-sand/30 text-morandi-charcoal'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium tracking-wide">{item.label}</span>
                </div>
                {item.children && item.children.length ? (
                  <span className={`text-sm text-gray-500 transition-transform ${expanded === item.mode ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                ) : null}
              </button>

              {/* Submenu */}
              {item.children && expanded === item.mode && (
                <div className="mt-2 space-y-2 pl-8">
                  {item.children.map((child: any) => (
                    <button
                      key={child.mode}
                      onClick={() => {
                        setMode(child.mode);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm ${
                        currentMode === child.mode
                          ? 'bg-morandi-green text-white shadow' 
                          : 'hover:bg-morandi-sand/20 text-morandi-charcoal'
                      }`}
                    >
                      <span className="text-lg">{child.icon}</span>
                      <span className="font-medium">{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6 text-center text-xs text-gray-400">
           Digital Minimalism & Micro-breaks
        </div>
      </div>
    </>
  );
};

export default Navigation;
