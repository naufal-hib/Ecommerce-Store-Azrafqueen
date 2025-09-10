import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/context/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Azrafqueen Store",
  description: "Toko online produk muslimah berkualitas tinggi",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}