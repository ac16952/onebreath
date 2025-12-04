import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 animate-fade-in">
      <h1 className="text-3xl font-semibold text-morandi-charcoal mb-4">BreathNest – 網站故事</h1>

      <p className="text-morandi-charcoal/80 leading-relaxed mb-4">
        BreathNest 的誕生，來自一個很 Z 世代的直覺：
        世界太吵了，我們需要一個可以「一鍵靜下來」的地方。
      </p>

      <p className="text-morandi-charcoal/80 leading-relaxed mb-4">
        不是逃避，也不是心靈雞湯，而是那種——
        深吸一口氣、肩膀自然放下、心慢慢回到自己身上的瞬間。
        一個真正能 reset、能回到「我還在，我很好」的安全小巢。
      </p>

      <p className="text-morandi-charcoal/80 leading-relaxed mb-4">
        於是，我們打造了 BreathNest。
        一個像鳥巢一樣輕柔、像微光一樣安穩的數位休憩站。
      </p>

      <div className="mt-6 p-6 bg-morandi-bg/60 rounded-lg border border-morandi-sand/40">
        <p className="text-morandi-charcoal/90 leading-relaxed mb-2">在這裡，</p>
        <ul className="list-disc pl-5 text-morandi-charcoal/80 leading-relaxed">
          <li>沒有複雜的任務、沒有 KPI、沒有誰在催你回訊息。</li>
          <li>只有呼吸引導、溫柔的聲音、感官沈澱、心緒緩和。</li>
          <li>你只需要按下開始，世界就像被按了 soft pause。</li>
        </ul>
      </div>

      <p className="text-morandi-charcoal/80 leading-relaxed mt-6">
        每一次進來，就是一段返家的旅程。不是回到哪裡，而是回到自己。
      </p>

      <p className="text-morandi-charcoal/80 leading-relaxed mt-4">
        我們相信：安穩不是奢侈，而是一種日常必需。
        就像一個巢，無論你飛多遠，它永遠等著你落回來。
      </p>

      <div className="mt-6 text-center">
        <p className="text-morandi-green font-semibold">Welcome to BreathNest—</p>
        <p className="text-sm text-morandi-charcoal/70">With a single mindful breath, you’re home.</p>
      </div>
    </div>
  );
};

export default About;
