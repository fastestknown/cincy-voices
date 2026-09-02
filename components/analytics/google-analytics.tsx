'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  buildPrivatePageLocation,
  GOOGLE_ANALYTICS_ID,
  shouldLoadGoogleAnalytics,
} from '@/lib/google-analytics';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const initializeGoogleAnalytics = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', '${GOOGLE_ANALYTICS_ID}', {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
`;

const subscribeToStaticHostname = () => () => undefined;

function useIsProductionHost() {
  return useSyncExternalStore(
    subscribeToStaticHostname,
    () => shouldLoadGoogleAnalytics(window.location.hostname),
    () => false,
  );
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const isProductionHost = useIsProductionHost();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isProductionHost || !isReady || !window.gtag) return;

    window.gtag('event', 'page_view', {
      page_location: buildPrivatePageLocation(pathname),
      page_path: pathname,
      page_title: document.title,
    });
  }, [isProductionHost, isReady, pathname]);

  if (!isProductionHost) return null;

  return (
    <>
      <Script
        id="google-analytics-initializer"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: initializeGoogleAnalytics }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
        onReady={() => setIsReady(true)}
      />
    </>
  );
}
