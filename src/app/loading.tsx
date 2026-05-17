'use client';

import React, { useEffect, useRef } from 'react';

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const hexOut = containerRef.current.querySelector('#hex-out') as HTMLElement;
    const hexIn = containerRef.current.querySelector('#hex-in') as HTMLElement;
    const hexBd = containerRef.current.querySelector('#hex-border') as HTMLElement;
    const spokes = [1, 2, 3, 4, 5, 6].map((i) => containerRef.current!.querySelector('#sp' + i) as HTMLElement);
    const arBody = containerRef.current.querySelector('#ar-body') as HTMLElement;
    const arHead = containerRef.current.querySelector('#ar-head') as HTMLElement;
    const glow = containerRef.current.querySelector('#glow') as HTMLElement;
    const orbit = containerRef.current.querySelector('#orbit') as HTMLElement;
    const dots = containerRef.current.querySelector('#dots') as HTMLElement;

    let isMounted = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const set = (el: HTMLElement | null, props: any) => {
      if (!el || !isMounted) return;
      Object.assign(el.style, props);
    };

    const runIntro = async () => {
      // ── Hard reset ──
      set(hexOut, { transition: 'none', opacity: '0', transform: 'scale(0) rotate(-90deg)' });
      set(hexIn, { transition: 'none', opacity: '0', transform: 'scale(0)' });
      set(hexBd, { transition: 'none', opacity: '0' });
      spokes.forEach((s) => {
        if (s) {
          s.style.transition = 'none';
          s.style.strokeDashoffset = '18';
        }
      });
      set(arBody, { transition: 'none', opacity: '0', transform: 'translateY(14px)' });
      set(arHead, { transition: 'none', opacity: '0', transform: 'translateY(14px)' });
      set(glow, { animationPlayState: 'paused', opacity: '0' });
      set(orbit, { animationPlayState: 'paused', opacity: '0' });
      
      if (dots) dots.style.opacity = '0';

      [hexOut, hexIn, hexBd, arBody, arHead, ...spokes].forEach((el) => {
        if (el) el.style.animation = 'none';
      });

      await wait(50);
      if (!isMounted) return;

      // 1 ── Outer hex: spin + scale in with bounce ──
      set(hexOut, {
        transition: 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
        opacity: '1',
        transform: 'scale(1) rotate(0deg)',
      });
      await wait(680);
      if (!isMounted) return;

      // 2 ── Inner cutout punches in ──
      set(hexIn, {
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        opacity: '1',
        transform: 'scale(1)',
      });
      set(hexBd, { transition: 'opacity 0.4s ease', opacity: '0.3' });
      await wait(400);
      if (!isMounted) return;

      // 3 ── Spokes draw one by one ──
      for (let i = 0; i < spokes.length; i++) {
        if (spokes[i]) {
          spokes[i].style.transition = 'stroke-dashoffset 0.14s ease';
          spokes[i].style.strokeDashoffset = '0';
        }
        await wait(55);
        if (!isMounted) return;
      }
      await wait(100);
      if (!isMounted) return;

      // 4 ── Arrow rises up ──
      set(arBody, {
        transition: 'opacity 0.25s ease, transform 0.38s cubic-bezier(0.34,1.56,0.64,1)',
        opacity: '1',
        transform: 'translateY(0)',
      });
      await wait(70);
      if (!isMounted) return;
      set(arHead, {
        transition: 'opacity 0.25s ease, transform 0.38s cubic-bezier(0.34,1.56,0.64,1)',
        opacity: '1',
        transform: 'translateY(0)',
      });
      await wait(400);
      if (!isMounted) return;

      // 5 ── Glow + orbit ring wake up ──
      set(glow, { transition: 'opacity 0.5s ease', opacity: '1', animationPlayState: 'running' });
      set(orbit, { transition: 'opacity 0.5s ease', opacity: '1', animationPlayState: 'running' });
      await wait(300);
      if (!isMounted) return;

      // 6 ── Loading dots appear ──
      if (dots) dots.style.opacity = '1';
      await wait(300);
      if (!isMounted) return;

      // 7 ── Idle breath on hex + float on arrow ──
      set(hexOut, { transition: 'none', animation: 'hexBreath 2.8s ease-in-out infinite' });
      set(hexIn, { transition: 'none', animation: 'hexBreath 2.8s ease-in-out infinite' });
      set(hexBd, { transition: 'none', animation: 'hexBreath 2.8s ease-in-out infinite' });
      set(arHead, { transition: 'none', animation: 'arrowFloat 2.2s ease-in-out infinite' });
      set(arBody, { transition: 'none', animation: 'arrowFloat 2.2s ease-in-out infinite' });
      
      spokes.forEach((s, i) => {
        if (s) s.style.animation = `spokeFade 2.2s ease-in-out ${i * 0.12}s infinite`;
      });
    };

    runIntro();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0A0A0F]">
      <style dangerouslySetInnerHTML={{__html: `
        .loader-glow {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%);
          opacity: 0;
          animation: glowPulse 2.6s ease-in-out infinite;
          animation-play-state: paused;
        }

        @keyframes glowPulse {
          0%,100% { transform: scale(0.9); opacity: 0.4; }
          50%      { transform: scale(1.15); opacity: 0.9; }
        }

        .loader-orbit-ring {
          position: absolute;
          width: 154px;
          height: 154px;
          border-radius: 50%;
          border: 0.6px solid rgba(201,168,76,0.0);
          border-top-color: rgba(201,168,76,0.55);
          border-right-color: rgba(201,168,76,0.2);
          opacity: 0;
          animation: orbitSpin 1.8s linear infinite;
          animation-play-state: paused;
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes hexBreath {
          0%,100% { transform: scale(1) rotate(0deg); }
          50%      { transform: scale(1.035) rotate(0deg); }
        }
        @keyframes arrowFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-2.5px); }
        }
        @keyframes spokeFade {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }

        .loader-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #C9A84C;
          opacity: 0.2;
          animation: dotPulse 1.4s ease-in-out infinite;
        }
        .loader-dot:nth-child(2) { animation-delay: 0.22s; }
        .loader-dot:nth-child(3) { animation-delay: 0.44s; }

        @keyframes dotPulse {
          0%,100% { opacity: 0.18; transform: scale(0.8); }
          50%      { opacity: 0.9;  transform: scale(1.2); }
        }
      `}} />

      <div ref={containerRef} className="relative w-[160px] h-[160px] flex items-center justify-center">
        <div className="loader-glow" id="glow"></div>
        <div className="loader-orbit-ring" id="orbit"></div>

        <svg id="logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-[120px] h-[120px]">
          {/* OUTER HEX */}
          <polygon id="hex-out" points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26" fill="#C9A84C" transform="translate(60,60) scale(0) rotate(-90deg)" opacity="0" style={{ transformOrigin: '60px 60px' }} />

          {/* INNER CUTOUT */}
          <polygon id="hex-in" points="0,-36 31,-18 31,18 0,36 -31,18 -31,-18" fill="#0A0A0F" transform="translate(60,60) scale(0)" opacity="0" style={{ transformOrigin: '60px 60px' }} />

          {/* INNER RING BORDER */}
          <polygon id="hex-border" points="0,-36 31,-18 31,18 0,36 -31,18 -31,-18" fill="none" stroke="#E8C96A" strokeWidth="0.7" transform="translate(60,60)" opacity="0" />

          {/* SPOKES */}
          <line id="sp1" x1="60" y1="8" x2="60" y2="24" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" style={{ strokeDasharray: 18, strokeDashoffset: 18 }} />
          <line id="sp2" x1="105" y1="34" x2="91" y2="42" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" style={{ strokeDasharray: 18, strokeDashoffset: 18 }} />
          <line id="sp3" x1="105" y1="86" x2="91" y2="78" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" style={{ strokeDasharray: 18, strokeDashoffset: 18 }} />
          <line id="sp4" x1="60" y1="112" x2="60" y2="96" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" style={{ strokeDasharray: 18, strokeDashoffset: 18 }} />
          <line id="sp5" x1="15" y1="86" x2="29" y2="78" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" style={{ strokeDasharray: 18, strokeDashoffset: 18 }} />
          <line id="sp6" x1="15" y1="34" x2="29" y2="42" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" style={{ strokeDasharray: 18, strokeDashoffset: 18 }} />

          {/* HIDDEN ARROW */}
          <rect id="ar-body" x="53" y="68" width="14" height="10" rx="1.5" fill="#FFFFFF" opacity="0" transform="translate(0,0) translateY(14px)" style={{ transformOrigin: '60px 60px' }} />
          <polygon id="ar-head" points="60,44 69,68 51,68" fill="#FFFFFF" opacity="0" transform="translate(0,0) translateY(14px)" style={{ transformOrigin: '60px 60px' }} />
        </svg>

        {/* Loading dots */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 transition-opacity duration-500" id="dots">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    </div>
  );
}
