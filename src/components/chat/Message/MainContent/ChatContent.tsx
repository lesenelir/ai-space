import { useAtomValue } from 'jotai'
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
  const { messages, speakingId, startSpeaking, stopSpeaking } = props
  const { t } = useTranslation('common')
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const chatMessages = useAtomValue(chatMessagesAtom)

  // update scroll to the bottom when the messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, chatMessages])

  if (chatMessages.length === 0 && messages.length === 0) {
    return (
      <div className={'flex-1 flex flex-col justify-center items-center'}>
        <p className={'text-gray-700 dark:text-chatpage-message-text-dark text-sm'}>{t('chatPage.message.noMessages')}</p>
      </div>
    )
  }

  return (
    <>
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

