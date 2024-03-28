import LoginLogout from "@/components/ui/LoginLogout"
import { CreatePageAccount } from "./CreatePageAccount"
import Link from "next/link"

export function Footer() {
  return (
    <section className="absolute bottom-0 text-end right-0 w-80 mt-24 text-sm leading-tight p-4 bg-green-400">
      <Link href="/">
        <h1 className="py-1 text-xl font-black leading-4">organ</h1>
      </Link>

      <div className="flex items-center justify-end gap-2 my-4 ml-auto w-full">
        <CreatePageAccount />
        <LoginLogout />
      </div>

      <P className="my-4">
        a project by <a href="https://radical.directory">Radical Directory</a>
      </P>

      <P>
        chat with us on{" "}
        <a href="https://matrix.org" className="underline">
          matrix
        </a>
        :{" "}
        <a
          className="underline"
          href="https://matrix.to/#/#r.d:radical.directory">
          #r.d:radical.directory
        </a>
      </P>
      <P>
        email{" "}
        <a className="underline" href="mailto:radicaldirectory@protonmail.com">
          radicaldirectory@protonmail.com
        </a>
      </P>
      <P>
        contribute code/ideas on{" "}
        <a className="underline" href="https://github.com/radicaldirectory">
          github
        </a>
      </P>
      {/* <P className="my-4">
        <a href="http://enlacezapatista.ezln.org.mx/wp-content/uploads/2018/08/Manifiesto_Borrador-Final.pdf">
          &ldquo;for a world in which many worlds fit&rdquo;
        </a>
      </P> */}
      <P className="my-4">made on unceded Wurundjeri land</P>
    </section>
  )
}

function P({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <p className={`${className} opacity-60`}>{children}</p>
}
