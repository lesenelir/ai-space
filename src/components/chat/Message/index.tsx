import { useChat } from 'ai/react'

import HeaderContent from '@/components/chat/Message/HeaderContent'
import MainContent from '@/components/chat/Message/MainContent'
import FooterContent from '@/components/chat/Message/FooterContent'

export default function Message() {
  const {
    messages,
    setMessages,
    append,
    isLoading,
  } = useChat({
    api: '/api/chat/sendMessage'
  })

  return (
    <div className={'flex-1 w-full flex flex-col bg-gray-50 dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'}>
      <HeaderContent/>
      <MainContent messages={messages} setMessages={setMessages}/>
      <FooterContent isLoading={isLoading} append={append} messages={messages} setMessages={setMessages}/>
    </div>
  )
}
