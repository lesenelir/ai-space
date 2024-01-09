import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { Toaster, toast } from 'sonner'
import { useTranslation } from 'next-i18next'
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef
} from 'react'

import { type TMessage } from '@/types'
import { chatMessagesAtom } from '@/atoms'
import DataItem from '@/components/chat/Message/MainContent/DataItem'

interface IProps {
  messages: TMessage[]
  speakingId: string | null
  stopSpeaking: () => void
  setMessages: Dispatch<SetStateAction<TMessage[]>>
  startSpeaking: (id: string, content: string, rate: number) => void
}

/**
 * This file, I maintain the two parameters state: message and chatMessages.
 *
 *  Because chatMessages type is TChatMessages[], which is different from the Message type.
 *  So, we can't setMessage(chatMessages), because the type is different.
 *  => we need to maintain two parameters state.
 *  => chatMessages are from the database, and messages are from real time.
 *
 */
export default function ChatContent(props: IProps) {
  const { messages, setMessages, speakingId, startSpeaking, stopSpeaking } = props
  const { t } = useTranslation('common')
  const router = useRouter()
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const [chatMessages, setChatMessages] = useAtom(chatMessagesAtom)

  // update scroll to the bottom when the messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, chatMessages])

  // fetch chat messages from the database => only fetch when the router.query.id changes
  // router.push means the content changes based on the client side, it doesn't fetch from the server.
  // => so, we need to fetch the data from the server when the router.query.id changes.
  // (router.push is different from the F5, F5 will fetch from the server, but router.push doesn't.)
  useEffect(() => {
    const getRequest = async () => {
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
    }

    getRequest().then(() => {})
  }, [router.query.id, setChatMessages, setMessages])

  if (chatMessages.length === 0 && messages.length === 0) {
    return (
      <div className={'flex-1 flex flex-col justify-center items-center'}>
        <p className={'text-gray-700 dark:text-chatpage-message-text-dark text-sm'}>{t('chatPage.message.noMessages')}</p>
      </div>
    )
  }

  return (
    <>
      <Toaster richColors position={'top-center'}  />

      {/*first render to load data from the database*/}
      {
        chatMessages.map(m => (
          <DataItem
            key={m.id}
            ref={endOfMessagesRef}
            data={{
              id: String(m.id),
              role: m.messageRole,
              content: m.messageContent,
              costTokens: m.costTokens,
              imageUrls: m.imageUrls,
            }}
            speakingId={speakingId}
            startSpeaking={startSpeaking}
            stopSpeaking={stopSpeaking}
          />
        ))
      }

      {/* Real time  */}
      {
        messages.map(m => (
          <DataItem
            key={m.id}
            ref={endOfMessagesRef}
            data={{
              id: String(m.id),
              role: m.messageRole,
              content: m.messageContent,
              imageUrls: m.imageUrls,
            }}
            speakingId={speakingId}
            startSpeaking={startSpeaking}
            stopSpeaking={stopSpeaking}
          />
        ))
      }
    </>
  )
}

