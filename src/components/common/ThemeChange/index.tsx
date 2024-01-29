import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeChange() {
  const [mounted, setMounted] = useState<boolean>(false)
  const {resolvedTheme, setTheme} = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      {
        resolvedTheme === 'light' ? (
          <Image
            src={'/sun.svg'}
            alt={'sun icon'}
            width={20}
            height={20}
            className={'cursor-pointer hover:opacity-60 transition-change'}
            onClick={() => setTheme('dark')}
          />
        ) : (
          <Image
            src={'/moon.svg'}
            alt={'moon icon'}
            width={20}
            height={20}
            className={'cursor-pointer hover:opacity-60 transition-change'}
            onClick={() => setTheme('light')}
          />
        )
      }
    </div>
  )
}
