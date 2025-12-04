import React from 'react';

const SleepWell: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gradient-to-br from-white/90 to-[#F3F7F0]/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/60">
      <h2 className="text-2xl font-semibold text-[#4A6B4A] mb-3">😴 睡好覺是最好的療癒</h2>
      <p className="text-[#5A7B52]/90 mb-4">想要實現優質睡眠，可以從日常習慣與環境調整著手。下面整理了實用的建議與操作方式：</p>

      <section className="mb-4">
        <h3 className="text-lg font-semibold text-[#5A7B52] mb-2">1. 建立固定的睡眠時間表</h3>
        <p className="text-[#5A7B52]/80">定時睡覺和起床：即使在週末，也盡量保持每天在相同的時間上床睡覺和起床，幫助調節你的生理時鐘（晝夜節律）。</p>
      </section>

      <section className="mb-4">
        <h3 className="text-lg font-semibold text-[#5A7B52] mb-2">2. 創造理想的睡眠環境</h3>
        <ul className="list-disc list-inside text-[#5A7B52]/80 space-y-2">
          <li><strong>保持黑暗、安靜和涼爽：</strong>理想臥室溫度約 18°C。使用遮光窗簾、耳塞或白噪音機（如需要）來阻擋干擾。</li>
          <li><strong>選擇舒適的寢具：</strong>投資適合自己的床墊、枕頭與透氣床單，讓身體在夜間獲得真正的放鬆。</li>
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="text-lg font-semibold text-[#5A7B52] mb-2">3. 調整白天的生活習慣</h3>
        <ul className="list-disc list-inside text-[#5A7B52]/80 space-y-2">
          <li><strong>規律運動：</strong>白天進行適度運動可改善夜間睡眠品質，但避免在睡前 2–3 小時內做劇烈運動。</li>
          <li><strong>限制咖啡因與尼古丁：</strong>下午或晚上避免攝入含咖啡因與尼古丁的產品（咖啡、茶、能量飲料、巧克力等）。</li>
          <li><strong>避免睡前飲酒：</strong>酒精可能讓你昏昏欲睡，但會使夜間睡眠片段化並降低品質。</li>
          <li><strong>限制午睡：</strong>若有午睡習慣，控制在 20–30 分鐘以內，並避免在下午晚些時候小睡。</li>
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="text-lg font-semibold text-[#5A7B52] mb-2">4. 建立放鬆的睡前儀式</h3>
        <ul className="list-disc list-inside text-[#5A7B52]/80 space-y-2">
          <li>在睡前 30–60 分鐘從事平靜活動：閱讀紙本書、聽輕音樂、冥想、泡熱水澡或做溫和伸展。</li>
          <li>避免藍光：睡前至少一小時停止使用手機、平板、電腦與電視等電子設備，減少藍光對褪黑激素的抑制。</li>
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="text-lg font-semibold text-[#5A7B52] mb-2">5. 管理壓力與思緒</h3>
        <ul className="list-disc list-inside text-[#5A7B52]/80 space-y-2">
          <li>寫日記或待辦事項：若有許多思緒與擔憂，睡前寫下來幫助清空大腦，避免躺在床上反覆思考。</li>
          <li>練習正念或深呼吸：躺在床上專注於緩慢深長的呼吸，協助身體進入放鬆狀態。</li>
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="text-lg font-semibold text-[#5A7B52] mb-2">6. 如果睡不著怎麼辦？</h3>
        <p className="text-[#5A7B52]/80">若躺床超過 20 分鐘仍無法入睡，請離開臥室，到另一個光線昏暗的地方做放鬆活動，直到感到睏倦再回床上。避免在床上看電視或使用電子設備。</p>
      </section>

      {/* Video section */}
      <section className="mb-4">
        <h3 className="text-lg font-semibold text-[#5A7B52] mb-2">放鬆短片</h3>
        <p className="text-[#5A7B52]/80 mb-2">下方影片放在 `public/video/video1.mp4`，若尚未上傳請將檔案放入該位置。</p>
        <div className="w-full rounded overflow-hidden shadow-inner border border-white/30">
          <video
            className="w-full h-auto bg-black"
            controls
            preload="metadata"
            playsInline
            poster="/video/poster.jpg"
          >
            <source src="/video/video1.mp4" type="video/mp4" />
            你的瀏覽器不支援 HTML5 影片標籤。請下載影片並使用本機播放器播放。
          </video>
        </div>
      </section>

    </div>
  );
};

export default SleepWell;
