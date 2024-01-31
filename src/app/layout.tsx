import Link from "next/link"
import "@/styles/globals.css"
import { Username, Footer } from "@/components/ui"
import Script from "next/script"

export const metadata = {
  title: "Organ",
  description: "Platform for grassroots organising",
}

// bg-[#edd0b366] bg-[#ebcdb066]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex justify-center w-screen min-h-screen bg-gray-100">
        {process.env.NODE_ENV === "development" && (
          <Script src="http://localhost:8097" />
        )}
        <div className="flex flex-col items-center w-full max-w-xl p-2 lg:max-w-3xl lg:p-4">
          <header className="flex justify-between w-full pb-4 mb-4">
            <Link href="/">
              <h1 className="py-1 text-xl font-black leading-4">organ</h1>
            </Link>
            <Username />
          </header>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
