import clsx from 'clsx'
import { useSetAtom } from 'jotai'
import { toast, Toaster } from 'sonner'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { TMessage } from '@/types'
import { chatMessagesAtom } from '@/atoms'
import HeaderContent from '@/components/chat/Message/HeaderContent'
import MainContent from '@/components/chat/Message/MainContent'
import FooterContent from '@/components/chat/Message/FooterContent'

export default function Message() {
  const router = useRouter()
  const setChatMessages = useSetAtom(chatMessagesAtom)
  const [messages, setMessages] = useState<TMessage[]>([]) // real time messages
  const abortController = useRef<AbortController | null>(null)
  const abortImageController = useRef<{[key: string]: AbortController}>({})
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const getRequest = useCallback(async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item_uuid: router.query.id })
    }

    try {
      const response = await fetch(`/api/chat/getChatMessages`, options)
      const data = await response.json()
      setChatMessages(data.chatMessages)
      setMessages([]) // when the router.query.id changes, we need to clear the messages.
    } catch (e) {
      console.error(e)
      toast.error('get chat messages error')
    }
  }, [router.query.id, setChatMessages])

  // when the user changes the chat room, we need to configure the messages and chatMessages array.
  // fetch chat messages from the database => only fetch when the router.query.id changes
  // router.push means the content changes based on the client side, it doesn't fetch from the server.
  // => so, we need to fetch the data from the server when the router.query.id changes.
  // (router.push is different from the F5, F5 will fetch from the server, but router.push doesn't.)
  useEffect(() => {
    if (!router.query.id) {
      setMessages([])
      setChatMessages([])
    } else {
      getRequest().then(() => {})
    }
  }, [getRequest, router.query.id, setChatMessages])

  return (
    <>
      <Toaster richColors position={'top-center'}/>
      <div
        className={clsx(
          'flex-1 w-full flex flex-col bg-gray-50',
          'dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'
        )}
      >
        <HeaderContent/>
        <MainContent
          ref={textAreaRef}
          messages={messages}
          setMessages={setMessages}
          abortController={abortController}
          abortImageController={abortImageController}
        />
        <FooterContent
          ref={textAreaRef}
          messages={messages}
          setMessages={setMessages}
          abortController={abortController}
          abortImageController={abortImageController}
        />
      </div>
    </>
  )
}

// const {
//   messages,
//   setMessages,
//   append,
//   isLoading,
// } = useChat({
//   api: '/api/chat/sendMessage'
// })
