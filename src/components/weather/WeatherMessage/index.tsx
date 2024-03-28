import clsx from 'clsx'
import Image from 'next/image'
import { v4 as uuid } from 'uuid'
import { useAtomValue } from 'jotai'
import { useUser } from '@clerk/nextjs'
import { toast, Toaster } from 'sonner'
import { useTranslation } from 'next-i18next'
import {
  type ChangeEvent,
  type CompositionEvent,
  type FormEvent,
  type KeyboardEvent, useEffect,
  useRef,
  useState
} from 'react'

import { temperatureAtom, userOpenAIKeyAtom } from '@/atoms'
import SendIcon from '@/components/icons/SendIcon'
import RobotIcon from '@/components/icons/RobotIcon'
import CommonMessageHeader from '@/components/common/commonMessageHeader'

type TPluginMessage = {
  id: string
  role: string
  content: string
}

export default function WeatherMessage() {
  const maxHeight = 250
  const { user } = useUser()
  const { t } = useTranslation('common')
  const temperature  = useAtomValue(temperatureAtom)
  const userOpenAIKey = useAtomValue(userOpenAIKeyAtom)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const abortController = useRef<AbortController | null>(null)
  const [isComposing, setIsComposing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messages, setMessages] = useState<TPluginMessage[]>([])

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(Math.max(textarea.scrollHeight, 144), maxHeight) + 'px'
  }

  const handleComposition = (e: CompositionEvent) => {
    if (e.type === 'compositionstart') {
      setIsComposing(true)
    } else {
      setIsComposing(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) return

    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e).then()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const text = textAreaRef.current?.value! || ''

    const pluginOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    }

    setIsLoading(true)
    setMessages(prev => [...prev, {id: uuid(), role: 'user', content: text }])
    textAreaRef.current!.value = ''
    textAreaRef.current!.style.height = '144px'
    const response = await fetch('/api/plugins/weather', pluginOptions)

    if (!response.ok && response.status === 401) {
      toast.error('Incorrect API key provided')
      setMessages(prev => prev.slice(0, -1))
      setIsLoading(false)
      return
    }
    if (!response.ok) {
      toast.error('Fetch weather failed, please try again later.')
      setMessages(prev => prev.slice(0, -1))
      setIsLoading(false)
      return
    }

    const data = await response.json()
    const weather = data.weather

    if (weather.lives.length === 0) {
      toast.error('may be you need to enter a city name?')
      setMessages(prev => prev.slice(0, -1))
      setIsLoading(false)
      return
    }

    const weatherInfo = JSON.stringify(weather.lives[0])

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        temperature,
        max_tokens: 2048,
        model_name: 'gpt-4-1106-preview',
        send_content: [
          {
            role: 'user',
            content: text + weatherInfo
          },
        ],
        api_key: userOpenAIKey
      }),
      signal: abortController.current?.signal
    }

    const res = await fetch('/api/chat/send', options)

    if (!res.ok && res.status === 401) {
      setMessages(prev => prev.slice(0, -1))
      abortController.current = null
      setIsLoading(false)
      toast.error('Incorrect API key provided')
      return
    }

    if (!res.ok || !res.body) {
      abortController.current = null
      setIsLoading(false)
      setMessages(prev => prev.slice(0, -1))
      toast.error('Network error, please try again later.')
      return
    }

    const receivedMessage: TPluginMessage = {
      id: uuid(),
      content: '',
      role: 'assistant',
    }
    setMessages(prev => [...prev, receivedMessage])
    try {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break // when the response is done

        const text = decoder.decode(value)
        receivedMessage.content += text
        setMessages(prev => prev.map(item => item.id === receivedMessage.id ? receivedMessage : item))
      }
    } catch (e) {
      // stream interrupted, save the response to the database.
      toast.error('Network Streaming error, please try again later.')
    }

    setIsLoading(false)
  }

  return (
    <div className={'flex-1 flex flex-col bg-gray-50 dark:bg-chatpage-message-background-dark overflow-y-auto'}>
      <Toaster richColors position={'top-center'}/>

      <CommonMessageHeader/>

      <form className={'flex flex-col gap-4 p-3'} onSubmit={handleSubmit}>
        <textarea
          ref={textAreaRef}
          required={true}
          placeholder={t('pluginPage.weatherPlaceholder')}
          className={clsx(
            'w-full h-[144px] resize-none p-3 text-sm rounded-lg',
            'custom-message-light-scrollbar bg-transparent focus:outline-none',
            'border dark:border-gray-500',
            'focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500'
          )}
          onChange={handleTextAreaChange}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
          onKeyDown={handleKeyDown}
        />

        <button
          type={'submit'}
          disabled={isLoading}
          className={clsx(
            'w-fit flex justify-center items-center gap-2',
            'bg-blue-500 p-2 rounded-lg text-white',
            'drop-shadow-md text-sm hover:bg-blue-500/90 hover-transition-change',
            'disabled:opacity-80 disabled:cursor-not-allowed'
          )}
        >
          <SendIcon width={14} height={14}/>
          <p>{t('pluginPage.send')}</p>
        </button>
      </form>

      {/* content messages */}
      <div
        className={'mx-3'}
      >
        {
          messages.map((item) => (
            <div
              ref={endOfMessagesRef}
              key={item.id}
              className={clsx(
                'w-full p-3 my-3 flex flex-col gap-3 rounded-lg',
                'text-[#374151] dark:text-chatpage-message-text-dark',
                'bg-gray-200/80 dark:bg-chatpage-message-robot-content-dark',
              )}
            >
              {
                item.role === 'user' && (
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
                item.role === 'assistant' && (
                  <RobotIcon width={24} height={24} className={'w-fit rounded-full p-1 bg-gray-300 dark:bg-gray-600'}/>
                )
              }
              <p>{item.content}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}
