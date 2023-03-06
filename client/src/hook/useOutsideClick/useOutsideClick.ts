import type { RefObject } from 'react'

import { useEffect } from 'react'

export function useOutsideClick(refs: RefObject<HTMLElement>[], callback: () => void) {

  useEffect(() => {

    const handler = (event: Event) => {
      const fireCallback = refs.reduce((result, ref) => {

        return !result ? result : !ref.current?.contains(event.target as Node)
      }, true)

      fireCallback && callback()
    }

    document.addEventListener("mousedown", handler)

    return () => document.removeEventListener("mousedown", handler)
  }, [callback, refs]);
}
