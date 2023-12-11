import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeChange() {
  const [mounted, setMounted] = useState<boolean>(false)
  const {theme, setTheme} = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  console.log('theme: ', theme)

  return (
    <div>
      {
        theme === 'light' ? (
          <Image
            src={'/sun.svg'}
            alt={'sun icon'}
            width={24}
            height={24}
            className={'cursor-pointer hover:opacity-60 transition-change'}
            onClick={() => setTheme('dark')}
          />
        ) : (
          <Image
            src={'/moon.svg'}
            alt={'moon icon'}
            width={24}
            height={24}
            className={'cursor-pointer hover:opacity-60 transition-change'}
            onClick={() => setTheme('light')}
          />
        )
      }
    </div>
  )
}
