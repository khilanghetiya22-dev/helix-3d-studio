'use client';

import React, { useEffect, useRef } from 'react';

interface WelcomeAnimationProps {
  onComplete?: () => void;
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const easeFn = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const hexOuter = containerRef.current.querySelector('#hex-outer') as HTMLElement;
    const hexInner = containerRef.current.querySelector('#hex-inner') as HTMLElement;
    const innerBorder = containerRef.current.querySelector('#inner-border') as HTMLElement;
    const spokes = [1, 2, 3, 4, 5, 6].map((i) => containerRef.current!.querySelector('#s' + i) as HTMLElement);
    const arrowHead = containerRef.current.querySelector('#arrow-head') as HTMLElement;
    const arrowBody = containerRef.current.querySelector('#arrow-body') as HTMLElement;
    const divider = containerRef.current.querySelector('#divider') as HTMLElement;
    const textRule = containerRef.current.querySelector('#text-rule') as HTMLElement;
    const textHelix = containerRef.current.querySelector('#text-helix') as HTMLElement;
    const textStudio = containerRef.current.querySelector('#text-studio') as HTMLElement;
    const textTagline = containerRef.current.querySelector('#text-tagline') as HTMLElement;
    const bottomRule = containerRef.current.querySelector('#bottom-rule') as HTMLElement;
    const textBottom = containerRef.current.querySelector('#text-bottom') as HTMLElement;

    const setStyle = (el: HTMLElement | null, props: any) => {
      if (!el) return;
      for (const k in props) {
        if (k === 'opacity') el.style.opacity = props[k];
        if (k === 'dashoffset') el.style.strokeDashoffset = props[k];
        if (k === 'transform') el.style.transform = props[k];
      }
    };

    const runAnimation = async () => {
      setStyle(hexOuter, { opacity: 0, transform: 'translate(0,0) scale(0) rotate(-60deg)' });
      setStyle(hexInner, { opacity: 0, transform: 'translate(0,0) scale(0)' });
      setStyle(innerBorder, { opacity: 0 });
      spokes.forEach((s) => setStyle(s, { dashoffset: 40 }));
      setStyle(arrowHead, { opacity: 0, transform: 'translateY(30px)' });
      setStyle(arrowBody, { opacity: 0, transform: 'translateY(30px)' });
      setStyle(divider, { dashoffset: 176 });
      setStyle(textRule, { dashoffset: 352 });
      setStyle(textHelix, { opacity: 0, transform: 'translateX(30px)' });
      setStyle(textStudio, { opacity: 0, transform: 'translateX(20px)' });
      setStyle(textTagline, { opacity: 0 });
      setStyle(bottomRule, { dashoffset: 600 });
      setStyle(textBottom, { opacity: 0 });

      await new Promise((r) => setTimeout(r, 400));

      // 1. Outer hexagon spins in
      if (hexOuter) {
        hexOuter.style.transition = 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease';
        hexOuter.style.opacity = '1';
        hexOuter.style.transform = 'translate(0,0) scale(1) rotate(0deg)';
      }
      await new Promise((r) => setTimeout(r, 720));

      // 2. Inner cutout punches in
      if (hexInner) {
        hexInner.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease';
        hexInner.style.opacity = '1';
        hexInner.style.transform = 'translate(0,0) scale(1)';
      }
      if (innerBorder) {
        innerBorder.style.transition = 'opacity 0.4s ease';
        innerBorder.style.opacity = '0.3';
      }
      await new Promise((r) => setTimeout(r, 460));

      // 3. Spokes draw in one by one
      for (let i = 0; i < spokes.length; i++) {
        if (spokes[i]) {
          spokes[i].style.transition = 'stroke-dashoffset 0.18s ease';
          spokes[i].style.strokeDashoffset = '0';
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      await new Promise((r) => setTimeout(r, 100));

      // 4. Arrow rises up
      if (arrowBody) {
        arrowBody.style.transition = 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        arrowBody.style.opacity = '1';
        arrowBody.style.transform = 'translateY(0)';
      }
      await new Promise((r) => setTimeout(r, 80));
      if (arrowHead) {
        arrowHead.style.transition = 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        arrowHead.style.opacity = '1';
        arrowHead.style.transform = 'translateY(0)';
      }
      await new Promise((r) => setTimeout(r, 380));

      // 5. Divider line draws down
      if (divider) {
        divider.style.transition = 'stroke-dashoffset 0.35s ease';
        divider.style.strokeDashoffset = '0';
      }
      await new Promise((r) => setTimeout(r, 300));

      // 6. HELIX slides in
      if (textHelix) {
        textHelix.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
        textHelix.style.opacity = '1';
        textHelix.style.transform = 'translateX(0)';
      }
      await new Promise((r) => setTimeout(r, 350));

      // 7. Rule draws across
      if (textRule) {
        textRule.style.transition = 'stroke-dashoffset 0.4s ease';
        textRule.style.strokeDashoffset = '0';
      }
      await new Promise((r) => setTimeout(r, 300));

      // 8. 3D STUDIO slides in
      if (textStudio) {
        textStudio.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
        textStudio.style.opacity = '1';
        textStudio.style.transform = 'translateX(0)';
      }
      await new Promise((r) => setTimeout(r, 250));

      // 9. Tagline fades in
      if (textTagline) {
        textTagline.style.transition = 'opacity 0.6s ease';
        textTagline.style.opacity = '0.28';
      }
      await new Promise((r) => setTimeout(r, 400));

      // 10. Bottom rule + text
      if (bottomRule) {
        bottomRule.style.transition = 'stroke-dashoffset 0.5s ease';
        bottomRule.style.strokeDashoffset = '0';
      }
      await new Promise((r) => setTimeout(r, 300));
      if (textBottom) {
        textBottom.style.transition = 'opacity 0.5s ease';
        textBottom.style.opacity = '0.18';
      }

      await new Promise((r) => setTimeout(r, 600));

      if (onComplete) {
        onComplete();
      }
    };

    const timer = setTimeout(runAnimation, 300);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div ref={containerRef} className="relative w-[680px] h-[320px] max-w-[90vw]">
      <svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full">
        {/* HEXAGON OUTER */}
        <polygon id="hex-outer" points="0,-112 97,-56 97,56 0,112 -97,56 -97,-56" fill="#C9A84C" transform="translate(148,160) scale(0) rotate(-60deg)" opacity="0" />

        {/* HEXAGON INNER CUTOUT */}
        <polygon id="hex-inner" points="0,-78 67,-39 67,39 0,78 -67,39 -67,-39" fill="#0A0A0F" transform="translate(148,160) scale(0)" opacity="0" />

        {/* INNER RING BORDER */}
        <polygon id="inner-border" points="0,-78 67,-39 67,39 0,78 -67,39 -67,-39" fill="none" stroke="#E8C96A" strokeWidth="0.8" opacity="0" transform="translate(148,160)" />

        {/* SPOKE LINES */}
        <line id="s1" x1="148" y1="48" x2="148" y2="82" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />
        <line id="s2" x1="245" y1="104" x2="215" y2="121" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />
        <line id="s3" x1="245" y1="216" x2="215" y2="199" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />
        <line id="s4" x1="148" y1="272" x2="148" y2="238" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />
        <line id="s5" x1="51" y1="216" x2="81" y2="199" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />
        <line id="s6" x1="51" y1="104" x2="81" y2="121" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />

        {/* ARROW HEAD + BODY */}
        <polygon id="arrow-head" points="148,102 159,178 137,178" fill="#FFFFFF" opacity="0" transform="translate(0,0) translateY(30px)" style={{ transformOrigin: '148px 160px' }} />
        <rect id="arrow-body" x="138" y="178" width="20" height="22" rx="2" fill="#FFFFFF" opacity="0" transform="translate(0,0) translateY(30px)" style={{ transformOrigin: '148px 160px' }} />

        {/* VERTICAL DIVIDER */}
        <line id="divider" x1="272" y1="72" x2="272" y2="248" stroke="#C9A84C" strokeWidth="0.8" opacity="0.22" style={{ strokeDasharray: 176, strokeDashoffset: 176 }} />

        {/* HORIZONTAL RULE */}
        <line id="text-rule" x1="300" y1="188" x2="652" y2="188" stroke="#C9A84C" strokeWidth="0.6" opacity="0.35" style={{ strokeDasharray: 352, strokeDashoffset: 352 }} />

        {/* HELIX WORDMARK */}
        <text id="text-helix" x="298" y="163" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="500" fontSize="88" fill="#F5F0E8" letterSpacing="14" dominantBaseline="middle" opacity="0" transform="translate(0,0) translateX(30px)">
          HELIX
        </text>

        {/* 3D STUDIO */}
        <text id="text-studio" x="301" y="210" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="300" fontSize="12" fill="#C9A84C" letterSpacing="10" dominantBaseline="middle" opacity="0" transform="translate(0,0) translateX(20px)">
          3D  STUDIO
        </text>

        {/* TAGLINE */}
        <text id="text-tagline" x="650" y="210" fontFamily="Georgia, Times New Roman, serif" fontStyle="italic" fontSize="11" fill="#F5F0E8" opacity="0" textAnchor="end" dominantBaseline="middle">
          Where ideas take shape.
        </text>

        {/* BOTTOM RULE */}
        <line id="bottom-rule" x1="40" y1="287" x2="640" y2="287" stroke="#C9A84C" strokeWidth="0.4" opacity="0.12" style={{ strokeDasharray: 600, strokeDashoffset: 600 }} />

        {/* BOTTOM TEXT */}
        <text id="text-bottom" x="340" y="305" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="300" fontSize="9" fill="#C9A84C" opacity="0" letterSpacing="6" textAnchor="middle">
          PRECISION  ·  ENGINEERING  ·  INNOVATION
        </text>
      </svg>
    </div>
  );
}
