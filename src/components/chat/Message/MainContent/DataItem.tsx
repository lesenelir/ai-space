import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { forwardRef, useState } from 'react'
import {encodingForModel} from 'js-tiktoken'

import CheckIcon from '@/components/icons/CheckIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import SpeedIcon from '@/components/icons/SpeedIcon'
import MarkdownRender from '@/components/chat/Message/MainContent/MarkdownRender'
import { Gemini, GPT3, GPT4 } from '@/components/chat/Message/HeaderContent/OptionData'
import useGetChatInformation from '@/hooks/useGetChatInformation'

/**
 * In the frontend, the calculation of tokens is only for estimation purposes,
 * just to ensure there is content for display.
 * The tokens stored in the backend are the results of actual calculations.
 *
 * Because, placing the enc declaration within the component content could potentially lead to performance issues.
 */
const enc = encodingForModel('gpt-3.5-turbo')

interface IProps {
  data: {
    id: number
    role: string
    content: string
    costTokens?: number
  }
}

const DataItem =  forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const { data } = props
  const { user } = useUser()
  const router = useRouter()
  const [copy, setCopy] = useState<{[key: string]: boolean}>({}) // key: message id, value: boolean
  const { currentChatModel } = useGetChatInformation(router.query.id as string)

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
      <div key={data.id} className={'group'}>
        <div
          className={`
            flex flex-col gap-3 p-2 rounded-lg 
            bg-gray-200/90 dark:bg-chatpage-message-robot-content-dark
            text-[#374151] dark:text-chatpage-message-text-dark 
          `}
        >
          {/* avatar + name */}
          <div className={'flex gap-2'}>
            {
              data.role === 'user' ? (
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
                data.role === 'user' ? 'You' : currentChatModel?.modelName
              }
            </p>
          </div>
          {/* content */}
          <article
            ref={ref}
            className={'prose dark:prose-invert break-words whitespace-pre-wrap overflow-x-auto custom-message-light-scrollbar'}>
            {/* If data.messageContent is null, the data.content must be existed. */}
            <MarkdownRender markdown={data.content}/>
          </article>
        </div>

        {/* Footer content */}
        <div className={'mb-5 mt-1 w-full h-[16px]'}>
          <div className={'hidden group-hover:flex gap-1'}>
            {copy[data.id] ? (
              <CheckIcon width={16} height={16} className={'text-green-600 p-1'}/>
            ) : (
              <CopyIcon
                width={16}
                height={16}
                className={'rounded-md p-1 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
                onClick={() => handleCopyClick(data.content, String(data.id))}
              />
            )}

            <div
              className={'flex gap-1 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}>
              <SpeedIcon width={16} height={16}/>
              {/* If the data costTokens is null, it means that this is the messages array render.  */}
              <span className={'text-xs'}>{data.costTokens || enc.encode(data.content).length} tokens</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

DataItem.displayName = 'DataItem'

export default DataItem
