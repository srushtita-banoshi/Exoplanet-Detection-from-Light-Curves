'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/explorer', label: '3D Explorer' },
  { href: '/compare', label: 'Compare' },
  { href: '/analyzer', label: 'Light Curve' },
  { href: '/about', label: 'About' },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <motion.nav
      className="flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Link href="/" className="font-bold text-lg text-cyan-400 tracking-tight hover:text-cyan-300 transition-colors">
        Exoplanet AI
      </Link>
      <div className="flex items-center gap-1">
        {links.map(({ href, label }) => (
          <Link key={href} href={href}>
            <motion.span
              className={cn(
                'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-cyan-400/15 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {label}
            </motion.span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}
