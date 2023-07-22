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
        {/* <meta property="og:image" content="Link preview image URL" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
