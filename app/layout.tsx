import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Anime Streaming Platform",
  description: "Watch your favorite anime online",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}

