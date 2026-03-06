import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';

export const metadata: Metadata = {
  title: 'Exoplanet AI – Detection & Habitability',
  description: 'ML-powered exoplanet detection and habitability scoring from light curves.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans starfield antialiased bg-[#030712] text-slate-200">
        <div className="relative z-10">
          <Nav />
          {children}
        </div>
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
