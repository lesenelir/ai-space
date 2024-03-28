import clsx from 'clsx'
import { useMemo } from 'react'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { isMenuOpenAtom } from '@/atoms'
import I18Change from '@/components/common/I18Change'
import ThemeChange from '@/components/common/ThemeChange'
import AlignLeftIcon from '@/components/icons/AlignLeftIcon'

export default function CommonMessageHeader() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom)

  const mainText = useMemo(() => {
    switch (router.pathname) {
      case '/tts':
        return t('chatPage.menu.text2Speech')
      case '/summarize':
        return t('chatPage.menu.summarize')
      case '/translate':
        return t('chatPage.menu.translate')
      case '/plugins/weather':
        return t('chatPage.menu.weather')
      case '/plugins/music':
        return t('chatPage.menu.music')
      case '/plugins/news':
        return t('chatPage.menu.news')
      default:
        return ''
    }
  }, [router.pathname, t])

  return (
    <div
      className={clsx(
        'w-full h-[66px] p-3 border-b mb-1 flex justify-between items-center',
        'dark:bg-chatpage-message-background-dark dark:border-b-gray-500'
      )}
    >
      {/* left text */}
      <div className={'flex gap-2 items-center'}>
        {!isMenuOpen && (
          <AlignLeftIcon
            width={20}
            height={16}
            className={clsx(
              'cursor-pointer p-2 rounded-lg',
              'hover-transition-change hover:bg-gray-500/30'
            )}
            onClick={() => setIsMenuOpen(true)}
          />
        )}
        <p className={'text-xl font-medium dark:text-white'}>{mainText}</p>
      </div>

      {/* right icons */}
      <div className={'flex gap-4'}>
        <I18Change/>
        <ThemeChange/>
      </div>
    </div>
  )
}
