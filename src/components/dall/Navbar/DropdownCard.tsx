import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import ThemeSwitch from '@/components/dall/Navbar/ThemeSwitch'
import LanguageSwitch from '@/components/dall/Navbar/LanguageSwitch'

export default function DropdownCard() {
  const { user } = useUser()
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        'w-64 fixed z-10 rounded-xl drop-shadow-sm border bg-white',
        'lg:right-48 lg:top-10',
        'md:right-24 md:top-10',
        'max-md:w-full max-md:right-0 max-md:bottom-0',
        'dark:bg-neutral-900 dark:border-gray-500'
      )}
    >
      {/* basic information */}
      <div
        className={clsx(
          'border-b flex flex-col gap-2 p-2 rounded-t-md',
          'hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-dallpage-dark-background'
        )}
      >
        <p className={'text-sm'}>{user!.fullName}</p>
        <p className={'text-xs font-light'}>{user!.primaryEmailAddress!.emailAddress}</p>
      </div>

      {/* light */}
      <div
        className={clsx(
          'border-b flex gap-6 p-2 group/theme',
          'hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-dallpage-dark-background'
        )}
      >
        <p className={'text-xs my-auto'}>
          {t('dallPage.theme')}:
        </p>
        <ThemeSwitch/>
      </div>

      {/* i18n */}
      <div
        className={clsx(
          'border-b flex gap-2 p-2',
          router.locale === 'zh'&& 'gap-6',
          'hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-dallpage-dark-background'
        )}
      >
        <p className={'text-xs my-auto'}>
          {t('dallPage.language')}:
        </p>
        <LanguageSwitch/>
      </div>

      {/* information */}
      <div
        className={clsx(
          'h-10 flex gap-1 p-2 cursor-pointer rounded-b-md',
          'hover:bg-gray-100 dark:hover:bg-dallpage-dark-background'
        )}
        onClick={() => router.push('/').then(() => {})}
      >
        <p className={'text-xs my-auto'}>{t('dallPage.goHome')}</p>
      </div>
    </motion.div>
  )
}
