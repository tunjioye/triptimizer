import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Header from 'components/Header'
import Footer from 'components/Footer'
// import Script from 'next/script'
// import { setDarkModeEnabled } from '@/store/page'

import '@picocss/pico'
import '../style/style.css'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // setDarkModeEnabled()
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
      {/* <Script src="/pico-css-with-nextjs/theme.js" /> */}
    </>
  )
}
