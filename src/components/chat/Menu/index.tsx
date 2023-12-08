import { useState } from 'react'

import ResizableDiv from '@/components/ui/ResizableDiv'
import HeaderMenuContent from '@/components/chat/Menu/HeaderMenuContent'
import MainMenuContent from '@/components/chat/Menu/MainMenuContent'
import FooterMenuContent from '@/components/chat/Menu/FooterMenuContent'
import ColumnsIcon from '@/components/icons/ColumnsIcon'

export default function Menu() {
  const [isShow, setIsShow] = useState<boolean>(true)

  const toggleShow = () => {
    setIsShow(!isShow)
  }

  return (
    <>
      {
        isShow ? (
          <ResizableDiv
            initialWidth={320}
            minPercentage={1 / 6}
            maxPercentage={1 / 4}
            className={`
              w-full p-3 text-chatpage-menu-text bg-chatpage-menu-background
              max-md:fixed max-md:top-0 max-md:left-0 z-10
            `}
          >
            <div className={'w-full h-full flex flex-col'}>
              {/* HeaderMenuContent: new chat + create folder icon + scalability icon */}
              <HeaderMenuContent
                toggleShow={toggleShow}
              />

              {/* Chat items and folder items */}
              <MainMenuContent/>

              {/* User */}
              <FooterMenuContent/>
            </div>
          </ResizableDiv>
        ) : (
          <div className={'bg-gray-50'}>
            {/* Header */}
            <div className={'w-full flex items-center h-[66px] border-b p-3'}>
              <ColumnsIcon
                width={24}
                height={24}
                className={'border p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-change'}
                onClick={toggleShow}
              />
            </div>
          </div>
        )
      }

    </>
  )
}

