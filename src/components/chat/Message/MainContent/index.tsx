import { useRouter } from 'next/router'
import type { Message } from 'ai/react'

import ChatHome from '@/components/chat/Message/MainContent/ChatHome'
import ChatContent from '@/components/chat/Message/MainContent/ChatContent'

interface IProps {
  messages: Message[]
}

export default function MainContent(props: IProps) {
  const router = useRouter()
  const { messages } = props

  if (!router.query.id) {
    return (
      <div className={'w-full flex-1 flex items-center'}>
        <div className={'lg:w-[640px] max-lg:w-full mx-auto p-3 dark:text-gray-50'}>
          <ChatHome/>
        </div>
      </div>
    )
  }

  return (
    <div className={'w-full flex-1 overflow-y-auto custom-message-light-scrollbar'}>
      {/* basic content */}
      <div className={'lg:w-[640px] max-lg:w-full mx-auto p-3 dark:text-gray-50'}>
        <ChatContent messages={messages}/>
      </div>
    </div>
  )
}
