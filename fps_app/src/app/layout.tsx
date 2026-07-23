import type { Metadata } from "next"
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "FPS - AI-Powered PC Gaming Performance Analyzer",
  description:
    "Automatically detect your PC hardware, predict expected FPS across thousands of games, and get AI-powered upgrade recommendations.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
