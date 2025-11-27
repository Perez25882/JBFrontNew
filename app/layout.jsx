import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Joy Data Bundle | Affordable Mobile Data",
  description: "Fast, affordable mobile data bundles for MTN, Telecel, and AT. You will receive your data in 2-3 hours.",
  icons: {
    icon: "/logo.jpg",
  },
  generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
