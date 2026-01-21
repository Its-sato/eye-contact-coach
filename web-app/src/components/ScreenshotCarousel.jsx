import React from 'react';

// Import local images from assets
import meetingImg from '../assets/meeting.jpg';
import summaryImg from '../assets/summary.png';

const screenshots = [
  { src: meetingImg, alt: 'Real-time Analysis Overlay', caption: '会議中のリアルタイム分析' },
  { src: summaryImg, alt: 'Post-meeting Summary', caption: '会議後の詳細レポート' },
];

function ScreenshotCarousel() {
  return (
    <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 py-8 px-4 scrollbar-hide justify-center">
      {screenshots.map((item, idx) => (
        <div key={idx} className="snap-center shrink-0 first:pl-4 last:pr-4">
           <div className="relative group">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full max-w-2xl rounded-xl shadow-2xl border border-slate-800 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6 rounded-b-xl">
                 <p className="text-white font-bold text-lg">{item.caption}</p>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
}

export default ScreenshotCarousel;
