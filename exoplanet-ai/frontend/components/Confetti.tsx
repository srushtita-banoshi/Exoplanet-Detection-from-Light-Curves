'use client';

import { useEffect } from 'react';

export function fireConfetti() {
  if (typeof window === 'undefined') return;
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
    }, 200);
  });
}
