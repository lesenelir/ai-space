import clsx from 'clsx'
import Image from 'next/image'
import { franc } from 'franc-min'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useAtomValue, useSetAtom } from 'jotai'
import React, {
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from 'react'

import {
  isMenuOpenAtom,
  previewUrlsAtom,
  nextQuestionsAtom,
  selectedModelIdAtom,
  isQuestionLoadingAtom
} from '@/atoms'
import { useGetChatInformation, useUploadHandler } from '@/hooks'
import type { TImage, TMessage } from '@/types'
import RefreshIcon from '@/components/icons/RefreshIcon'
import ChatHome from '@/components/chat/Message/MainContent/ChatHome'
import ChatContent from '@/components/chat/Message/MainContent/ChatContent'
// import ChevronUpIcon from '@/components/icons/ChevronUpIcon'
// import ChevronDownIcon from '@/components/icons/ChevronDownIcon'

interface IProps {
  messages: TMessage[]
  setMessages: Dispatch<SetStateAction<TMessage[]>>
  abortController: MutableRefObject<AbortController | null>
  abortImageController: MutableRefObject<{[p: string]: AbortController}>
}

const MainContent = forwardRef<HTMLTextAreaElement, IProps>((
  props,
  ref
) => {
  const {
    messages,
    setMessages,
    abortController,
    abortImageController
  } = props
  const { t } = useTranslation('common')
  const router = useRouter()
  const isMenuOpen = useAtomValue(isMenuOpenAtom)
  const setPreviewUrls = useSetAtom(previewUrlsAtom)
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const isQuestionLoading = useAtomValue(isQuestionLoadingAtom)
  const nextQuestions = useAtomValue(nextQuestionsAtom)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleUploadSubmit = useUploadHandler(abortImageController)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const { modelName } = useGetChatInformation(router.query.id as string, selectedModelId)
  // ref may be a function, so we need to assert it to a MutableRefObject
  const textAreaRef = ref as MutableRefObject<HTMLTextAreaElement> // (instance: HTMLTextAreaElement | null) => void

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current?.scrollHeight
    }
  }, [router.query.id])

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [isQuestionLoading])

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

  // const handleScrollToTop = () => {
  //   containerRef.current?.scrollTo({
  //     top: 0,
  //     behavior: 'smooth'
  //   })
  // }
  //
  // const handleScrollToBottom = () => {
  //   containerRef.current?.scrollTo({
  //     top: containerRef.current.scrollHeight,
  //     behavior: 'smooth'
  //   })
  // }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (modelName !== 'gpt-4-vision-preview') return
    // when a user drags over the chat content, set the isDragOver to true
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (modelName !== 'gpt-4-vision-preview') return
    // when a user drags leave the chat content, set the isDragOver to false
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (modelName !== 'gpt-4-vision-preview') return

    setIsDragging(false)
    // only gpt-4-vision-preview model can upload images
    // when in gpt-4-vision-preview model, we can upload images
    const [files, len] = [e.dataTransfer.files, e.dataTransfer.files.length]
    const newPreviews: TImage[] = []
    if (len === 0) return

    for (let i = 0; i < len; i++) {
      const file = files[i]
      if (!file.type.match('image.*')) continue

      const reader = new FileReader()
      reader.onload = () => {
        newPreviews.push({id: uuid(), url: reader.result as string})
        if (newPreviews.length === files.length) {
          setPreviewUrls(prev => [...prev, ...newPreviews])
          handleUploadSubmit(files, newPreviews)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClickQuestion = (question: string) => {
    textAreaRef.current.value += question
    textAreaRef.current.focus()
  }

  // const buttonClass = useMemo(() => (
  //   clsx(
  //     'max-md:hidden',
  //     'rounded-md p-1 border dark:border-gray-500 hover-transition-change',
  //     'hover:bg-gray-300/90 dark:hover:bg-gray-500/20',
  //   )
  // ), [])

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
    <div
      ref={containerRef}
      className={clsx(
        'relative',
        'w-full flex-1 overflow-y-auto custom-message-light-scrollbar',
      )}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* onDrag */}
      {
        isDragging && modelName === 'gpt-4-vision-preview' && (
          <div
            className={clsx(
              'bg-gray-50/90 fixed w-full h-full z-30',
              'dark:bg-chatpage-message-background-dark/90',
            )}
          >
            <div
              className={clsx(
                'p-3 flex flex-col items-center gap-4 opacity-100',
                isMenuOpen && '-translate-x-56',
              )}
            >
              <Image
                src={'/dragImg.svg'}
                alt={'drag image'}
                width={250}
                height={250}
              />
              <h1 className={'text-3xl font-bold text-black dark:text-white'}>
                {t('chatPage.message.addPictures')}
              </h1>
              <p className={'text-lg text-black dark:text-white self-center'}>
                {t('chatPage.message.dropPictures')}
              </p>
            </div>
          </div>
        )
      }

      {/* basic content */}
      <div
        id={'chat-content'}
        className={clsx(
          'md:max-w-screen-sm max-md:w-full mx-auto p-3',
          'dark:text-gray-50 dark:bg-chatpage-message-background-dark'
        )}
      >
        <ChatContent
          messages={messages}
          speakingId={speakingId}
          setMessages={setMessages}
          stopSpeaking={stopSpeaking}
          startSpeaking={startSpeaking}
          abortController={abortController}
        />

        {
          isQuestionLoading && (
            <div className={'flex flex-col items-center pb-3'}>
              <div className={'flex gap-2'}>
                <RefreshIcon width={16} height={16} className={'animate-spinReverse'}/>
                <p className={'text-xs'}>{t('chatPage.message.generatingQuestions')}</p>
              </div>
            </div>
          )
        }

        {
          !isQuestionLoading && nextQuestions.length > 0 && (
            <div className={'flex flex-col gap-3 items-center px-3 pb-3'}>
              <p className={'text-sm'}>{t('chatPage.message.suggestQuestions')}</p>
              {
                nextQuestions.slice(0, 5).map((question, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'rounded-xl py-1.5 px-3 border dark:border-gray-500 cursor-pointer hover-transition-change',
                      'hover:bg-gray-200/60 dark:hover:bg-chatpage-message-robot-content-dark',
                    )}
                  >
                    <p className={'text-xs'} onClick={() => handleClickQuestion(question)}>
                      {question}
                    </p>
                  </div>
                ))
              }
            </div>
          )
        }

      </div>

      {/* scroll button */}
      {/*<button*/}
      {/*  className={clsx(buttonClass, 'fixed right-4 top-40')}*/}
      {/*  onClick={handleScrollToTop}*/}
      {/*>*/}
      {/*  <ChevronUpIcon width={16} height={16}/>*/}
      {/*</button>*/}

      {/*<button*/}
      {/*  className={clsx(buttonClass, 'fixed right-4 bottom-64')}*/}
      {/*  onClick={handleScrollToBottom}*/}
      {/*>*/}
      {/*  <ChevronDownIcon width={16} height={16}/>*/}
      {/*</button>*/}
    </div>
  )
})

MainContent.displayName = 'MainContent'

export default MainContent
