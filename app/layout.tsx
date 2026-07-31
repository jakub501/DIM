import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DIM — Demokratický index myslenia',
  description:
    'Nástroj na štruktúrovanú sebareflexiu. Nie je to psychologický test ani diagnostika.',
}

export const viewport: Viewport = {
  themeColor: '#f6f7fb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  )
}
