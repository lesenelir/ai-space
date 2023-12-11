import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'

import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.className}`}>
      <ThemeProvider>
        <ClerkProvider {...pageProps}>
          <Component {...pageProps} />
        </ClerkProvider>
      </ThemeProvider>
    </div>
  )
}
