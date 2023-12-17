import Link from "next/link"
import "@/styles/globals.css"
import Username from "@/components/Username"
import { Footer } from "@/components/Footer"
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
      <body className="w-screen flex justify-center min-h-screen">
        {process.env.NODE_ENV === "development" && (
          <Script src="http://localhost:8097" />
        )}
        <div className="max-w-xl lg:max-w-3xl w-full p-2 lg:p-4">
          <header className="pb-4 mb-4 flex justify-between">
            <Link href="/">
              <h1 className="text-xl border border-black py-1 px-2 font-black leading-4">
                organ
              </h1>
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
