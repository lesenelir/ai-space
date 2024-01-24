import clsx from 'clsx'
import { useRouter } from 'next/router'
import { UserButton } from '@clerk/nextjs'
import { useTranslation } from 'next-i18next'
import { useMemo, useRef, useState } from 'react'

import { useOutsideClick } from '@/hooks'
import LZIcon from '@/components/icons/LZIcon'
import DropdownCard from '@/components/dall/Navbar/DropdownCard'

export default function Navbar() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  useOutsideClick(dropdownRef, (event) => {
    if (!triggerRef.current?.contains(event!.target as Node)) setDropdownOpen(false)
  })

  const navbarPClass = useMemo(() => (
    clsx(
      'font-serif cursor-pointer font-medium',
      'hover-transition-change hover:opacity-80'
    )
  ), [])

  return (
    <nav
      className={clsx(
        'lg:px-32 px-8 py-4 max-sm:px-4',
        'h-20 flex justify-between border-b dark:border-gray-500'
      )}
    >
      <div className={'flex gap-8 items-center'}>
        <LZIcon
          width={40}
          height={40}
          className={'cursor-pointer'}
          onClick={() => router.push('/').then(() => {})}
        />
        <p
          className={clsx(
            navbarPClass,
            router.pathname === '/dall' ? 'text-black dark:text-white hover:opacity-100' : 'text-[#777] dark:text-[#aaa]'
          )}
          onClick={() => router.push('/dall').then(() => {})}
        >
          {t('dallPage.dall')}
        </p>
        <p
          className={clsx(
            navbarPClass,
            router.pathname === '/dall/history' ? 'text-black dark:text-white hover:opacity-100' : 'text-[#777] dark:text-[#aaa]'
          )}
          onClick={() => router.push('/dall/history').then(() => {})}
        >
          {t('dallPage.history')}
        </p>
      </div>

      <div ref={dropdownRef}>
        {dropdownOpen && <DropdownCard/>}
      </div>

      <div className={'flex gap-2 items-center'}>
        <span
          ref={triggerRef}
          className={'-mt-1.5 text-xl cursor-pointer text-[#777] hover:opacity-80 dark:text-[#aaa]'}
          onClick={() => setDropdownOpen(prevState => !prevState)}
        >
          ...
        </span>
        <UserButton afterSignOutUrl={'/'}/>
      </div>
    </nav>
  )
}
