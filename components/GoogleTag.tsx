import Script from 'next/script'
import { GTAG_ID } from '@/lib/gtag'

/**
 * Google Ads tag (gtag.js). Rendered only when NEXT_PUBLIC_GTAG_ID is set -
 * app/layout.tsx additionally only mounts this in production, so local dev
 * pageviews are never reported.
 */
export default function GoogleTag() {
  if (!GTAG_ID) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GTAG_ID}');
        `}
      </Script>
    </>
  )
}
