import Image from 'next/image'
import { type Message } from 'ai/react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { Toaster, toast } from 'sonner'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo, useRef } from 'react'
import { chatItemsAtom, chatMessagesAtom, modelsAtom } from '@/atoms'
import { Gemini, GPT3, GPT4 } from '@/components/chat/Message/HeaderContent/OptionData'

interface IProps {
  messages: Message[]
}

export default function ChatContent(props: IProps) {
  const { messages } = props
  const { user } = useUser()
  const router = useRouter()
  const models = useAtomValue(modelsAtom)
  const chatItemLists =  useAtomValue(chatItemsAtom)
  const [chatMessages, setChatMessages] = useAtom(chatMessagesAtom)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

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
      } catch (e) {
        console.error(e)
        toast.error('get chat messages error')
      }
    }

    getRequest().then(() => {})
  }, [router.query.id, setChatMessages])

  const currentChatItem = useMemo(() =>
      chatItemLists.find(item => item.itemUuid === router.query.id),
    [chatItemLists, router.query.id]
  )
  const currentChatModel = useMemo(() =>
      models.find(model => model.id === currentChatItem?.modelPrimaryId),
    [models, currentChatItem?.modelPrimaryId]
  )

  const renderModelIcon = (id: number) => {
    switch (id) {
      case 1:
        return <GPT3 width={22} height={22} className={'rounded-full'} />
      case 2:
        return <GPT4 width={22} height={22} className={'rounded-full'} />
      case 3:
        return <Gemini width={22} height={22} className={'rounded-full'} />
      default:
        return null
    }
  }

  return (
    <>
      <Toaster richColors position={'top-center'}  />

      {/* first render to load data from the database */}
      {chatMessages.map(m => (
        <div
          key={m.id}
          ref={endOfMessagesRef}
          className={`whitespace-pre-wrap text-start flex gap-3 mb-8`}
        >
          {/* Image Avatar */}
          <div className={'mb-2'}>
            {
              m.messageRole === 'user' ? (
                <Image
                  width={30}
                  height={30}
                  src={user?.imageUrl || '/user.svg'}
                  alt='avatar'
                  className={'rounded-full'}
                />
              ) : (
                renderModelIcon(currentChatModel?.id || 1)
              )
            }
          </div>

          {/* Name + Content */}
          <div className={'flex-1 flex flex-col gap-2'}>
            <p className={'font-medium dark:text-chatpage-message-text-strong-dark'}>
              {
                m.messageRole === 'user' ? 'You' : currentChatModel?.modelName
              }
            </p>
            <p
              className={`
                dark:text-chatpage-message-text-dark 
                ${m.messageRole === 'user' ? 'text-[#0F0F0F] dark:text-chatpage-message-text-strong-dark' : 'text-gray-700'}
              `}
            >
              {m.messageContent}
            </p>
          </div>
        </div>
      ))}

      {/* Real time  */}
      {messages.map(m => (
        <div
          key={m.id}
          ref={endOfMessagesRef}
          className={`whitespace-pre-wrap text-start flex gap-3 mb-8`}
        >
          {/* Image Avatar */}
          <div className={'mb-2'}>
            {
              m.role === 'user' ? (
                <Image
                  width={30}
                  height={30}
                  src={user?.imageUrl || '/user.svg'}
                  alt='avatar'
                  className={'rounded-full'}
                />
              ) : (
                renderModelIcon(currentChatModel?.id || 1)
              )
            }
          </div>

          {/* Name + Content */}
          <div className={'flex-1 flex flex-col gap-2'}>
            <p className={'font-medium dark:text-chatpage-message-text-strong-dark'}>
              {
                m.role === 'user' ? 'You' : currentChatModel?.modelName
              }
            </p>
            <p
              className={`
                dark:text-chatpage-message-text-dark 
                ${m.role === 'user' ? 'text-[#0F0F0F] dark:text-chatpage-message-text-strong-dark' : 'text-gray-700'}
              `}
            >
              {m.content}
            </p>
          </div>
        </div>
      ))}
    </>
  )
}

