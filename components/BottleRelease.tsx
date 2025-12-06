import React, { useState, useRef, useEffect } from 'react';

type FloatingBottle = {
  id: number;
  text: string;
  start: number; // timestamp
  duration: number; // ms
  removed?: boolean;
  x?: number;
  y?: number;
  opacity?: number;
};

const BottleRelease: React.FC = () => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [floating, setFloating] = useState<FloatingBottle[]>([]);
  const idRef = useRef(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // cubic bezier helper
  const cubic = (t: number, p0: number, p1: number, p2: number, p3: number) => {
    const u = 1 - t;
    return (
      u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
    );
  };

  const animate = () => {
    const now = performance.now();
    setFloating((prev) => {
      const container = containerRef.current;
      if (!container) return prev;
      const w = container.clientWidth;
      const h = container.clientHeight;

      const updated = prev.map((b) => {
        if (b.removed) return b;
        const t = Math.min(1, (now - b.start) / b.duration);

        // define path points relative to container
        const p0 = { x: 40, y: h - 40 };
        const p1 = { x: w * 0.25, y: h - 80 };
        const p2 = { x: w * 0.6, y: h - 100 };
        const p3 = { x: Math.max(w - 40, w * 0.6), y: h - 60 };

        const x = cubic(t, p0.x, p1.x, p2.x, p3.x);
        const y = cubic(t, p0.y, p1.y, p2.y, p3.y);
        const opacity = t < 1 ? 1 : Math.max(0, 1 - (t - 1) * 2.5);

        return { ...b, x, y, opacity };
      });
      return updated;
    });

    // schedule next frame if any active
    rafRef.current = requestAnimationFrame(() => {
      const anyActive = floating.some((b) => !b.removed && (performance.now() - b.start) / b.duration < 1);
      if (anyActive) animate();
      else {
        // ensure we still run one more frame to set final state
        setFloating((prev) => prev.map((b) => (b.removed ? b : { ...b, opacity: 0, removed: true })));
      }
    });
  };

  const startAnimationLoopIfNeeded = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(animate);
  };

  const handleSeal = () => {
    if (!text.trim()) return;
    const id = idRef.current++;
    const duration = 3000;
    const start = performance.now();

    const newBottle: FloatingBottle = { id, text: text.trim(), start, duration, opacity: 1 };
    setFloating((s) => [...s, newBottle]);
    setText('');

    setMessage('正在釋放...');

    // ensure RAF loop runs
    startAnimationLoopIfNeeded();

    // after animation duration + fade, remove from state and show final message
    setTimeout(() => {
      setFloating((s) => s.filter((b) => b.id !== id));
      setMessage('你已經讓它離開。');
      setTimeout(() => setMessage(null), 3000);
    }, duration + 400);
  };

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 animate-fade-in">
      <h2 className="text-2xl font-semibold text-morandi-charcoal mb-3 flex items-center">
        <span className="mr-2">🏺</span> 釋放煩惱
      </h2>

      <p className="text-morandi-charcoal/70 mb-4">把你現在最在意或煩惱的一件事寫下，按下「封存」它會變成一個漂流瓶，帶著你的煩惱沿著河道漂走，讓心靜一會兒。</p>

      <textarea
        aria-label="寫下煩惱"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[120px] p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-morandi-green mb-4 resize-none text-morandi-charcoal"
        placeholder="在這裡寫下你的煩惱..."
      />

      <div className="flex items-center space-x-3">
        <button
          onClick={handleSeal}
          className="px-6 py-2 rounded-full bg-morandi-green text-white shadow hover:brightness-95 transition"
        >
          封存
        </button>
        <button
          onClick={() => setText('')}
          className="px-4 py-2 rounded-full bg-white border border-gray-200 text-morandi-charcoal hover:bg-gray-50 transition"
        >
          取消
        </button>
      </div>

      <div className="relative mt-8 h-40 overflow-auto">
        {/* SVG path is kept for decorative purposes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${Math.max(600, typeof window !== 'undefined' ? window.innerWidth : 800)} 160`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d={`M 40 120 C ${Math.max(150, 0.25 * (typeof window !== 'undefined' ? window.innerWidth : 600))} 80, ${Math.max(300, 0.6 * (typeof window !== 'undefined' ? window.innerWidth : 600))} 60, ${Math.max(560, (typeof window !== 'undefined' ? window.innerWidth : 600) - 40)} 100`} fill="none" stroke="#E6E6E6" strokeWidth={2} opacity={0.12} />
        </svg>

        {/* Floating bottles (DOM fallback animation) */}
        {floating.map((b) => (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: (b.x ?? 40) - 60,
              top: (b.y ?? 80) - 18,
              transition: 'opacity 0.2s linear',
              opacity: b.opacity ?? 1,
              pointerEvents: 'none',
              transform: 'translateZ(0)'
            }}
          >
            <div className="flex items-center space-x-3 bg-[#F2E7D8] px-4 py-2 rounded-full border border-[#D9CBB8] shadow-sm">
              <div className="w-6 h-6 rounded-full bg-[#D9CBB8]" />
              <div className="text-sm text-morandi-charcoal max-w-[220px] truncate">{b.text}</div>
            </div>
          </div>
        ))}
      </div>

      {message && (
        <div className="mt-6 p-4 bg-morandi-green/10 border border-morandi-green/30 text-morandi-green rounded-lg text-center">{message}</div>
      )}
    </div>
  );
};

export default BottleRelease;
