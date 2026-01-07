import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Phil or No Phil',
  description: 'A simple prediction market app',
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

