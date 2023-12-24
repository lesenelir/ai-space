import { useChat } from 'ai/react'

import HeaderContent from '@/components/chat/Message/HeaderContent'
import MainContent from '@/components/chat/Message/MainContent'
import FooterContent from '@/components/chat/Message/FooterContent'

export default function Message() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    api: '/api/chat/sendMessage'
  })

  return (
    <div className={'flex-1 flex flex-col bg-gray-50 dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'}>
      <HeaderContent/>
      <MainContent messages={messages}/>
      <FooterContent input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit}/>
    </div>
  )
}
