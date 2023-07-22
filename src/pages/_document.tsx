import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          property="description"
          content="Triptimizer is an innovative web application designed to streamline the process of planning and optimizing your trips"
        />
        <meta property="og:title" content="Triptimizer" />
        <meta
          property="og:description"
          content="Triptimizer is an innovative web application designed to streamline the process of planning and optimizing your trips"
        />
        <meta property="og:url" content="https://test.triptimizer.com" />
        <meta property="og:image" content="https://test.triptimizer.com/triptimizer-1.jpg" />
        {/* favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#1095c1" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#1095c1" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
