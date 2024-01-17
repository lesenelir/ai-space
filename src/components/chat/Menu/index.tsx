import clsx from 'clsx'
import { useAtom } from 'jotai'

import { isMenuOpenAtom } from '@/atoms'
import ColumnsIcon from '@/components/icons/ColumnsIcon'
import ResizableDiv from '@/components/ui/ResizableDiv'
import HeaderMenuContent from '@/components/chat/Menu/HeaderMenuContent'
import MainMenuContent from '@/components/chat/Menu/MainMenuContent'
import FooterMenuContent from '@/components/chat/Menu/FooterMenuContent'

export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom)

  const toggleOpen = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      {
        isMenuOpen ? (
          <ResizableDiv
            minWidth={300}
            maxWidth={520}
            className={clsx(
              'w-full h-full p-3 text-chatpage-menu-text bg-chatpage-menu-background',
              'max-md:fixed max-md:top-0 max-md:left-0 z-10 max-md:h-full',
            )}
          >
            <div className={'relative w-full h-full flex flex-col'}>
              {/* HeaderMenuContent: new chat + create folder icon + scalability icon */}
              <HeaderMenuContent/>

              {/* Chat items and folder items */}
              <MainMenuContent/>

              {/* User */}
              <FooterMenuContent/>
            </div>
          </ResizableDiv>
        ) : (
          <div className={'fixed top-3 left-3'}>
            <ColumnsIcon
              width={24}
              height={24}
              className={clsx(
                'border p-2 rounded-lg cursor-pointer hover:bg-gray-200',
                'hover-transition-change dark:border-gray-500 dark:hover:bg-gray-500/10',
              )}
              onClick={toggleOpen}
            />
          </div>
        )
      }
    </>
  )
}

