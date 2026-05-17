'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0A0A0F]">
      <style dangerouslySetInnerHTML={{__html: `
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }

        .ring-wrap {
          position: relative;
          width: 96px;
          height: 96px;
        }

        .loader-ring {
          position: absolute;
          inset: 0;
          animation: spin 3s linear infinite;
        }

        .loader-ring polygon {
          fill: none;
          stroke: #C9A84C;
          stroke-width: 1;
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: draw 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .logo-mark {
          position: absolute;
          inset: 0;
        }

        .loader-label {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 8px;
          letter-spacing: 6px;
          color: #C9A84C;
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes draw {
          0%   { stroke-dashoffset: 260; opacity: 0; }
          15%  { opacity: 1; }
          50%  { stroke-dashoffset: 0;   opacity: 1; }
          85%  { opacity: 1; }
          100% { stroke-dashoffset: -260; opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.65; }
        }
      `}} />

      <div className="loader-container">
        <div className="ring-wrap">
          {/* Spinning dashed hex outline */}
          <svg className="loader-ring" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
            <polygon points="48,6 84,27 84,69 48,90 12,69 12,27"/>
          </svg>

          {/* Static logo mark scaled to fit inside */}
          <svg className="logo-mark" viewBox="0 0 296 320" xmlns="http://www.w3.org/2000/svg">
            {/* Gold outer hex */}
            <polygon points="148,48 245,104 245,216 148,272 51,216 51,104" fill="#C9A84C"/>
            
            {/* Dark inner cutout */}
            <polygon points="148,82 215,121 215,199 148,238 81,199 81,121" fill="#0A0A0F"/>
            
            {/* Inner border ring */}
            <polygon points="148,82 215,121 215,199 148,238 81,199 81,121" fill="none" stroke="#E8C96A" strokeWidth="1.2"/>
            
            {/* 6 spokes */}
            <line x1="148" y1="48" x2="148" y2="82" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
            <line x1="245" y1="104" x2="215" y2="121" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
            <line x1="245" y1="216" x2="215" y2="199" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
            <line x1="148" y1="272" x2="148" y2="238" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
            <line x1="51" y1="216" x2="81" y2="199" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
            <line x1="51" y1="104" x2="81" y2="121" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
            
            {/* Arrow */}
            <polygon points="148,134 163,178 133,178" fill="#FFFFFF"/>
            <rect x="138" y="178" width="20" height="22" rx="3" fill="#FFFFFF"/>
          </svg>
        </div>

        <span className="loader-label">LOADING</span>
      </div>
    </div>
  );
}
