import Image from 'next/image'
import { v4 as uuid } from 'uuid'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useAtom, useAtomValue } from 'jotai'
import { encodingForModel } from 'js-tiktoken'
import {
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
  forwardRef,
  Fragment,
  useState,
} from 'react'

import {
  chatMessagesAtom,
  ignoreLineAtom,
  isLoadingAtom,
  maxTokensAtom,
  temperatureAtom,
  maxHistorySizeAtom,
  selectedModelIdAtom
} from '@/atoms'
import { getChatHistoryFromRefresh } from '@/utils/getChatHistoryFromRefresh'
import { deleteLastChatMessage, saveCompletionRequest } from '@/requests'
import type { TMessage } from '@/types'
import CheckIcon from '@/components/icons/CheckIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import SpeedIcon from '@/components/icons/SpeedIcon'
import VolumeIcon from '@/components/icons/VolumeIcon'
import RefreshIcon from '@/components/icons/RefreshIcon'
import PlayerPauseIcon from '@/components/icons/PlayerPauseIcon'
import PlayerStationIcon from '@/components/icons/PlayerStationIcon'
import RenderModelIcon from '@/components/common/chat/RenderModelIcon'
import IgnoreLine from '@/components/chat/Message/MainContent/IgnoreLine'
import useGetChatInformation from '@/hooks/useGetChatInformation'
import MarkdownRender from '@/components/chat/Message/MainContent/MarkdownRender'

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
    id: string
    role: string
    content: string
    costTokens?: number // chatMessages
    imageUrls?: string[] // chatMessages
  }
  messages: TMessage[]
  isLastElement: boolean
  speakingId: string | null
  stopSpeaking: () => void
  setMessages: Dispatch<SetStateAction<TMessage[]>>
  abortController: MutableRefObject<AbortController | null>
  startSpeaking: (id: string, content: string, rate: number) => void
}

const DataItem =  forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const {
    data,
    speakingId,
    startSpeaking,
    stopSpeaking,
    isLastElement,
    messages,
    setMessages,
    abortController
  } = props
  const { user } = useUser()
  const router = useRouter()
  const maxTokens = useAtomValue(maxTokensAtom)
  const temperature  = useAtomValue(temperatureAtom)
  const maxHistorySize = useAtomValue(maxHistorySizeAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const selectedModelId =  useAtomValue(selectedModelIdAtom)
  const [ignoreLine, setIgnoreLine] = useAtom(ignoreLineAtom)
  const [chatMessages, setChatMessages] = useAtom(chatMessagesAtom)
  const [rateId, setRateId] = useState<number>(1)
  const [copy, setCopy] = useState<{[key: string]: boolean}>({}) // key: message id, value: boolean
  const { currentChatModel, modelName } = useGetChatInformation(router.query.id as string | undefined, selectedModelId)

  const handleCopyClick = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {})
    setCopy(prev => ({...prev, [id]: true}))
    setTimeout(() => {
      setCopy(prev => ({...prev, [id]: false}))
    }, 1500)
  }

  const handleChangeRate = () => {
    if (speakingId) stopSpeaking()

    let newRateId
    switch (rateId) {
      case 1:
        newRateId = 1.5
        break
      case 1.5:
        newRateId = 2
        break
      case 2:
        newRateId = 0.5
        break
      default:
        newRateId = 1
        break
    }
    setRateId(newRateId)

    startSpeaking(data.id, data.content, newRateId)
  }

  const handleDeleteIgnoreLine = (deleteKey: string, deleteValue: string) => {
    setIgnoreLine(prev => {
      return prev.map(item => {
        if (item.key === deleteKey) {
          const newValue = item.value.filter(val => val !== deleteValue)
          return {
            ...item,
            value: newValue
          }
        }
        return item
      }).filter(item => item.value.length > 0) // delete whole item if value is empty
    })
  }

  const handleRefresh = async () => {
    if (speakingId) stopSpeaking()
    setRateId(1)

    // 1. delete the last message in the database
    await deleteLastChatMessage(router.query.id as string)

    // 2. sync the last deleting message in the frontend
    if (messages.length > 0) {
      setMessages(prev => prev.length > 0 ? prev.slice(0, prev.length - 1) : prev)
    } else {
      setChatMessages(prev => prev.length > 0 ? prev.slice(0, prev.length - 1) : prev)
    }

    // 3. send api
    setIsLoading(true)
    const receivedMessage: TMessage = {
      id: uuid(),
      messageContent: '',
      messageRole: 'assistant',
      imageUrls: [],
    }
    setMessages(prev => [...prev, receivedMessage])

    abortController.current = new AbortController()
    const sendContent = getChatHistoryFromRefresh(
      modelName === 'gpt-4-vision-preview',
      maxHistorySize,
      messages.length > 0 ? messages.slice(0, messages.length - 1) : [], // the messages' state is async, so we need to delete the last element
      chatMessages // chatMessages must not be empty
    )

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        temperature,
        max_tokens: maxTokens,
        model_name: modelName!,
        send_content: sendContent
      }),
      signal: abortController.current.signal
    }

    const res = await fetch('/api/chat/send', options)
    if (!res.ok || !res.body) return
    let completion = ''

    try {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        const text = decoder.decode(value)
        completion += text
        receivedMessage.messageContent += text
        setMessages(prev => prev.map(item => item.id === receivedMessage.id ? receivedMessage : item))

        if (done) {
          try {
            await saveCompletionRequest(completion, modelName!, router.query.id as string)
          } catch (e) {
            console.log('save response error', e)
          }
          break
        }
      }
    } catch (e) {
      // stream interrupted, save the response to the database.
      await saveCompletionRequest(completion, modelName!, router.query.id as string | undefined)
    }
    abortController.current = null
    setIsLoading(false)
  }

  return (
    <>
      <div key={data.id} className={'group/icons mb-4'}>
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
              data.role === 'user' && (
                <Image
                  width={30}
                  height={30}
                  src={user?.imageUrl || '/user.svg'}
                  alt='avatar'
                  className={'rounded-full'}
                />
              )
            }
            {
              data.role === 'system' && (
                <Image
                  width={30}
                  height={30}
                  src={'/robot.svg'}
                  alt='avatar'
                  className={'rounded-full'}
                />
              )
            }
            {
              data.role === 'assistant' && (
                <RenderModelIcon id={currentChatModel?.id!} width={22} height={22}/>
              )
            }
            <p className={'flex items-center font-semibold text-gray-900/90 dark:text-white'}>
              {
                data.role === 'user' ? 'You' : data.role === 'system' ? 'System' : currentChatModel?.modelName
              }
            </p>
          </div>
          {/* content */}
          <div>
            {/* images */}
            <div className={'flex flex-wrap gap-2'}>
              {
                data.imageUrls && data.imageUrls.length > 0 && data.imageUrls.map((url, index) => (
                  <div key={index} className={'relative w-20 h-20 mb-2'}>
                    <Image
                      src={url}
                      sizes={'100%'}
                      fill={true}
                      alt={'upload images'}
                      className={'rounded-xl object-cover'}
                    />
                  </div>
                ))
              }
            </div>

            {/* words */}
            <article
              ref={ref}
              className={'prose dark:prose-invert break-words whitespace-pre-wrap overflow-x-auto custom-message-light-scrollbar'}
            >
              {/* If data.messageContent is null, the data.content must be existed. */}
              <MarkdownRender markdown={data.content}/>
            </article>
          </div>
        </div>

        {/* Footer content */}
        {/* When isLastElement equals true,  */}
        {
          <div className={'w-full h-[20px] my-1'}>
            <div className={'hidden group-hover/icons:flex gap-1'}>
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

              {
                data.role === 'assistant' && isLastElement && !isLoading && (
                  <div
                    className={'cursor-pointer p-1 rounded-md hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
                    onClick={handleRefresh}
                  >
                    <RefreshIcon width={16} height={16}/>
                  </div>
                )
              }

              <div className={'cursor-pointer p-1 rounded-md hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}>
                {
                  speakingId === data.id ? (
                    <PlayerPauseIcon
                      width={16}
                      height={16}
                      onClick={stopSpeaking}
                    />
                  ) : (
                    <VolumeIcon
                      width={16}
                      height={16}
                      onClick={() => startSpeaking(data.id, data.content, rateId)}
                    />
                  )
                }
              </div>

              <div
                className={'flex gap-1 cursor-pointer p-1 rounded-md hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
                onClick={handleChangeRate}
              >
                <PlayerStationIcon width={16} height={16}/>
                <span className={'text-xs'}>{rateId}x</span>
              </div>

              <div
                className={'flex gap-1 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}>
                <SpeedIcon width={16} height={16}/>
                {/* If the data costTokens is null, it means that this is the messages array render.  */}
                <span className={'text-xs'}>{data.costTokens || enc.encode(data.content).length} tokens</span>
              </div>
            </div>
          </div>
        }
      </div>

      {/* IgnoreLine */}
      {/* When a user clicks ignore icon in FooterHeader Component, the ignored above messages should appear */}
      {
        ignoreLine
          .filter(item => item.key === router.query.id)
          .map(item => (
            item.value.some(val => val === data.id) && (
              <Fragment key={data.id}>
                <IgnoreLine onDelete={() => handleDeleteIgnoreLine(item.key, data.id)}/>
              </Fragment>
            )
          ))
      }
    </>
  )
})

DataItem.displayName = 'DataItem'

export default DataItem
