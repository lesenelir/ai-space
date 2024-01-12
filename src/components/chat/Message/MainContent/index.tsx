import { franc } from 'franc-min'
import { useRouter } from 'next/router'
import {
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
  useEffect,
  useRef,
  useState
} from 'react'

import type { TMessage } from '@/types'
import ChevronUpIcon from '@/components/icons/ChevronUpIcon'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon'
import ChatHome from '@/components/chat/Message/MainContent/ChatHome'
import ChatContent from '@/components/chat/Message/MainContent/ChatContent'

interface IProps {
  messages: TMessage[]
  setMessages: Dispatch<SetStateAction<TMessage[]>>
  abortController: MutableRefObject<AbortController | null>
}

export default function MainContent(props: IProps) {
  const router = useRouter()
  const { messages, setMessages, abortController } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const [speakingId, setSpeakingId] = useState<string | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current?.scrollHeight
    }
  }, [router.query.id])

  const startSpeaking = (id: string, content: string, rate: number) => {
    const languageMap : {[key: string]: string} = {
      'eng': 'en-US',
      'cmn': 'zh-CN',
      'jpn': 'ja-JP',
      'fra': 'fr-FR',
      'und': 'zh-CN', // und means undefined
    }
    const languageCode = franc(content)
    const voices = speechSynthesis.getVoices()
    const voice = voices.find(v => v.lang === languageMap[languageCode]) || voices.find(v => v.default)

    const utterance = new SpeechSynthesisUtterance(content)
    utterance.voice = voice!
    utterance.rate = rate
    utterance.onend = () => setSpeakingId(null) // when the speaking ends, set the speakingId to null

    if (speakingId) { // exist speaking id, cancel it.
      speechSynthesis.cancel() // Async work. It needs a little time to cancel the speaking.

      // If you try to start a new reading before it completes, the new reading may not be executed.
      // So, we need to wait a little time to start a new reading.
      setTimeout(() => {
        setSpeakingId(id)
        speechSynthesis.speak(utterance)
      }, 100)
    } else {
      setSpeakingId(id)
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (speakingId) {
      speechSynthesis.cancel()
      setSpeakingId(null)
    }
  }

  const handleScrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleScrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }

  if (!router.query.id) {
    return (
      <div className={'w-full flex-1 overflow-y-auto custom-message-light-scrollbar'}>
        <div className={'md:max-w-screen-sm max-md:w-full mx-auto p-3 dark:text-gray-50 min-h-full relative'}>
          <ChatHome
            messages={messages}
            speakingId={speakingId}
            setMessages={setMessages}
            stopSpeaking={stopSpeaking}
            startSpeaking={startSpeaking}
            abortController={abortController}
          />
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={'w-full flex-1 overflow-y-auto custom-message-light-scrollbar'}>
      {/* basic content */}
      <div className={'md:max-w-screen-sm max-md:w-full mx-auto p-3 dark:text-gray-50'}>
        <ChatContent
          messages={messages}
          speakingId={speakingId}
          setMessages={setMessages}
          stopSpeaking={stopSpeaking}
          startSpeaking={startSpeaking}
          abortController={abortController}
        />
      </div>

      {/* scroll button */}
      <button
        className={`
          max-md:hidden
          fixed right-4 top-20 rounded-md p-1 border dark:border-gray-500 hover-transition-change
          hover:bg-gray-300/90 dark:hover:bg-gray-500/20
        `}
        onClick={handleScrollToTop}
      >
        <ChevronUpIcon width={16} height={16} className={''}/>
      </button>

      <button
        className={`
          max-md:hidden
          fixed right-4 bottom-28 rounded-md p-1 border dark:border-gray-500 hover-transition-change
          hover:bg-gray-300/90 dark:hover:bg-gray-500/20
        `}
        onClick={handleScrollToBottom}
      >
        <ChevronDownIcon width={16} height={16} className={''}/>
      </button>
    </div>
  )
}
