import React, { useState } from 'react';
import { generateMindfulnessContent } from '../services/geminiService';
import { AIResponseState } from '../types';

const moodOptions = [
  "焦慮 (Anxious)", 
  "疲憊 (Tired)", 
  "混亂 (Confused)", 
  "壓力大 (Stressed)", 
  "需要靈感 (Stuck)"
];

const AIGuide: React.FC = () => {
  const [responseState, setResponseState] = useState<AIResponseState>({
    loading: false,
    content: null,
    error: null,
  });
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleGenerate = async (mood: string) => {
    setSelectedMood(mood);
    setResponseState({ loading: true, content: null, error: null });
    
    try {
      // Use Vite client env variable exposed as VITE_API_KEY
      if (!import.meta.env.VITE_API_KEY) {
        setResponseState({
          loading: false,
          content: "請配置 Gemini API Key 以使用此功能。",
          error: "Missing API Key",
        });
        return;
      }
      
      const text = await generateMindfulnessContent(mood);
      setResponseState({ loading: false, content: text, error: null });
    } catch (err) {
      setResponseState({ 
        loading: false, 
        content: null, 
        error: "似乎暫時無法連結到 AI 導師，請稍後再試。" 
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6 max-w-3xl mx-auto animate-fade-in overflow-y-auto py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-light text-morandi-charcoal tracking-widest mb-2">AI 撫慰導師</h2>
        <p className="text-morandi-charcoal/60 text-sm">告訴我你現在的感受，讓我為你拂去塵埃</p>
      </div>

      {!responseState.content && !responseState.loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {moodOptions.map((mood) => (
            <button
              key={mood}
              onClick={() => handleGenerate(mood)}
              className="p-4 rounded-xl bg-white/40 border border-white/50 hover:bg-morandi-blue/20 hover:border-morandi-blue/40 transition-all text-morandi-charcoal text-center"
            >
              {mood}
            </button>
          ))}
        </div>
      )}

      {responseState.loading && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-morandi-green/30 border-t-morandi-green animate-spin"></div>
          <p className="text-morandi-charcoal/50 animate-pulse">正在調配心靈處方...</p>
        </div>
      )}

      {responseState.content && (
        <div className="w-full bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/60 animate-fade-in relative">
          <button 
             onClick={() => setResponseState({ loading: false, content: null, error: null })}
             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h3 className="text-morandi-green font-bold mb-4 flex items-center">
            <span className="mr-2">🌿</span> 給 {selectedMood?.split(' ')[0]} 的你
          </h3>
          <p className="text-lg text-morandi-charcoal leading-loose text-justify font-sans">
            {responseState.content}
          </p>
        </div>
      )}

      {responseState.error && (
        <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-lg text-sm">
          {responseState.error}
          {!import.meta.env.VITE_API_KEY && <p className="mt-1 text-xs">開發者提示：請在 .env 檔案中設定 VITE_API_KEY。</p>}
        </div>
      )}
    </div>
  );
};

export default AIGuide;
