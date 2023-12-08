import ResizableDiv from '@/components/ui/ResizableDiv'
import HeaderMenuContent from 'src/components/chat/Menu/HeaderMenuContent'
import MainMenuContent from 'src/components/chat/Menu/MainMenuContent'
import FooterMenuContent from 'src/components/chat/Menu/FooterMenuContent'

export default function Menu() {
  return (
    <ResizableDiv
      initialWidth={320}
      minPercentage={1/6}
      maxPercentage={2/5}
      className={'w-full p-3 text-chatpage-menu-text bg-chatpage-menu-background'}
    >
      <div className={'w-full h-full flex flex-col'}>
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

