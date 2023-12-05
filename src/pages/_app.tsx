import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'

import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.className}`}>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  )
}
