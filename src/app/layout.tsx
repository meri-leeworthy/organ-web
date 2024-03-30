import "@/styles/globals.css"
import { Footer } from "@/components/ui"
import Script from "next/script"
import { Menu } from "../components/ui/Menu"

export const metadata = {
  title: "Organ",
  description: "Platform for grassroots organising",
}

// bg-[#edd0b366] bg-[#ebcdb066]
// max-w-xl  lg:max-w-3xl

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="relative flex flex-col w-screen min-h-screen">
        {process.env.NODE_ENV === "development" && (
          <Script src="http://localhost:8097" />
        )}
        {/* i have forgotten what this is :/ ^^ */}
        <header className="flex top-0 justify-end w-full p-4 mb-4 fixed">
          {/* <Link href="/">
              <h1 className="py-1 text-xl font-black leading-4">organ</h1>
            </Link> */}
          <Menu />
        </header>
        <div className="flex flex-col w-full p-2 mb-80 lg:p-4">{children}</div>
        <div className="w-full absolute bottom-0">
          <Footer />
        </div>
      </body>
    </html>
  )
}
