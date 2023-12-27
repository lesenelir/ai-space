import { useChat } from 'ai/react'
import { useRouter } from 'next/router'

import HeaderContent from '@/components/chat/Message/HeaderContent'
import MainContent from '@/components/chat/Message/MainContent'
import FooterContent from '@/components/chat/Message/FooterContent'

export default function Message() {
  const router = useRouter()
  const {messages, setMessages, input, handleInputChange, handleSubmit} = useChat({
    api: '/api/chat/sendMessage'
  })

  return (
    <div className={'flex-1 w-full flex flex-col bg-gray-50 dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'}>
      <HeaderContent/>
      <MainContent messages={messages} setMessages={setMessages}/>
      { router.query.id && <FooterContent input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit}/> }
    </div>
  )
}
