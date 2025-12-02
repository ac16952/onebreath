import { Quote, SoundTrack } from './types';

export const STATIC_QUOTES: Quote[] = [
  { text: "呼吸是連結身體與心靈的橋樑。", author: "Thich Nhat Hanh" },
  { text: "當下是你唯一擁有的時刻。", author: "Jon Kabat-Zinn" },
  { text: "平靜不是避開混亂，而是在混亂中保持安寧。", author: "Unknown" },
  { text: "慢慢來，比較快。", author: "Proverb" },
  { text: "你的心就像天空，情緒只是經過的雲。", author: "Headspace" }
];

export const SOUND_TRACKS: SoundTrack[] = [
  { id: 'rain', name: '夜雨 (Brown Noise)', type: 'brown', color: 'bg-morandi-blue' },
  { id: 'wind', name: '微風 (Pink Noise)', type: 'pink', color: 'bg-morandi-green' },
  { id: 'stream', name: '流水 (White Noise)', type: 'white', color: 'bg-morandi-sand' },
];

export const BREATH_TIMING = {
  INHALE: 4000,
  HOLD: 7000,
  EXHALE: 8000,
};
