import { Provider } from 'jotai'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'
import { appWithTranslation } from 'next-i18next'

import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.className}`}>
      <Provider>
        <ThemeProvider>
          <ClerkProvider {...pageProps}>
            <Component {...pageProps} />
          </ClerkProvider>
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default appWithTranslation(App)
