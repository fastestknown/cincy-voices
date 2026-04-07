import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cv-cream">
      <SiteHeader />
      <main className="flex-1 pt-14 sm:pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
