import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'ZeroNode – AI Knowledge Graph',
  description: 'Turn scattered notes into a living knowledge graph. AI connects your ideas, finds gaps, and helps you think deeper.',
  openGraph: {
    title: 'ZeroNode – AI Knowledge Graph',
    description: 'Turn scattered notes into a living knowledge graph. AI connects your ideas, finds gaps, and helps you think deeper.',
    url: 'https://zero-node-jade.vercel.app',
    siteName: 'ZeroNode',
    images: [
      {
        url: 'https://zero-node-jade.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZeroNode – AI Knowledge Graph',
    description: 'Turn scattered notes into a living knowledge graph. AI connects your ideas, finds gaps, and helps you think deeper.',
    images: ['https://zero-node-jade.vercel.app/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.variable} font-sans antialiased bg-black`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
