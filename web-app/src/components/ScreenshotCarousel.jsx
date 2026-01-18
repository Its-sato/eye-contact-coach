import React from 'react';

// Placeholder screenshots – replace with actual images later
const screenshots = [
  'https://source.unsplash.com/featured/800x600?meeting',
  'https://source.unsplash.com/featured/800x600?video',
  'https://source.unsplash.com/featured/800x600?analytics',
];

function ScreenshotCarousel() {
  return (
    <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 py-4 scrollbar-hide">
      {screenshots.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`Screenshot ${idx + 1}`}
          className="snap-start w-full max-w-md rounded-xl shadow-lg flex-shrink-0"
        />
      ))}
    </div>
  );
}

export default ScreenshotCarousel;
