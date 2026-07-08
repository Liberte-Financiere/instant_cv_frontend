/**
 * Telemetry utility to track client-side user events.
 * Currently logs to console in development and provides a single
 * entry point to plug in production tracking (e.g., PostHog, Mixpanel, GA).
 */
export function trackTelemetry(eventName: string, properties?: Record<string, any>) {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    console.log(`[TELEMETRY] Event: "${eventName}"`, properties || {});
  }

  // In production, we would call our analytics library:
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('event', eventName, properties);
  // }
}
