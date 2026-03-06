'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function KeyboardShortcuts() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '?' || e.key === 'h') {
        e.preventDefault();
        setShow((s) => !s);
      }
      if (e.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="p-6 rounded-2xl bg-slate-900 border border-white/10 max-w-sm w-full mx-4"
          >
            <h3 className="text-cyan-400 font-semibold mb-4">Keyboard shortcuts</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p><kbd className="px-1.5 py-0.5 rounded bg-white/10">?</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/10">H</kbd> — Show this help</p>
              <p><kbd className="px-1.5 py-0.5 rounded bg-white/10">Esc</kbd> — Close</p>
            </div>
            <p className="text-slate-500 text-xs mt-4">Press ? anytime to toggle</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
