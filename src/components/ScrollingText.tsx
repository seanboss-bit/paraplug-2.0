"use client";

import React from "react";

interface ScrollingTextProps {
  text: string;
  speed?: number;
}

const ScrollingText = ({ text, speed = 20 }: ScrollingTextProps) => {
  const animationDuration = `${text.length / speed}s`;

  return (
    <div className="w-full overflow-hidden whitespace-nowrap bg-black py-4 px-10 relative">
      <style jsx>{`
        @keyframes scrollText {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .scrollText {
          animation: scrollText linear infinite;
        }
      `}</style>

      <div
        className="inline-block text-white text-xl font-bold scrollText"
        style={{ animationDuration }}
      >
        {text}
        <span className="ml-8">{text}</span>
      </div>
    </div>
  );
};

export default ScrollingText;
