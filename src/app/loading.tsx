'use client';

import React, { useEffect, useRef } from 'react';

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;
    let isMounted = true;

    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    function tween(fn: (p: number) => void, ms: number) {
      return new Promise<void>((resolve) => {
        const t0 = performance.now();
        function step(now: number) {
          const p = Math.min((now - t0) / ms, 1);
          fn(p);
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });
    }

    const spring  = (t: number) => 1 - Math.pow(2, -9 * t) * Math.cos(t * Math.PI * 2.1);
    const easeIO  = (t: number) => t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;

    function setStyle(el: Element | null, props: Partial<CSSStyleDeclaration>) {
      if (!el) return;
      Object.assign((el as HTMLElement).style, props);
    }

    async function run() {
      const arHead   = root.querySelector<SVGElement>('#ar-head');
      const arBody   = root.querySelector<SVGElement>('#ar-body');
      const strips   = [1,2,3,4,5,6].map(i => root.querySelector<SVGLineElement>(`#st${i}`));
      const glow     = root.querySelector<HTMLElement>('#glow');
      const orbit1   = root.querySelector<HTMLElement>('#orbit1');
      const orbit2   = root.querySelector<HTMLElement>('#orbit2');
      const progWrap = root.querySelector<HTMLElement>('#progWrap');
      const progFill = root.querySelector<HTMLElement>('#progFill');
      const progPct  = root.querySelector<HTMLElement>('#progPct');

      /* ── RESET ── */
      if (progWrap) progWrap.style.opacity = '0';
      if (progFill) progFill.style.width   = '0%';
      if (progPct)  progPct.textContent    = 'LOADING';
      if (glow)     glow.style.opacity     = '0';

      setStyle(arHead, { opacity:'0', transform:'translateY(14px)', animation:'none' });
      setStyle(arBody, { opacity:'0', transform:'translateY(14px)', animation:'none' });

      const fullStrips = [
        { x1:60,  y1:-200, x2:60,  y2:320 },
        { x1:105, y1:-200, x2:105, y2:320 },
        { x1:105, y1:-200, x2:105, y2:320 },
        { x1:60,  y1:-200, x2:60,  y2:320 },
        { x1:15,  y1:-200, x2:15,  y2:320 },
        { x1:15,  y1:-200, x2:15,  y2:320 },
      ];

      strips.forEach((s, i) => {
        if (!s) return;
        s.style.opacity    = '0';
        s.style.transition = 'none';
        s.style.animation  = 'none';
        s.setAttribute('x1', String(fullStrips[i].x1));
        s.setAttribute('y1', String(fullStrips[i].y1));
        s.setAttribute('x2', String(fullStrips[i].x2));
        s.setAttribute('y2', String(fullStrips[i].y2));
      });

      if (orbit1) { orbit1.style.opacity = '0'; orbit1.style.animationPlayState = 'paused'; }
      if (orbit2) { orbit2.style.opacity = '0'; orbit2.style.animationPlayState = 'paused'; }

      await wait(300);
      if (!isMounted) return;

      /* PHASE 1 — Strips flash on (venetian blinds) */
      for (let i = 0; i < strips.length; i++) {
        if (strips[i]) {
          strips[i]!.style.transition = 'opacity 0.1s ease';
          strips[i]!.style.opacity    = '1';
        }
        await wait(45);
        if (!isMounted) return;
      }
      await wait(160);
      if (!isMounted) return;

      /* PHASE 2 — Strips retract → become spokes */
      const spokeTargets = [
        { x1:60,  y1:8,   x2:60,  y2:24  },
        { x1:105, y1:34,  x2:91,  y2:42  },
        { x1:105, y1:86,  x2:91,  y2:78  },
        { x1:60,  y1:112, x2:60,  y2:96  },
        { x1:15,  y1:86,  x2:29,  y2:78  },
        { x1:15,  y1:34,  x2:29,  y2:42  },
      ];

      await tween((t) => {
        const e = easeIO(t);
        strips.forEach((s, i) => {
          if (!s) return;
          const f  = fullStrips[i];
          const to = spokeTargets[i];
          s.setAttribute('x1', String(f.x1 + (to.x1 - f.x1) * e));
          s.setAttribute('y1', String(f.y1 + (to.y1 - f.y1) * e));
          s.setAttribute('x2', String(f.x2 + (to.x2 - f.x2) * e));
          s.setAttribute('y2', String(f.y2 + (to.y2 - f.y2) * e));
        });
      }, 400);
      await wait(100);
      if (!isMounted) return;

      /* PHASE 3 — Arrow rises */
      setStyle(arBody, { transition:'opacity 0.25s ease, transform 0.38s cubic-bezier(0.34,1.56,0.64,1)', opacity:'1', transform:'translateY(0)' });
      await wait(65);
      if (!isMounted) return;
      setStyle(arHead, { transition:'opacity 0.25s ease, transform 0.38s cubic-bezier(0.34,1.56,0.64,1)', opacity:'1', transform:'translateY(0)' });
      await wait(350);
      if (!isMounted) return;

      /* PHASE 4 — Glow + orbits */
      if (glow)   glow.style.opacity = '1';
      if (orbit1) { orbit1.style.opacity = '0.9'; orbit1.style.animationPlayState = 'running'; }
      if (orbit2) { orbit2.style.opacity = '0.9'; orbit2.style.animationPlayState = 'running'; }
      await wait(250);
      if (!isMounted) return;

      /* PHASE 5 — Progress bar fills */
      if (progWrap) progWrap.style.opacity = '1';
      await wait(120);
      if (!isMounted) return;

      const fillDuration = 2000;
      const t0 = performance.now();
      await new Promise<void>((resolve) => {
        function step(now: number) {
          if (!isMounted) { resolve(); return; }
          const progress = Math.min((now - t0) / fillDuration, 1);
          const eased = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;
          const pct = Math.round(eased * 100);
          if (progFill) progFill.style.width = pct + '%';
          if (progPct)  progPct.textContent  = pct < 100 ? pct + '%' : 'READY';
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });
      if (!isMounted) return;

      /* PHASE 6 — Idle breathing */
      await wait(200);
      if (arHead) arHead.style.animation = 'loaderFloatUp 2.4s ease-in-out infinite';
      if (arBody) arBody.style.animation = 'loaderFloatUp 2.4s ease-in-out infinite';
      strips.forEach((s, i) => {
        if (s) s.style.animation = `loaderSpokeDim 2.4s ease-in-out ${i * 0.13}s infinite`;
      });
    }

    run();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0A0A0F]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loaderSpin  { to { transform: rotate(360deg);  } }
        @keyframes loaderSpinR { to { transform: rotate(-360deg); } }
        @keyframes loaderBreath {
          0%,100% { transform: scale(1);      }
          50%      { transform: scale(1.032); }
        }
        @keyframes loaderFloatUp {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-3px); }
        }
        @keyframes loaderSpokeDim {
          0%,100% { opacity: 1;   }
          50%      { opacity: 0.5; }
        }
        @keyframes loaderShimmer { to { transform: translateX(200%); } }
        @keyframes loaderBlink {
          0%,100% { opacity: 0.15; transform: scale(0.8); }
          50%      { opacity: 1;    transform: scale(1.3); }
        }

        .loader-glow {
          position: absolute;
          width: 340px; height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 68%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .loader-orbit {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
        }
        .loader-orbit-1 {
          inset: -18px;
          border: 0.7px solid transparent;
          border-top-color: rgba(201,168,76,0.5);
          border-right-color: rgba(201,168,76,0.15);
          animation: loaderSpin 2.2s linear infinite;
          animation-play-state: paused;
        }
        .loader-orbit-2 {
          inset: -10px;
          border: 0.4px solid transparent;
          border-bottom-color: rgba(201,168,76,0.25);
          border-left-color: rgba(201,168,76,0.08);
          animation: loaderSpinR 3.4s linear infinite;
          animation-play-state: paused;
        }

        .loader-prog-track {
          width: 100%;
          height: 1px;
          background: rgba(201,168,76,0.12);
          position: relative;
          overflow: hidden;
        }
        .loader-prog-track::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent);
          transform: translateX(-100%);
          animation: loaderShimmer 1.8s ease-in-out infinite;
        }
        .loader-prog-fill {
          position: absolute;
          top: 0; left: 0;
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #8B6914, #C9A84C, #E8C96A);
          transition: width 0.06s linear;
        }
        .loader-prog-fill::after {
          content: '';
          position: absolute;
          right: 0; top: -2px;
          width: 4px; height: 5px;
          background: #E8C96A;
          border-radius: 50%;
          box-shadow: 0 0 6px 2px rgba(232,201,106,0.7);
        }
        .loader-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #C9A84C;
          animation: loaderBlink 1.5s ease-in-out infinite;
        }
        .loader-dot:nth-child(2) { animation-delay: 0.25s; }
        .loader-dot:nth-child(3) { animation-delay: 0.5s;  }
      `}} />

      <div ref={containerRef} className="flex flex-col items-center" style={{ gap: '36px' }}>
        {/* Scene */}
        <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
          <div className="loader-glow" id="glow" />
          <div className="loader-orbit loader-orbit-1" id="orbit1" />
          <div className="loader-orbit loader-orbit-2" id="orbit2" />

          <svg id="logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"
            style={{ position:'relative', zIndex:2, width:140, height:140, overflow:'visible' }}>

            {/* Arrow — behind strips */}
            <rect    id="ar-body" x="53" y="68" width="14" height="10" rx="1.5" fill="#FFFFFF" opacity="0" />
            <polygon id="ar-head" points="60,44 69,68 51,68" fill="#FFFFFF" opacity="0" />

            {/* 6 strips — drawn on top so hex slides behind them */}
            <g id="layer-strips">
              <line id="st1" x1="60"  y1="-200" x2="60"  y2="320" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" opacity="0" />
              <line id="st2" x1="105" y1="-200" x2="105" y2="320" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" opacity="0" />
              <line id="st3" x1="105" y1="-200" x2="105" y2="320" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" opacity="0" />
              <line id="st4" x1="60"  y1="-200" x2="60"  y2="320" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" opacity="0" />
              <line id="st5" x1="15"  y1="-200" x2="15"  y2="320" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" opacity="0" />
              <line id="st6" x1="15"  y1="-200" x2="15"  y2="320" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" opacity="0" />
            </g>
          </svg>
        </div>

        {/* Progress */}
        <div id="progWrap" style={{ opacity:0, transition:'opacity 0.5s ease', width:140, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <div className="loader-prog-track" style={{ width:'100%' }}>
            <div className="loader-prog-fill" id="progFill" />
          </div>
          <p id="progPct" style={{ fontSize:9, letterSpacing:5, color:'rgba(201,168,76,0.55)', fontWeight:300, fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", minWidth:80, textAlign:'center' }}>
            LOADING
          </p>
          <div style={{ display:'flex', gap:7 }}>
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
