import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Phil or No Phil',
  description: 'A simple prediction market app where you can create yes/no questions and trade shares',
  openGraph: {
    title: 'Phil or No Phil',
    description: 'A simple prediction market app where you can create yes/no questions and trade shares',
    url: 'https://philornophil.com',
    siteName: 'Phil or No Phil',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Phil or No Phil',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phil or No Phil',
    description: 'A simple prediction market app where you can create yes/no questions and trade shares',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

