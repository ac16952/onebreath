import React, { useState, useEffect } from 'react';

type SenseTab = 'overview' | 'sight' | 'sound' | 'touch' | 'smell' | 'taste' | 'card';

const NatureDialogue: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SenseTab>('overview');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardMessage, setCardMessage] = useState<string | null>(null);

  const emotionCards = [
    { id: 'calm', emoji: '🌊', label: '平靜', message: '就像水流一般，學會順應生活的節奏，你會發現內心變得更加澄澈寧靜。' },
    { id: 'courage', emoji: '🏔️', label: '勇氣', message: '登山的過程教會我們，每一步都很重要。抓緊每個支點，一步步向上，你比想像中更堅強。' },
    { id: 'freedom', emoji: '🦅', label: '自由', message: '展開翅膀，感受風的流動。真正的自由，來自於內心的接納與放下。' },
    { id: 'balance', emoji: '🌳', label: '平衡', message: '樹木紮根於地，卻伸向天空。在大地與蒼穹間找到屬於你的平衡點。' },
    { id: 'joy', emoji: '🌞', label: '喜悅', message: '陽光穿透樹葉灑下斑斕的光影，生活中處處是值得感恩的美好。' },
    { id: 'healing', emoji: '🌿', label: '療癒', message: '植物靜靜生長，告訴我們療癒需要時間。相信過程，你會看到自己的蛻變。' },
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

  useEffect(() => {
    if (selectedCard) {
      const card = emotionCards.find(c => c.id === selectedCard);
      if (card) {
        setCardMessage(card.message);
        setTimeout(() => setCardMessage(null), 6000); // Auto-dismiss after 6s
      }
    }
  }, [selectedCard]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-white/90 via-[#F8FAF5]/95 to-[#F0F5ED]/90 backdrop-blur-md rounded-3xl shadow-xl border-2 border-white/70 animate-fade-in overflow-hidden">
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B8D4A8]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#A8C491]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10">
        <h2 className="text-4xl font-semibold text-[#5A7B52] mb-2 flex items-center">
          <span className="mr-3 text-5xl drop-shadow-lg">🌿</span> 與自然對話
        </h2>
        <p className="text-[#6B8E5F]/80 mb-6 leading-relaxed text-lg">
          透過五感冥想與自然連結，在森林療癒中找到內在平衡。讓大自然成為你情緒的避風港。
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b-2 border-[#B8D4A8]/30 relative z-10">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          🌍 概說
        </button>
        <button
          onClick={() => setActiveTab('sight')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'sight'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          👁️ 視覺
        </button>
        <button
          onClick={() => setActiveTab('sound')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'sound'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          👂 聽覺
        </button>
        <button
          onClick={() => setActiveTab('touch')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'touch'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          ✋ 觸覺
        </button>
        <button
          onClick={() => setActiveTab('smell')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'smell'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          👃 嗅覺
        </button>
        <button
          onClick={() => setActiveTab('taste')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'taste'
              ? 'bg-gradient-to-r from-[#7A9E6F] to-[#6B8E5F] text-white shadow-lg scale-105'
              : 'bg-[#F0F5ED] text-[#5A7B52] hover:bg-[#E8F0E6] border border-[#B8D4A8]/40'
          }`}
        >
          👅 味覺
        </button>
        <button
          onClick={() => setActiveTab('card')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
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
            <h3 className="text-3xl font-semibold text-[#5A7B52] drop-shadow-sm">
              {senses[activeTab as keyof typeof senses]?.title}
            </h3>
            <div className="p-5 bg-gradient-to-br from-[#F0F5ED]/60 to-[#E8F0E6]/40 border-2 border-[#B8D4A8]/40 rounded-2xl shadow-sm">
              <p className="text-[#6B8E5F]/90 mb-4 leading-relaxed text-lg">
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

        {activeTab === 'card' && (
          <div className="space-y-4">
            <h3 className="text-3xl font-semibold text-[#5A7B52] drop-shadow-sm mb-2">🃏 情緒引導卡牌</h3>
            <p className="text-[#6B8E5F]/80 mb-6 text-lg">
              點選一張卡牌，讓自然的智慧為你帶來當下需要的訊息與療癒。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {emotionCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card.id)}
                  className={`p-6 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-md ${
                    selectedCard === card.id
                      ? 'bg-gradient-to-br from-[#7A9E6F] to-[#6B8E5F] text-white shadow-xl scale-110'
                      : 'bg-gradient-to-br from-[#F0F5ED] to-[#E8F0E6] text-[#5A7B52] hover:shadow-lg border-2 border-[#B8D4A8]/40 hover:border-[#7A9E6F]/60'
                  }`}
                >
                  <div className="text-5xl mb-2 drop-shadow">{card.emoji}</div>
                  <div className="font-medium text-sm">{card.label}</div>
                </button>
              ))}
            </div>

            {cardMessage && (
              <div className="mt-6 p-5 bg-gradient-to-r from-[#B8D4A8]/25 to-[#A8C491]/20 border-2 border-[#7A9E6F]/50 rounded-2xl animate-fade-in shadow-lg">
                <p className="text-[#5A7B52] font-semibold mb-2 flex items-center">
                  <span className="mr-2 text-2xl">🌿</span> 自然的訊息
                </p>
                <p className="text-[#6B8E5F]/90 leading-relaxed italic text-lg">
                  "{cardMessage}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Closing Message */}
      <div className="mt-8 pt-6 border-t-2 border-[#B8D4A8]/30 relative z-10">
        <p className="text-center text-[#6B8E5F]/80 text-base leading-relaxed">
          🌱 每一次與自然的對話，都是對自己的一場深度療癒。<br />
          <span className="font-medium">相信過程，你會找到屬於自己的內在平衡。</span>
        </p>
      </div>
    </div>
  );
};

export default NatureDialogue;
