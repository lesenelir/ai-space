import { useRouter } from 'next/router'
import type { Message } from 'ai/react'
import { useEffect, useRef } from 'react'

import ChatHome from '@/components/chat/Message/MainContent/ChatHome'
import ChatContent from '@/components/chat/Message/MainContent/ChatContent'

interface IProps {
  messages: Message[]
  isLoading: boolean
  setMessages: (messages: Message[]) => void
}

export default function MainContent(props: IProps) {
  const router = useRouter()
  const { messages, setMessages } = props
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current?.scrollHeight
    }
  }, [router.query.id])


  if (!router.query.id) {
    return (
      <div className={'w-full flex-1 overflow-y-auto custom-message-light-scrollbar'}>
        <div className={'md:w-[640px] max-md:w-full mx-auto p-3 dark:text-gray-50 min-h-full relative'}>
          <ChatHome messages={messages}/>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={'w-full flex-1 overflow-y-auto custom-message-light-scrollbar'}>
      {/* basic content */}
      <div className={'md:w-[640px] max-md:w-full mx-auto p-3 dark:text-gray-50'}>
        <ChatContent messages={messages} setMessages={setMessages}/>
      </div>
    </div>
  )
}
