import ResizableDiv from '@/components/ui/ResizableDiv'

export default function Menu() {
  return (
    <ResizableDiv
      initialWidth={320}
      minPercentage={1/6}
      maxPercentage={2/3}
      className={'bg-chatpage-menu-background'}
    >
      <div className={'bg-gray-200'}>
        hello
      </div>
    </ResizableDiv>
  )
}

