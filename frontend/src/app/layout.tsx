import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { Navigation } from '@/components/layout/navigation'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'GolfEzz - Premium Golf Course Management',
    template: '%s | GolfEzz'
  },
  description: 'Professional golf course management system with tee time booking, course information, and member services.',
  keywords: ['golf', 'course management', 'tee time', 'booking', 'golf courses', 'golf club'],
  authors: [{ name: 'GolfEzz Team' }],
  creator: 'GolfEzz',
  metadataBase: new URL('https://golfezz.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://golfezz.com',
    title: 'GolfEzz - Premium Golf Course Management',
    description: 'Professional golf course management system with tee time booking, course information, and member services.',
    siteName: 'GolfEzz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GolfEzz - Premium Golf Course Management',
    description: 'Professional golf course management system with tee time booking, course information, and member services.',
    creator: '@golfezz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 font-sans antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navigation />
                <main className="flex-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-50/20 pointer-events-none"></div>
                  <div className="relative z-10">
                    {children}
                  </div>
                </main>
              </div>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
