'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Car Selling Service',
  description: 'Submit and manage your car listings',
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}

