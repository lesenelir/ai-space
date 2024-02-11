import clsx from 'clsx'
import { useAtomValue } from 'jotai'

import { isMenuOpenAtom } from '@/atoms'
import ResizableDiv from '@/components/ui/ResizableDiv'
import HeaderMenuContent from '@/components/chat/Menu/HeaderMenuContent'
import MainMenuContent from '@/components/chat/Menu/MainMenuContent'
import FooterMenuContent from '@/components/chat/Menu/FooterMenuContent'

interface IProps {
  initialWidth: number
}

export default function Menu(props: IProps) {
  const { initialWidth } = props
  const isMenuOpen = useAtomValue(isMenuOpenAtom)

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
              {/* HeaderMenuContent: new chat + create folder icon + scalability icon */}
              <HeaderMenuContent/>

              {/* Chat items and folder items */}
              <MainMenuContent/>

              {/* User */}
              <FooterMenuContent/>
            </div>
          </ResizableDiv>
        )
      }
    </>
  )
}

