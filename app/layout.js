
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Reddit Clone',
  description: 'A modern Reddit clone built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-reddit-mediumGray min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="pt-14">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
