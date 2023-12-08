import HeaderContent from '@/components/chat/Message/HeaderContent'
import MainContent from '@/components/chat/Message/MainContent'
import FooterContent from '@/components/chat/Message/FooterContent'

export default function Message() {
  return (
    <div className={'flex-1 flex flex-col bg-gray-50'}>
      <HeaderContent/>
      <MainContent/>
      <FooterContent/>
    </div>
  )
}
