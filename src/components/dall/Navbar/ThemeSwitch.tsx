import clsx from 'clsx'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import SunIcon from '@/components/icons/SunIcon'
import MoonIcon from '@/components/icons/MoonIcon'
import ComputerIcon from '@/components/icons/ComputerIcon'

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState<boolean>(false)
  const {theme, resolvedTheme, setTheme} = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={clsx(
        'w-24 h-7 p-1 rounded-3xl bg-gray-200 flex justify-between items-center gap-2',
        'group-hover/theme:bg-gray-200',
        'dark:bg-neutral-800 dark:group-hover/theme:bg-neutral-800'
      )}
    >
      <SunIcon
        width={16}
        height={16}
        className={clsx(
          'rounded-full p-1 cursor-pointer',
          theme === 'light' && 'bg-gray-50'
        )}
        onClick={() => setTheme('light')}
      />
      <ComputerIcon
        width={16}
        height={16}
        className={clsx(
          'rounded-full p-1 cursor-pointer',
          theme === 'system' && 'bg-gray-50',
          theme === 'system' && resolvedTheme === 'dark' && 'text-black'
        )}
        onClick={() => setTheme('system')}
      />
      <MoonIcon
        width={16}
        height={16}
        className={clsx(
          'rounded-full p-1 cursor-pointer',
          theme === 'dark' && 'bg-gray-50 text-black',
        )}
        onClick={() => setTheme('dark')}
      />
    </div>
  )
}
