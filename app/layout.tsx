import { Header } from '@/components/header'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5699676851939916"
          crossorigin="anonymous"
        ></script>
      </head>
      <body className={`${inter.className} bg-slate-100 dark:bg-slate-950`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
