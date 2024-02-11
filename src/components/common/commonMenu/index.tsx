import clsx from 'clsx'
import { useAtom } from 'jotai'
import type { MouseEvent } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { UserButton, useUser } from '@clerk/nextjs'

import { isMenuOpenAtom } from '@/atoms'
import ResizableDiv from '@/components/ui/ResizableDiv'
import MessageIcon from '@/components/icons/MessageIcon'
import FileTextIcon from '@/components/icons/FileTextIcon'
import AlignLeftIcon from '@/components/icons/AlignLeftIcon'
import MicrophoneIcon from '@/components/icons/MicrophoneIcon'
import LanguageJapIcon from '@/components/icons/LanguageJapIcon'

interface IProps {
  initialWidth: number
}

export default function CommonMenu(props: IProps) {
  const { initialWidth } = props
  const router = useRouter()
  const { user } = useUser()
  const { t } = useTranslation('common')
  const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom)

  const selectContent = router.pathname

  return (
    <>
      {
        isMenuOpen && (
          <ResizableDiv
            minWidth={300}
            maxWidth={520}
            initialWidth={initialWidth}
            className={clsx(
              'w-full h-full p-3 text-chatpage-menu-text bg-chatpage-menu-background',
              'max-md:fixed max-md:top-0 max-md:left-0 z-50 max-md:h-full',
            )}
          >
            <div className={'relative w-full h-full flex flex-col'}>
              {/* Header component */}
              <div className={'w-full flex justify-between items-center mb-8'}>
                <span
                  className={clsx(
                    'text-xl font-extrabold p-2 inline-flex items-center cursor-pointer',
                    'text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-orange-300'
                  )}
                  onClick={async () => await router.push('/chat')}
                >
                  Chat
                </span>

                <AlignLeftIcon
                  width={20}
                  height={16}
                  className={clsx(
                    'cursor-pointer p-2 rounded-lg',
                    'hover-transition-change hover:bg-gray-500/30'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                />
              </div>

              {/* basic content */}
              <div className={'flex flex-col gap-2'}>
                <div
                  className={clsx(
                    'flex items-center gap-2 p-2 rounded-md cursor-pointer',
                    'hover:bg-chatpage-menu-hover hover-transition-change'
                  )}
                  onClick={() => router.push('/chat')}
                >
                  <MessageIcon width={16} height={16}/>
                  <p>{t('chatPage.menu.chat')}</p>
                </div>

                <div
                  className={clsx(
                    'flex items-center gap-2 p-2 rounded-md cursor-pointer',
                    'hover:bg-chatpage-menu-hover hover-transition-change',
                    selectContent === '/tts' && 'bg-chatpage-menu-hover'
                  )}
                  onClick={() => router.push('/tts')}
                >
                  <MicrophoneIcon width={16} height={16}/>
                  <p>{t('chatPage.menu.text2Speech')}</p>
                </div>

                <div
                  className={clsx(
                    'flex items-center gap-2 p-2 rounded-md cursor-pointer',
                    'hover:bg-chatpage-menu-hover hover-transition-change',
                    selectContent === '/summarize' && 'bg-chatpage-menu-hover'
                  )}
                  onClick={() => router.push('/summarize')}
                >
                  <FileTextIcon width={16} height={16}/>
                  <p>{t('chatPage.menu.summarize')}</p>
                </div>

                <div
                  className={clsx(
                    'flex items-center gap-2 p-2 rounded-md cursor-pointer',
                    'hover:bg-chatpage-menu-hover hover-transition-change',
                    selectContent === '/translate' && 'bg-chatpage-menu-hover'
                  )}
                  onClick={() => router.push('/translate')}
                >
                  <LanguageJapIcon width={16} height={16}/>
                  <p>{t('chatPage.menu.translate')}</p>
                </div>
              </div>

              {/* footer component */}
              <div
                className={clsx(
                  'absolute bottom-0 w-full rounded-lg',
                  'hover:bg-gray-500/10 hover-transition-change'
                )}
              >
                <div className={'flex gap-4 items-center p-2'}>
                  <div onClick={(e: MouseEvent) => e.stopPropagation()}>
                    <UserButton afterSignOutUrl={'/'}/>
                  </div>
                  <p>{user?.firstName}</p>
                </div>
              </div>
            </div>
          </ResizableDiv>
        )
      }
    </>
  )
}

