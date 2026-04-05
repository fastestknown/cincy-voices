import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { TransitionProvider } from '@/components/motion/transition-provider';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cv-cream">
      <SiteHeader />
      <TransitionProvider>
        <main className="flex-1 pt-14 sm:pt-16">{children}</main>
      </TransitionProvider>
      <SiteFooter />
    </div>
  );
}
