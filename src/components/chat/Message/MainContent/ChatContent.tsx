import Image from 'next/image'
import Markdown from 'react-markdown'
import { type Message } from 'ai/react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { Toaster, toast } from 'sonner'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo, useRef } from 'react'
import { chatItemsAtom, chatMessagesAtom, modelsAtom } from '@/atoms'
import { Gemini, GPT3, GPT4 } from '@/components/chat/Message/HeaderContent/OptionData'
import MarkdownRender from '@/components/chat/Message/MainContent/MarkdownRender'

interface IProps {
  messages: Message[]
  setMessages: (messages: Message[]) => void
}

/**
 * This file, I maintain the two parameters state: message and chatMessages.
 *
 *  Because chatMessages type is TChatMessages[], which is different from the Message type.
 *  So, we can't setMessage(chatMessages), because the type is different.
 *  => we need to maintain two parameters state.
 *  => chatMessages is from the database, and messages are from real time.
 *
 */
export default function ChatContent(props: IProps) {
  const { messages, setMessages } = props
  const { user } = useUser()
  const router = useRouter()
  const models = useAtomValue(modelsAtom)
  const chatItemLists =  useAtomValue(chatItemsAtom)
  const [chatMessages, setChatMessages] = useAtom(chatMessagesAtom)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  // update scroll to the bottom when the messages change
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
        setMessages([]) // when the router.query.id changes, we need to clear the messages.
      } catch (e) {
        console.error(e)
        toast.error('get chat messages error')
      }
    }

    getRequest().then(() => {})
  }, [router.query.id, setChatMessages, setMessages])

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

  if (chatMessages.length === 0 && messages.length === 0) {
    return (
      <div className={'flex-1 flex flex-col justify-center items-center'}>
        <p className={'text-gray-700 dark:text-chatpage-message-text-dark text-sm'}>No messages yet</p>
      </div>
    )
  }

  return (
    <>
      <Toaster richColors position={'top-center'}  />

      {/*first render to load data from the database*/}
      {
        chatMessages.map(m => (
          <div
            key={m.id}
            ref={endOfMessagesRef}
            className={`
              flex flex-col gap-3 mb-8 p-2 rounded-lg 
              bg-gray-200/90 dark:bg-chatpage-message-robot-content-dark
              text-[#374151] dark:text-chatpage-message-text-dark 
            `}
          >
            {/* avatar + name */}
            <div className={'flex gap-2'}>
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
              <p className={'flex items-center font-semibold text-gray-900/90 dark:text-white'}>
                {
                  m.messageRole === 'user' ? 'You' : currentChatModel?.modelName
                }
              </p>
            </div>
            {/* content */}
            <article className={'prose dark:prose-invert break-words whitespace-pre-wrap overflow-x-auto custom-message-light-scrollbar'}>
              <MarkdownRender markdown={m.messageContent}/>
            </article>
          </div>
        ))
      }


      {/* Real time  */}
      {
        messages.map(m => (
          <div
            key={m.id}
            ref={endOfMessagesRef}
            className={`
              flex flex-col gap-3 mb-8 p-2 rounded-lg 
              bg-gray-200/90 dark:bg-chatpage-message-robot-content-dark
              text-gray-600 dark:text-chatpage-message-text-dark 
            `}
          >
            {/* avatar + name */}
            <div className={'flex gap-2'}>
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
              <p className={'flex items-center font-medium text-gray-900/90 dark:text-chatpage-message-text-strong-dark'}>
                {
                  m.role === 'user' ? 'You' : currentChatModel?.modelName
                }
              </p>
            </div>
            {/* content */}
            <div className={'text-sm break-words whitespace-pre-wrap overflow-x-auto custom-message-light-scrollbar'}>
              <Markdown>
                {m.content}
              </Markdown>
            </div>
          </div>
        ))
      }
    </>
  )
}

