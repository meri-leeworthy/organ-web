import { useEffect, useRef } from "react"

//https://www.robinwieruch.de/react-hook-detect-click-outside-component/
//didn't quite finish getting this to work

export const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (event: any) => {
      if (!ref.current?.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [callback])

  return ref
}
