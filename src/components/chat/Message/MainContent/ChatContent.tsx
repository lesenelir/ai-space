import Image from 'next/image'
import { useMemo } from 'react'
import { type Message } from 'ai/react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useAtomValue } from 'jotai/index'
import { chatItemsAtom, modelsAtom } from '@/atoms'
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
      {messages.map(m => (
        <div key={m.id} className={`whitespace-pre-wrap text-start flex gap-3 mb-8`}>
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
                renderModelIcon(currentChatModel!.id)
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

