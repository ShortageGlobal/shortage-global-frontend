import { Html, Head, Main, NextScript } from 'next/document';
import { GOOGLE_TAG_MANAGER_NOSCRIPT_SRC } from 'core/constants';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={GOOGLE_TAG_MANAGER_NOSCRIPT_SRC}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
