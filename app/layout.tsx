import { Footer } from '@/components/footer'
import { GoogleAdSense } from '@/components/google-adsense'
import { GoogleAnalytics } from '@/components/google-analytic'
import { Header } from '@/components/header'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calculadora | DM',
  description: 'Calculadoras gerais e extremamente rápidas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <Head>
        {process.env.NODE_ENV === 'production' && (
          <>
            <GoogleAnalytics GA_MEASUREMENT_ID='G-12GT0FYL6C' />

            <GoogleAdSense adSlot='5984875372' />
          </>
        )}
      </Head>
      <body
        className={`${inter.className} bg-slate-100 dark:bg-slate-950 text-slate-950 dark:text-slate-100`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
// <Script
//   async
//   src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5699676851939916"
//   crossOrigin="anonymous"
// ></Script>