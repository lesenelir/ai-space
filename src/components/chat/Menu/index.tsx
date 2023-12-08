import ResizableDiv from '@/components/ui/ResizableDiv'
import FirstMenuContent from '@/components/chat/Menu/FirstMenuContent'
import SecondMenuContent from '@/components/chat/Menu/SecondMenuContent'
import ThirdMenuContent from '@/components/chat/Menu/ThirdMenuContent'

export default function Menu() {
  return (
    <ResizableDiv
      initialWidth={320}
      minPercentage={1/6}
      maxPercentage={2/5}
      className={'w-full p-2 text-chatpage-menu-text bg-chatpage-menu-background'}
    >
      <div className={'w-full h-full flex flex-col'}>
        {/* FirstMenuContent: new chat + create folder icon + scalability icon */}
        <FirstMenuContent/>

        {/* Chat items and folder items */}
        <SecondMenuContent/>

        {/* User */}
        <ThirdMenuContent/>
      </div>
    </ResizableDiv>
  )
}

