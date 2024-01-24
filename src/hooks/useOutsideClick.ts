import { type RefObject, useEffect } from 'react'

export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  callback: (event?: MouseEvent) => void
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event)
      }
    }

    // Bind the event listener.
    // When the user clicks mouse down, the handleClickOutside will be called.
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

// export default function useOutsideClick(ref: RefObject<HTMLElement>, callback: (event?: MouseEvent) => void) {
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (ref.current && !ref.current.contains(event.target as Node)) {
//         callback(event)
//       }
//     }
//
//     // Bind the event listener.
//     // When the user clicks mouse down, the handleClickOutside will be called.
//     document.addEventListener('mousedown', handleClickOutside)
//
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [ref, callback])
// }
