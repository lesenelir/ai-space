import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { type Dispatch, type SetStateAction } from 'react'

import XIcon from '@/components/icons/XIcon'
import PhotoIcon from '@/components/icons/PhotoIcon'
import FileTextIcon from '@/components/icons/FileTextIcon'
import MicrophoneIcon from '@/components/icons/MicrophoneIcon'
import LanguageJapIcon from '@/components/icons/LanguageJapIcon'

interface IProps {
  setShowCategory: Dispatch<SetStateAction<boolean>>
}

export default function ModalCategory(props: IProps) {
  const { setShowCategory } = props
  const router = useRouter()
  const { t } = useTranslation('common')

  const itemClassName = clsx(
    'w-full h-20 p-3 rounded-2xl cursor-pointer',
    'flex flex-col gap-1 items-center bg-chatpage-message-background-dark hover-transition-change',
    'hover:bg-chatpage-message-robot-content-dark dark:hover:bg-chatpage-message-background-dark/80'
  )

  return (
    <div className={'w-full h-full flex flex-col text-white'}>
      {/* header */}
      <div className={'h-20 p-4 flex flex-row justify-between rounded-t-md bg-chatpage-menu-hover'}>
        <p className={'font-medium text-2xl'}>{t('chatPage.menu.aiTools')}</p>
        <XIcon
          width={24}
          height={24}
          className={'h-1/4 cursor-pointer text-gray-200/70 hover:text-gray-200 transition-change'}
          onClick={() => setShowCategory(false)}
        />
      </div>

      <div className={'flex-1 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar'}>
        <div className={itemClassName} onClick={async () => await router.push('/tts')}>
          <MicrophoneIcon width={28} height={28}/>
          {t('chatPage.menu.text2Speech')}
        </div>

        <div className={itemClassName} onClick={async () => await router.push('/summarize')}>
          <FileTextIcon width={28} height={28}/>
          {t('chatPage.menu.summarize')}
        </div>

        <div className={itemClassName} onClick={async () => await router.push('/translate')}>
          <LanguageJapIcon width={28} height={28}/>
          {t('chatPage.menu.translate')}
        </div>

        <div className={itemClassName} onClick={async () => await router.push('/dall')}>
          <PhotoIcon width={28} height={28}/>
          {t('chatPage.menu.image')}
        </div>
      </div>

      {/* Footer */}
      <div className={'h-20 flex justify-center items-center p-2 text-sm rounded-b-md bg-chatpage-menu-hover'}>
        <p>
          {t('chatPage.menu.footer')} {' '}
          <span className={'underline cursor-pointer'} onClick={() => router.push('/#research')}>
            {t('chatPage.menu.footerLink')}
          </span>
        </p>
      </div>
    </div>
  )
}
