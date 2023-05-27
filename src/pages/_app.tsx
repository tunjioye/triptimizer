import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { page, setColorScheme } from '@/store/page'
import { Toaster } from 'react-hot-toast'

import '@picocss/pico'
import '../style/style.css'

export default function App({ Component, pageProps }: AppProps) {
  const { colorScheme } = page.use()
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorScheme)
  }, [colorScheme])

  useEffect(() => {
    const systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)')
    systemColorScheme.addEventListener('change', (e: MediaQueryListEvent) => {
      const newColorScheme = e.matches ? 'dark' : 'light'
      setColorScheme(newColorScheme)
    })
    return () => {
      systemColorScheme.removeEventListener('change', () => null)
    }
  }, [])

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <Toaster position="top-right" containerStyle={{ fontSize: '0.875rem' }} />
    </>
  )
}
