'use client'
import React from 'react'


const BackgroundRippleEffect = ({ className = "" }) => {
  return (
    <div
      className={`
        absolute inset-0 -z-10 overflow-hidden 
        ${className}
      `
      
    }
      style={{
        background: `
          radial-gradient(circle at 50% 30%, rgba(0, 80, 255, 0.2), rgba(0,0,0,0.9) 70%),
          repeating-linear-gradient(
            to right,
            rgba(255,255,255,0.05) 0px,
            rgba(255,255,255,0.05) 1px,
            rgba(0,0,0,0.9) 1px,
            rgba(0,0,0,0.9) 40px
          ),
          repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.05) 0px,
            rgba(255,255,255,0.05) 1px,
            rgba(0,0,0,0.9) 1px,
            rgba(0,0,0,0.9) 40px
          )
        `,
        backgroundBlendMode: "overlay",
      }}
    
    >
      <div className="gray-bg w-full h-full"></div>
    </div>
  );
};

export { BackgroundRippleEffect };
