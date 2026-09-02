export const GOOGLE_ANALYTICS_ID = 'G-66NCMTPYEM';
export const GOOGLE_ANALYTICS_HOST = 'voices.workwithmean.ing';

export function shouldLoadGoogleAnalytics(hostname: string) {
  return hostname === GOOGLE_ANALYTICS_HOST;
}

export function buildPrivatePageLocation(pathname: string) {
  const normalizedPathname = pathname.startsWith('/')
    ? pathname
    : `/${pathname}`;

  return `https://${GOOGLE_ANALYTICS_HOST}${normalizedPathname}`;
}
