import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import type { Message } from 'ai/react'
import { encodingForModel } from 'js-tiktoken'
import { useEffect, useRef, useState } from 'react'

import CheckIcon from '@/components/icons/CheckIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import SpeedIcon from '@/components/icons/SpeedIcon'
import MarkdownRender from '@/components/chat/Message/MainContent/MarkdownRender'
import { Gemini, GPT3, GPT4 } from '@/components/chat/Message/HeaderContent/OptionData'
import useGetChatInformation from '@/hooks/useGetChatInformation'

interface IProps {
  messages: Message[]
}

const enc = encodingForModel('gpt-4-1106-preview') // NOT dynamic, but could not put it in a React component.

export default function DataFromRealTime(props: IProps) {
  const { messages } = props
  const { user } = useUser()
  const router = useRouter()
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const { currentChatModel } = useGetChatInformation(router.query.id as string)
  const [copy, setCopy] = useState<{[key: string]: boolean}>({}) // key: message id, value: boolean

  // update scroll to the bottom when the messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

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

  const handleCopyClick = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {})
    setCopy(prev => ({...prev, [id]: true}))
    setTimeout(() => {
      setCopy(prev => ({...prev, [id]: false}))
    }, 1500)
  }

  return (
    <>
      {
        messages.map(m => (
          <div key={m.id} className={'group'}>
            <div
              ref={endOfMessagesRef}
              className={`
              flex flex-col gap-3 p-2 rounded-lg 
              bg-gray-200/90 dark:bg-chatpage-message-robot-content-dark
              text-[#374151] dark:text-chatpage-message-text-dark 
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
                <p className={'flex items-center font-semibold text-gray-900/90 dark:text-white'}>
                  {
                    m.role === 'user' ? 'You' : currentChatModel?.modelName
                  }
                </p>
              </div>
              {/* content */}
              <article
                className={'prose dark:prose-invert break-words whitespace-pre-wrap overflow-x-auto custom-message-light-scrollbar'}>
                <MarkdownRender markdown={m.content}/>
              </article>
            </div>

            {/* Footer content */}
            <div className={'mb-5 mt-1 w-full h-[16px]'}>
              <div className={'hidden group-hover:flex gap-1'}>
                {copy[m.id] ? (
                  <CheckIcon width={16} height={16} className={'text-green-600 p-1'}/>
                ) : (
                  <CopyIcon
                    width={16}
                    height={16}
                    className={'rounded-md p-1 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
                    onClick={() => handleCopyClick(m.content, String(m.id))}
                  />
                )}

                <div className={'flex gap-1 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}>
                  <SpeedIcon width={16} height={16}/>
                  <span className={'text-xs'}>{enc.encode(m.content).length} tokens</span>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </>
  )
}
