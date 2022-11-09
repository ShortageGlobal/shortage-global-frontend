import { Html, Head, Main, NextScript } from 'next/document';
import { GOOGLE_TAG_MANAGER_ID } from 'core/constants';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />

          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WDKJLFT&gtm_auth=4ulH0YRwpxnk4Ylc35GRZA&gtm_preview=env-6&gtm_cookies_win=x"
            height="0"
            width="0"
            style="display:none;visibility:hidden"
          ></iframe>
        </noscript>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
