import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SITE } from '@/lib/constants';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.tagline,
  metadataBase: new URL(SITE.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body min-h-screen flex flex-col bg-cv-dark">
        {children}
        <Analytics />
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <script
          defer
          data-domain="voices.workwithmean.ing"
          src="https://plausible.io/js/script.js"
        />
      </body>
    </html>
  );
}
