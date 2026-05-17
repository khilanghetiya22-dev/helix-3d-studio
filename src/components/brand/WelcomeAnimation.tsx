'use client';

import React, { useEffect, useRef } from 'react';

interface WelcomeAnimationProps {
  onComplete?: () => void;
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Helper functions
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const set = (el: HTMLElement | null, props: any) => {
      if (!el) return;
      Object.assign(el.style, props);
    };

    function tween(fn: (t: number) => void, duration: number) {
      return new Promise<void>((resolve) => {
        const start = performance.now();
        function step(now: number) {
          const t = Math.min((now - start) / duration, 1);
          fn(t);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });
    }

    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);
    const spring = (t: number) => 1 - Math.pow(2, -8 * t) * Math.cos(t * Math.PI * 2.2);

    function setTX(el: HTMLElement | null, x: number, y: number) {
      if (el) el.setAttribute('transform', `translate(${x},${y})`);
    }

    const hexOut = containerRef.current.querySelector('#hex-outer') as HTMLElement;
    const hexIn = containerRef.current.querySelector('#hex-inner') as HTMLElement;
    const hexBd = containerRef.current.querySelector('#inner-border') as HTMLElement;
    const arHead = containerRef.current.querySelector('#arrow-head') as HTMLElement;
    const arBody = containerRef.current.querySelector('#arrow-body') as HTMLElement;
    const strips = [1, 2, 3, 4, 5, 6].map((i) => containerRef.current!.querySelector('#strip' + i) as HTMLElement);
    const divider = containerRef.current.querySelector('#divider') as HTMLElement;
    const textRule = containerRef.current.querySelector('#text-rule') as HTMLElement;
    const txHelix = containerRef.current.querySelector('#text-helix') as HTMLElement;
    const txStudio = containerRef.current.querySelector('#text-studio') as HTMLElement;
    const txTag = containerRef.current.querySelector('#text-tagline') as HTMLElement;
    const botRule = containerRef.current.querySelector('#bottom-rule') as HTMLElement;
    const txBot = containerRef.current.querySelector('#text-bottom') as HTMLElement;

    let isMounted = true;

    const runAnimation = async () => {
      /* ── Hard reset ── */
      setTX(hexOut, -110, 160); if (hexOut) hexOut.style.opacity = '0';
      setTX(hexIn, -110, 160); if (hexIn) hexIn.style.opacity = '0';
      if (hexBd) {
        hexBd.setAttribute('transform', 'translate(-110,160)');
        hexBd.style.opacity = '0';
      }

      set(arHead, { opacity: '0' }); if (arHead) arHead.style.transform = 'translateY(28px)';
      set(arBody, { opacity: '0' }); if (arBody) arBody.style.transform = 'translateY(28px)';

      strips.forEach((s) => {
        if (s) {
          s.style.opacity = '0';
          s.style.transition = 'none';
        }
      });

      if (divider) divider.style.strokeDashoffset = '176';
      if (textRule) textRule.style.strokeDashoffset = '352';
      if (botRule) botRule.style.strokeDashoffset = '600';

      set(txHelix, { opacity: '0', transform: 'translateX(28px)' });
      set(txStudio, { opacity: '0', transform: 'translateX(18px)' });
      set(txTag, { opacity: '0' });
      set(txBot, { opacity: '0' });

      await wait(300);
      if (!isMounted) return;

      /* PHASE 1 — Flash the 6 full-height strips */
      for (let i = 0; i < strips.length; i++) {
        if (strips[i]) {
          strips[i].style.transition = 'opacity 0.12s ease';
          strips[i].style.opacity = '1';
        }
        await wait(55);
        if (!isMounted) return;
      }
      await wait(180);
      if (!isMounted) return;

      /* PHASE 2 — Hex slides in from left */
      if (hexOut) hexOut.style.opacity = '1';

      await tween((t) => {
        const ease = spring(t);
        const x = -110 + (148 - (-110)) * ease;
        setTX(hexOut, x, 160);
        setTX(hexIn, x, 160);
        setTX(hexBd, x, 160);
      }, 800);
      await wait(80);
      if (!isMounted) return;

      /* PHASE 3 — Inner cutout punches in */
      if (hexIn) hexIn.style.opacity = '1';
      if (hexBd) hexBd.style.opacity = '0.3';
      await wait(300);
      if (!isMounted) return;

      /* PHASE 4 — Strips RETRACT to spoke positions */
      const spokeTargets = [
        { x1: 148, y1: 48, x2: 148, y2: 82 },
        { x1: 245, y1: 104, x2: 215, y2: 121 },
        { x1: 245, y1: 216, x2: 215, y2: 199 },
        { x1: 148, y1: 272, x2: 148, y2: 238 },
        { x1: 51, y1: 216, x2: 81, y2: 199 },
        { x1: 51, y1: 104, x2: 81, y2: 121 },
      ];

      const stripInit = strips.map((s) => {
        if (!s) return { x1: 0, y1: 0, x2: 0, y2: 0 };
        return {
          x1: parseFloat(s.getAttribute('x1') || '0'),
          y1: parseFloat(s.getAttribute('y1') || '0'),
          x2: parseFloat(s.getAttribute('x2') || '0'),
          y2: parseFloat(s.getAttribute('y2') || '0'),
        };
      });

      await tween((t) => {
        const e = easeInOut(t);
        strips.forEach((s, i) => {
          if (!s) return;
          const from = stripInit[i];
          const to = spokeTargets[i];
          s.setAttribute('x1', String(from.x1 + (to.x1 - from.x1) * e));
          s.setAttribute('y1', String(from.y1 + (to.y1 - from.y1) * e));
          s.setAttribute('x2', String(from.x2 + (to.x2 - from.x2) * e));
          s.setAttribute('y2', String(from.y2 + (to.y2 - from.y2) * e));
        });
      }, 420);
      await wait(120);
      if (!isMounted) return;

      /* PHASE 5 — Arrow rises */
      set(arBody, { transition: 'opacity 0.28s ease, transform 0.38s cubic-bezier(0.34,1.56,0.64,1)', opacity: '1', transform: 'translateY(0)' });
      await wait(70);
      if (!isMounted) return;
      set(arHead, { transition: 'opacity 0.28s ease, transform 0.38s cubic-bezier(0.34,1.56,0.64,1)', opacity: '1', transform: 'translateY(0)' });
      await wait(360);
      if (!isMounted) return;

      /* PHASE 6 — Divider draws down */
      if (divider) {
        divider.style.transition = 'stroke-dashoffset 0.32s ease';
        divider.style.strokeDashoffset = '0';
      }
      await wait(280);
      if (!isMounted) return;

      /* PHASE 7 — HELIX slides in */
      set(txHelix, { transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)', opacity: '1', transform: 'translateX(0)' });
      await wait(340);
      if (!isMounted) return;

      /* PHASE 8 — Rule draws */
      if (textRule) {
        textRule.style.transition = 'stroke-dashoffset 0.38s ease';
        textRule.style.strokeDashoffset = '0';
      }
      await wait(280);
      if (!isMounted) return;

      /* PHASE 9 — 3D STUDIO */
      set(txStudio, { transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)', opacity: '1', transform: 'translateX(0)' });
      await wait(240);
      if (!isMounted) return;

      /* PHASE 10 — Tagline */
      if (txTag) {
        txTag.style.transition = 'opacity 0.6s ease';
        txTag.style.opacity = '0.28';
      }
      await wait(380);
      if (!isMounted) return;

      /* PHASE 11 — Bottom rule + text */
      if (botRule) {
        botRule.style.transition = 'stroke-dashoffset 0.5s ease';
        botRule.style.strokeDashoffset = '0';
      }
      await wait(280);
      if (!isMounted) return;

      if (txBot) {
        txBot.style.transition = 'opacity 0.5s ease';
        txBot.style.opacity = '0.18';
      }

      await wait(600);
      if (!isMounted) return;

      if (onComplete) {
        onComplete();
      }
    };

    const timer = setTimeout(runAnimation, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="relative w-[680px] h-[320px] max-w-[90vw]">
      <svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full overflow-visible">
        <defs>
          <clipPath id="stageClip">
            <rect x="0" y="0" width="680" height="320" rx="14"/>
          </clipPath>
        </defs>

        <rect width="680" height="320" fill="#0A0A0F" rx="14"/>

        {/* LAYER 1 — BACK */}
        <g id="layer-back" clipPath="url(#stageClip)">
          {/* HEXAGON OUTER */}
          <polygon id="hex-outer" points="0,-112 97,-56 97,56 0,112 -97,56 -97,-56" fill="#C9A84C" transform="translate(-110,160)" opacity="0" style={{ transformOrigin: '148px 160px' }} />

          {/* HEXAGON INNER CUTOUT */}
          <polygon id="hex-inner" points="0,-78 67,-39 67,39 0,78 -67,39 -67,-39" fill="#0A0A0F" transform="translate(-110,160)" opacity="0" style={{ transformOrigin: '148px 160px' }} />

          {/* INNER RING BORDER */}
          <polygon id="inner-border" points="0,-78 67,-39 67,39 0,78 -67,39 -67,-39" fill="none" stroke="#E8C96A" strokeWidth="0.8" transform="translate(-110,160)" opacity="0" />

          {/* ARROW HEAD + BODY */}
          <polygon id="arrow-head" points="148,102 159,178 137,178" fill="#FFFFFF" opacity="0" />
          <rect id="arrow-body" x="138" y="178" width="20" height="22" rx="2" fill="#FFFFFF" opacity="0" />
        </g>

        {/* LAYER 2 — FRONT (STRIPS) */}
        <g id="layer-strips" clipPath="url(#stageClip)">
          <line id="strip1" x1="148" y1="0" x2="148" y2="320" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="butt" opacity="0" />
          <line id="strip2" x1="245" y1="0" x2="245" y2="320" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="butt" opacity="0" />
          <line id="strip3" x1="245" y1="0" x2="245" y2="320" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="butt" opacity="0" />
          <line id="strip4" x1="148" y1="0" x2="148" y2="320" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="butt" opacity="0" />
          <line id="strip5" x1="51" y1="0" x2="51" y2="320" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="butt" opacity="0" />
          <line id="strip6" x1="51" y1="0" x2="51" y2="320" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="butt" opacity="0" />
        </g>

        {/* LAYER 3 — TEXT */}
        <g id="layer-text">
          <line id="divider" x1="272" y1="72" x2="272" y2="248" stroke="#C9A84C" strokeWidth="0.8" opacity="0.22" style={{ strokeDasharray: 176, strokeDashoffset: 176 }} />
          <line id="text-rule" x1="300" y1="188" x2="652" y2="188" stroke="#C9A84C" strokeWidth="0.6" opacity="0.35" style={{ strokeDasharray: 352, strokeDashoffset: 352 }} />

          <text id="text-helix" x="298" y="163" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="500" fontSize="88" fill="#F5F0E8" letterSpacing="14" dominantBaseline="middle" opacity="0">HELIX</text>
          <text id="text-studio" x="301" y="210" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="300" fontSize="12" fill="#C9A84C" letterSpacing="10" dominantBaseline="middle" opacity="0">3D  STUDIO</text>
          <text id="text-tagline" x="650" y="210" fontFamily="Georgia, Times New Roman, serif" fontStyle="italic" fontSize="11" fill="#F5F0E8" opacity="0" textAnchor="end" dominantBaseline="middle">Where ideas take shape.</text>

          <line id="bottom-rule" x1="40" y1="287" x2="640" y2="287" stroke="#C9A84C" strokeWidth="0.4" opacity="0.12" style={{ strokeDasharray: 600, strokeDashoffset: 600 }} />
          <text id="text-bottom" x="340" y="305" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="300" fontSize="9" fill="#C9A84C" opacity="0" letterSpacing="6" textAnchor="middle">PRECISION  ·  ENGINEERING  ·  INNOVATION</text>
        </g>
      </svg>
    </div>
  );
}
