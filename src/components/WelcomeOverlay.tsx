'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WelcomeAnimation from './brand/WelcomeAnimation';

function WelcomeOverlayInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setShow(true);
    }
  }, [searchParams]);

  if (!show) return null;

  const handleComplete = () => {
    setFade(true);
    
    setTimeout(() => {
      setShow(false);
      const newUrl = window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }, 800);
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0F] transition-opacity duration-700 ease-in-out ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <WelcomeAnimation onComplete={handleComplete} />
    </div>
  );
}

export default function WelcomeOverlay() {
  return (
    <Suspense fallback={null}>
      <WelcomeOverlayInner />
    </Suspense>
  );
}
