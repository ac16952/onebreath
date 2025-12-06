import React, { useState, useEffect } from 'react';

type SenseTab = 'overview' | 'sight' | 'sound' | 'touch' | 'smell' | 'taste' | 'card';

type EmotionCard = {
  id: string;
  emoji: string;
  label: string;
  color: string;
  visualAnimation: string;
  mantra: string;
  awarenessQuestion: string;
  breathingPractice: {
    name: string;
    description: string;
    duration: number; // seconds
    pattern: string; // e.g., "4-6" for inhale-hold-exhale
  };
  microPractice: string;
};

const NatureDialogue: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SenseTab>('overview');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [drawnCard, setDrawnCard] = useState<EmotionCard | null>(null);
  const [showHealingInterface, setShowHealingInterface] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');
  const [breathingTime, setBreathingTime] = useState(0);
  const [microPracticeCompleted, setMicroPracticeCompleted] = useState(false);

  const emotionCards: EmotionCard[] = [
    {
      id: 'calm',
      emoji: '🌊',
      label: '平靜',
      color: 'from-blue-200/30 to-cyan-100/20',
      visualAnimation: 'water-flow',
      mantra: '此刻，我讓自己慢下來。',
      awarenessQuestion: '現在身體哪個部位最緊繃？',
      breathingPractice: {
        name: '4-6 呼吸法',
        description: '吸氣 4 秒，吐氣 6 秒，讓身體自然放鬆',
        duration: 60,
        pattern: '4-6'
      },
      microPractice: '把下巴放鬆 3 次'
    },
    {
      id: 'courage',
      emoji: '🏔️',
      label: '勇氣',
      color: 'from-orange-200/30 to-amber-100/20',
      visualAnimation: 'light-rise',
      mantra: '我感到害怕，但我仍然前進。',
      awarenessQuestion: '我是為什麼而想勇敢？',
      breathingPractice: {
        name: '身體力量啟動呼吸',
        description: '吸氣時挺直身體，吐氣時放鬆，感受內在力量',
        duration: 60,
        pattern: '4-4-4'
      },
      microPractice: '今天完成一件你有點害怕但願意嘗試的微小行動'
    },
    {
      id: 'freedom',
      emoji: '🦅',
      label: '自由',
      color: 'from-purple-200/30 to-pink-100/20',
      visualAnimation: 'feather-float',
      mantra: '我允許自己離開不再需要的事物。',
      awarenessQuestion: '今天我可以鬆開什麼小小束縛？',
      breathingPractice: {
        name: '放下式呼吸',
        description: '吐氣比吸氣更長，想像放下不需要的負擔',
        duration: 60,
        pattern: '4-8'
      },
      microPractice: '關閉一個你不需要的通知或待辦'
    },
    {
      id: 'balance',
      emoji: '🌳',
      label: '平衡',
      color: 'from-green-200/30 to-emerald-100/20',
      visualAnimation: 'tree-grow',
      mantra: '我在大地與天空之間找到平衡。',
      awarenessQuestion: '現在的我，需要更多穩定還是更多流動？',
      breathingPractice: {
        name: '平衡呼吸',
        description: '均勻的吸氣與吐氣，找到內在的平衡節奏',
        duration: 60,
        pattern: '5-5'
      },
      microPractice: '做一個簡單的平衡動作（單腳站立 10 秒）'
    },
    {
      id: 'joy',
      emoji: '🌞',
      label: '喜悅',
      color: 'from-yellow-200/30 to-amber-100/20',
      visualAnimation: 'sunshine-spread',
      mantra: '我允許自己感受當下的美好。',
      awarenessQuestion: '此刻，有什麼值得我感恩的小事？',
      breathingPractice: {
        name: '喜悅呼吸',
        description: '輕快的呼吸節奏，感受內心的溫暖與光亮',
        duration: 60,
        pattern: '3-3'
      },
      microPractice: '寫下或說出一個今天讓你微笑的瞬間'
    },
    {
      id: 'healing',
      emoji: '🌿',
      label: '療癒',
      color: 'from-teal-200/30 to-green-100/20',
      visualAnimation: 'plant-grow',
      mantra: '我給自己時間，相信療癒的過程。',
      awarenessQuestion: '現在的我，最需要什麼樣的溫柔對待？',
      breathingPractice: {
        name: '療癒呼吸',
        description: '深長緩慢的呼吸，像植物生長一樣，給自己時間',
        duration: 60,
        pattern: '6-6'
      },
      microPractice: '給自己一個溫柔的擁抱，或輕撫手臂'
    }
  ];

  const senses = {
    sight: {
      title: '視覺冥想 - 尋找自然的色彩',
      content: '閉上眼睛，想像自己走入森林。逐漸睜開眼睛，觀察周圍的光影變化——翠綠的樹葉、金黃的陽光、深藍的天空。注視每一個顏色，感受它帶來的情緒。',
      practice: '每天花 3 分鐘觀察一個自然物體的色彩層次，讓眼睛與心靈同步。'
    },
    sound: {
      title: '聽覺冥想 - 傾聽自然的低語',
      content: '漸漸安靜下來，聆聽周圍的聲音——鳥鳴、風聲、水流。不要評判，只是傾聽。每個聲音都是自然與你的對話，是內在智慧的傳遞。',
      practice: '在戶外坐 10 分鐘，不帶任何電子設備，只用耳朵去感受。'
    },
    touch: {
      title: '觸覺冥想 - 與自然相連',
      content: '輕輕觸碰樹皮、岩石、土壤、葉片。感受每個質地的獨特性——粗糙、光滑、溫暖、清涼。透過觸覺，你與大地建立起連結，感受生命的脈動。',
      practice: '赤腳踏在草地上，或用手輕撫植物，感受生命能量的流動。'
    },
    smell: {
      title: '嗅覺冥想 - 呼吸自然的氣息',
      content: '深呼吸，用鼻子感受森林的香氣——草香、土壤的清新、花香。每一個味道都承載著自然的訊息，慢慢吸入，讓它融入你的身體，帶來平靜與治癒。',
      practice: '在香氣環境中深呼吸 5 次，每次吸氣時默念「接納」，吐氣時默念「釋放」。'
    },
    taste: {
      title: '味覺冥想 - 品嚐自然的滋味',
      content: '享受自然采集的水果或茶飲。慢慢品嚐，讓味覺喚醒你對自然恩賜的感恩。苦、甜、酸、鹹的交織，反映了生命的多面性。',
      practice: '每週選一種自然食物，花 10 分鐘去細細品嚐，感受每個滋味的變化。'
    }
  };

  // 選擇卡牌
  const handleSelectCard = (cardId: string) => {
    const selected = emotionCards.find(card => card.id === cardId);
    if (selected) {
      setDrawnCard(selected);
      setSelectedCard(cardId);
      setShowHealingInterface(false);
      setMicroPracticeCompleted(false);
    }
  };

  // 進入療癒介面
  const handleEnterHealing = () => {
    setShowHealingInterface(true);
  };

  // 呼吸練習
  useEffect(() => {
    if (!breathingActive || !drawnCard) return;

    const pattern = drawnCard.breathingPractice.pattern.split('-').map(Number);
    const [inhale, hold, exhale] = pattern.length === 2 
      ? [pattern[0], 0, pattern[1]] 
      : [pattern[0], pattern[1], pattern[2] || pattern[0]];

    let currentPhase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let timeLeft = inhale * 1000;

    const interval = setInterval(() => {
      setBreathingTime((prev) => {
        const newTime = prev + 100;
        timeLeft -= 100;

        if (timeLeft <= 0) {
          if (currentPhase === 'inhale') {
            if (hold > 0) {
              currentPhase = 'hold';
              timeLeft = hold * 1000;
            } else {
              currentPhase = 'exhale';
              timeLeft = exhale * 1000;
            }
          } else if (currentPhase === 'hold') {
            currentPhase = 'exhale';
            timeLeft = exhale * 1000;
          } else {
            currentPhase = 'inhale';
            timeLeft = inhale * 1000;
          }
        }

        setBreathingPhase(currentPhase);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [breathingActive, drawnCard]);

  // 視覺動畫組件
  const VisualAnimation: React.FC<{ animation: string }> = ({ animation }) => {
    switch (animation) {
      case 'water-flow':
        return (
          <div className="relative w-full h-48 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-200/40 to-cyan-100/30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-blue-300/30 animate-float"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-200/40 rounded-full animate-float-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-cyan-200/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
        );
      case 'light-rise':
        return (
          <div className="relative w-full h-48 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-200/40 to-amber-100/30"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-orange-300/50 rounded-full animate-breathe-in"></div>
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-amber-200/40 rounded-full animate-float"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-200/60 rounded-full animate-pulse"></div>
          </div>
        );
      case 'feather-float':
        return (
          <div className="relative w-full h-48 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-200/40 to-pink-100/30"></div>
            <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-purple-200/40 rounded-full transform rotate-45 animate-float"></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-200/40 rounded-full transform -rotate-12 animate-float-slow"></div>
            <div className="absolute bottom-1/4 left-1/2 w-12 h-12 bg-purple-100/50 rounded-full transform rotate-12 animate-float" style={{ animationDelay: '0.5s' }}></div>
          </div>
        );
      case 'tree-grow':
        return (
          <div className="relative w-full h-48 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-green-200/40 to-emerald-100/30"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-32 bg-green-300/50 rounded-t-full"></div>
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-green-200/40 rounded-full animate-pulse"></div>
            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-emerald-200/40 rounded-full animate-float"></div>
            <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-emerald-200/40 rounded-full animate-float-slow"></div>
          </div>
        );
      case 'sunshine-spread':
        return (
          <div className="relative w-full h-48 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-200/40 to-amber-100/30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-300/50 rounded-full animate-pulse"></div>
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-amber-200/60 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-amber-200/60 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-yellow-200/60 rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
            <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-yellow-200/60 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
          </div>
        );
      case 'plant-grow':
        return (
          <div className="relative w-full h-48 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-200/40 to-green-100/30"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-24 bg-teal-300/50 rounded-t-full animate-breathe-in"></div>
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-green-200/40 rounded-full animate-pulse"></div>
            <div className="absolute bottom-16 left-1/3 w-8 h-8 bg-teal-200/50 rounded-full animate-float"></div>
            <div className="absolute bottom-16 right-1/3 w-8 h-8 bg-teal-200/50 rounded-full animate-float-slow"></div>
          </div>
        );
      default:
        return <div className="w-full h-48 bg-gradient-to-br from-gray-200/40 to-gray-100/30 rounded-xl"></div>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-5 md:p-6 bg-gradient-to-br from-white/90 via-[#F8FAF5]/95 to-[#F0F5ED]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border-2 border-white/70 animate-fade-in overflow-y-auto">
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B8D4A8]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#A8C491]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#5A7B52] mb-2 flex items-center">
          <span className="mr-2 sm:mr-3 text-3xl sm:text-4xl md:text-5xl drop-shadow-lg">🌿</span> 與自然對話
        </h2>
        <p className="text-[#6B8E5F]/80 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base md:text-lg">
          透過五感冥想與自然連結，在森林療癒中找到內在平衡。讓大自然成為你情緒的避風港。
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-[#B8D4A8]/30 relative z-10 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('overview');
            setDrawnCard(null);
            setShowHealingInterface(false);
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          🌍 概說
        </button>
        <button
          onClick={() => {
            setActiveTab('sight');
            setDrawnCard(null);
            setShowHealingInterface(false);
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
            activeTab === 'sight'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          👁️ 視覺
        </button>
        <button
          onClick={() => {
            setActiveTab('sound');
            setDrawnCard(null);
            setShowHealingInterface(false);
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
            activeTab === 'sound'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          👂 聽覺
        </button>
        <button
          onClick={() => {
            setActiveTab('touch');
            setDrawnCard(null);
            setShowHealingInterface(false);
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
            activeTab === 'touch'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          ✋ 觸覺
        </button>
        <button
          onClick={() => {
            setActiveTab('smell');
            setDrawnCard(null);
            setShowHealingInterface(false);
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
            activeTab === 'smell'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          👃 嗅覺
        </button>
        <button
          onClick={() => {
            setActiveTab('taste');
            setDrawnCard(null);
            setShowHealingInterface(false);
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
            activeTab === 'taste'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          👅 味覺
        </button>
        <button
          onClick={() => {
            setActiveTab('card');
            setDrawnCard(null);
            setSelectedCard(null);
            setShowHealingInterface(false);
            setMicroPracticeCompleted(false);
            setBreathingActive(false);
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
            activeTab === 'card'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          🃏 情緒卡牌
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[300px] relative z-10">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-[#B8D4A8]/20 to-[#A8C491]/10 border-2 border-[#B8D4A8]/40 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-[#5A7B52] mb-3 flex items-center">
                <span className="mr-2 text-2xl">🌳</span> 森林療癒的力量
              </h3>
              <p className="text-[#6B8E5F]/90 mb-4 leading-relaxed">
                在快速變化的現代生活中，我們常常迷失了方向。大自然，是我們重新找到自己的最佳治療師。
              </p>
              <p className="text-[#6B8E5F]/90 mb-4 leading-relaxed">
                透過五感冥想，你將學會：
              </p>
              <ul className="space-y-2 text-[#6B8E5F]/90 ml-4">
                <li>✓ 在森林的寧靜中，找回內心的平衡</li>
                <li>✓ 透過大自然的觸覺、聲音、氣息，療癒情緒的創傷</li>
                <li>✓ 學會不評判、接納與順應生命的流動</li>
                <li>✓ 讓每一次呼吸都成為與自然的對話</li>
              </ul>
            </div>
            <div className="p-5 bg-gradient-to-br from-[#AEC2C6]/15 to-[#9DAFB5]/10 border-2 border-[#AEC2C6]/30 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-[#5A7B52] mb-3 flex items-center">
                <span className="mr-2 text-2xl">💭</span> 當你感到迷茫時
              </h3>
              <p className="text-[#6B8E5F]/90 leading-relaxed">
                選擇左側任一感官冥想，或抽取一張情緒卡牌，讓大自然為你帶來指引。每一個練習，都是一場與自然的深層對話。
              </p>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && activeTab !== 'card' && (
          <div className="space-y-4">
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#5A7B52] drop-shadow-sm">
              {senses[activeTab as keyof typeof senses]?.title}
            </h3>
            <div className="p-5 bg-gradient-to-br from-[#F0F5ED]/60 to-[#E8F0E6]/40 border-2 border-[#B8D4A8]/40 rounded-2xl shadow-sm">
              <p className="text-[#6B8E5F]/90 mb-4 leading-relaxed text-base sm:text-lg">
                {senses[activeTab as keyof typeof senses]?.content}
              </p>
              <div className="pt-3 border-t-2 border-[#B8D4A8]/30">
                <p className="text-sm font-medium text-[#5A7B52] mb-2">💚 每日練習：</p>
                <p className="text-[#6B8E5F]/85 italic">
                  {senses[activeTab as keyof typeof senses]?.practice}
                </p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-[#D4E6F1]/30 to-[#AEC2C6]/20 border-2 border-[#AEC2C6]/40 rounded-2xl shadow-sm">
              <p className="text-[#6B8E5F]/80 text-sm leading-relaxed">
                💡 <span className="font-medium text-[#5A7B52]">提示：</span>在舒適的環境中進行練習，給自己充足的時間去感受每個感官的變化。沒有對錯，只有當下的體驗。
              </p>
            </div>
          </div>
        )}

        {/* 情緒卡牌頁面 */}
        {activeTab === 'card' && !showHealingInterface && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#5A7B52] drop-shadow-sm mb-2">🃏 情緒引導卡牌</h3>
              <p className="text-[#6B8E5F]/80 mb-6 text-sm sm:text-base md:text-lg">
                選擇一張卡牌，讓自然的智慧為你帶來當下需要的訊息與療癒。
              </p>
            </div>

            {/* 顯示六張卡牌 */}
            {!drawnCard && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {emotionCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleSelectCard(card.id)}
                    className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 sm:p-8 shadow-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedCard === card.id
                        ? 'border-[#7A9E6F] scale-105 shadow-xl'
                        : 'border-white/50 hover:border-[#B8D4A8]/60 hover:shadow-xl'
                    }`}
                  >
                    <div className="text-center space-y-3">
                      <div className="text-5xl sm:text-6xl mb-2 animate-float">{card.emoji}</div>
                      <div className="font-semibold text-lg sm:text-xl text-[#5A7B52]">{card.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 顯示選中的卡牌 */}
            {drawnCard && !showHealingInterface && (
              <div className="space-y-6 animate-fade-in">
                <div className={`bg-gradient-to-br ${drawnCard.color} rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-white/50 transform transition-all duration-500`}>
                  <div className="text-center space-y-4">
                    <div className="text-7xl sm:text-8xl mb-4 animate-float">{drawnCard.emoji}</div>
                    <h4 className="text-2xl sm:text-3xl font-bold text-[#5A7B52]">{drawnCard.label}</h4>
                    <p className="text-lg sm:text-xl text-[#6B8E5F]/90 italic">"{drawnCard.mantra}"</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <button
                    onClick={handleEnterHealing}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium text-base sm:text-lg"
                  >
                    🌿 開始療癒旅程
                  </button>
                  <button
                    onClick={() => {
                      setDrawnCard(null);
                      setSelectedCard(null);
                    }}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white/60 text-[#5A7B52] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium text-base sm:text-lg border-2 border-[#B8D4A8]/40"
                  >
                    🔄 重新選擇
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 療癒介面 */}
        {activeTab === 'card' && showHealingInterface && drawnCard && (
          <div className="space-y-6 animate-fade-in overflow-y-auto">
            {/* 返回按鈕 */}
            <button
              onClick={() => {
                setShowHealingInterface(false);
                setBreathingActive(false);
                setMicroPracticeCompleted(false);
              }}
              className="text-[#5A7B52] hover:text-[#7A9E6F] transition-colors flex items-center text-sm sm:text-base"
            >
              ← 返回卡牌
            </button>

            {/* ① 視覺療癒 */}
            <div className="space-y-4">
              <h4 className="text-xl sm:text-2xl font-semibold text-[#5A7B52] flex items-center">
                <span className="mr-2">🎨</span> 視覺療癒
              </h4>
              <VisualAnimation animation={drawnCard.visualAnimation} />
            </div>

            {/* ② 短語指引 */}
            <div className={`bg-gradient-to-br ${drawnCard.color} rounded-2xl p-6 shadow-lg border-2 border-white/50`}>
              <h4 className="text-lg sm:text-xl font-semibold text-[#5A7B52] mb-3 flex items-center">
                <span className="mr-2">💫</span> 短語指引
              </h4>
              <p className="text-2xl sm:text-3xl text-[#5A7B52] font-medium italic text-center leading-relaxed">
                "{drawnCard.mantra}"
              </p>
              <p className="text-sm text-[#6B8E5F]/70 text-center mt-3">重複默念這句話，讓它成為你的內在力量</p>
            </div>

            {/* ③ 自我覺察問題 */}
            <div className="bg-gradient-to-br from-[#F0F5ED]/60 to-[#E8F0E6]/40 rounded-2xl p-6 shadow-lg border-2 border-[#B8D4A8]/40">
              <h4 className="text-lg sm:text-xl font-semibold text-[#5A7B52] mb-3 flex items-center">
                <span className="mr-2">💭</span> 自我覺察
              </h4>
              <p className="text-lg sm:text-xl text-[#6B8E5F]/90 leading-relaxed">
                {drawnCard.awarenessQuestion}
              </p>
              <p className="text-sm text-[#6B8E5F]/70 mt-3 italic">給自己一點時間，靜靜感受內心的答案</p>
            </div>

            {/* ④ 呼吸練習 */}
            <div className="bg-gradient-to-br from-[#D4E6F1]/30 to-[#AEC2C6]/20 rounded-2xl p-6 shadow-lg border-2 border-[#AEC2C6]/40">
              <h4 className="text-lg sm:text-xl font-semibold text-[#5A7B52] mb-3 flex items-center">
                <span className="mr-2">🌬️</span> 呼吸練習
              </h4>
              <p className="text-base sm:text-lg text-[#6B8E5F]/90 mb-4 font-medium">
                {drawnCard.breathingPractice.name}
              </p>
              <p className="text-sm sm:text-base text-[#6B8E5F]/80 mb-4">
                {drawnCard.breathingPractice.description}
              </p>
              
              {!breathingActive ? (
                <button
                  onClick={() => setBreathingActive(true)}
                  className="w-full px-6 py-3 bg-[#7A9E6F] text-white rounded-xl hover:bg-[#6B8E5F] transition-colors font-medium"
                >
                  開始練習（約 1 分鐘）
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transition-all duration-1000 ${
                      breathingPhase === 'inhale' ? 'bg-blue-300/40 scale-110 animate-breathe-in' :
                      breathingPhase === 'hold' ? 'bg-green-300/40 scale-125 animate-breathe-hold' :
                      breathingPhase === 'exhale' ? 'bg-purple-300/40 scale-100 animate-breathe-out' :
                      'bg-gray-300/40'
                    }`}>
                      <span className="text-2xl sm:text-3xl text-[#5A7B52] font-medium">
                        {breathingPhase === 'inhale' ? '吸氣' :
                         breathingPhase === 'hold' ? '止息' :
                         breathingPhase === 'exhale' ? '吐氣' : '準備'}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#6B8E5F]/70">
                      模式：{drawnCard.breathingPractice.pattern}
                    </p>
                    <p className="text-xs text-[#6B8E5F]/60 mt-2">
                      已練習 {Math.floor(breathingTime / 1000)} 秒
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setBreathingActive(false);
                      setBreathingTime(0);
                      setBreathingPhase('idle');
                    }}
                    className="w-full px-6 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors font-medium text-sm"
                  >
                    停止練習
                  </button>
                </div>
              )}
            </div>

            {/* ⑤ 小任務 */}
            <div className="bg-gradient-to-br from-[#F8FAF5]/60 to-[#F0F5ED]/40 rounded-2xl p-6 shadow-lg border-2 border-[#B8D4A8]/40">
              <h4 className="text-lg sm:text-xl font-semibold text-[#5A7B52] mb-3 flex items-center">
                <span className="mr-2">✨</span> 小任務
              </h4>
              <p className="text-base sm:text-lg text-[#6B8E5F]/90 mb-4">
                {drawnCard.microPractice}
              </p>
              {!microPracticeCompleted ? (
                <button
                  onClick={() => setMicroPracticeCompleted(true)}
                  className="px-6 py-2 bg-[#7A9E6F] text-white rounded-xl hover:bg-[#6B8E5F] transition-colors font-medium text-sm sm:text-base"
                >
                  我已完成
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-[#7A9E6F]">
                  <span className="text-2xl">✓</span>
                  <span className="font-medium">已完成！你做得很好</span>
                </div>
              )}
            </div>

            {/* 完成訊息 */}
            {microPracticeCompleted && (
              <div className="bg-gradient-to-r from-[#B8D4A8]/25 to-[#A8C491]/20 rounded-2xl p-6 border-2 border-[#7A9E6F]/50 text-center">
                <p className="text-lg sm:text-xl text-[#5A7B52] font-semibold mb-2">
                  🌿 療癒旅程完成
                </p>
                <p className="text-sm sm:text-base text-[#6B8E5F]/90">
                  你已經完成了這次的療癒練習。記住，每一次的自我照顧都是對自己的溫柔。
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Closing Message */}
      {activeTab !== 'card' && (
        <div className="mt-8 pt-6 border-t-2 border-[#B8D4A8]/30 relative z-10">
          <p className="text-center text-[#6B8E5F]/80 text-base leading-relaxed">
            🌱 每一次與自然的對話，都是對自己的一場深度療癒。<br />
            <span className="font-medium">相信過程，你會找到屬於自己的內在平衡。</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default NatureDialogue;
