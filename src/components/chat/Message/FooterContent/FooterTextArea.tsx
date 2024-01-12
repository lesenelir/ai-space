import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import SpeechRecognition from 'react-speech-recognition'
import {
  type ChangeEvent,
  type CompositionEvent,
  type FormEvent,
  type KeyboardEvent,
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
  useState,
  useEffect,
  useRef,
} from 'react'

import type { TImage, TMessage } from '@/types'
import Tooltip from '@/components/ui/Tooltip'
import LoadingDots from '@/components/common/chat/LoadingDots'
import useGetChatInformation from '@/hooks/useGetChatInformation'
import ArrowNarrowUpIcon from '@/components/icons/ArrowNarrowUpIcon'
import PreviewImg from '@/components/chat/Message/FooterContent/PreviewImg'
import {
  chatItemsAtom,
  chatMessagesAtom,
  isLoadingAtom,
  maxHistorySizeAtom,
  maxTokensAtom,
  selectedModelIdAtom,
  temperatureAtom
} from '@/atoms'
import {
  getChatHistory,
  saveCompletionRequest,
  saveUserInputFromHomeRequest,
  saveUserInputRequest
} from '@/utils'

interface IProps {
  listening: boolean
  transcript: string
  remoteUrls: TImage[]
  messages: TMessage[]
  resetTranscript: () => void
  uploading: {[key: string]: boolean}
  previewUrls: {id: string, url: string}[]
  setMessages: Dispatch<SetStateAction<TMessage[]>>
  setPreviewUrls: Dispatch<SetStateAction<TImage[]>>
  setRemoteUrls: Dispatch<SetStateAction<TImage[]>>
  setUploading: Dispatch<SetStateAction<{[p: string]: boolean}>>
  abortController: MutableRefObject<AbortController | null>
  abortControllers: MutableRefObject<{[p: string]: AbortController}>
}

export default function FooterTextArea(props: IProps) {
  const {
    transcript,
    listening,
    resetTranscript,
    previewUrls,
    setPreviewUrls,
    uploading,
    setUploading,
    setRemoteUrls,
    abortControllers,
    remoteUrls,
    setMessages,
    messages,
    abortController
  } = props
  const maxHeight = 200
  const router = useRouter()
  const { t } = useTranslation('common')
  const maxTokens = useAtomValue(maxTokensAtom)
  const maxHistorySize = useAtomValue(maxHistorySizeAtom)
  const temperature  = useAtomValue(temperatureAtom)
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const chatMessages = useAtomValue(chatMessagesAtom)
  const setChatItems = useSetAtom(chatItemsAtom)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [deleting, setDeleting] = useState<{[key: string]: boolean}>({})
  const [isComposing, setIsComposing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  const { modelName } = useGetChatInformation(router.query.id as string | undefined, selectedModelId)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  // const abortController = useRef<AbortController | null>(null)
  // const textAreaRef = ref as MutableRefObject<HTMLTextAreaElement>

  // when the transcript changes, set the value of the textarea.
  useEffect(() => {
    if (listening && textAreaRef.current) {
      textAreaRef.current.value = transcript
      setIsDisabled(!transcript.trim())
    }
  }, [transcript, listening, textAreaRef])

  // when uploading changes or deleting changes, setting isDisabled state.
  useEffect(() => {
    const isUploading = Object.keys(uploading).length > 0
    const isDeleting = Object.values(deleting).some(item => item)
    const hasText = textAreaRef.current?.value.trim()

    if (isUploading || isDeleting) {
      setIsDisabled(true)
    } else {
      setIsDisabled(!hasText)
    }

  }, [deleting, uploading])

  // when the router.query.id changes,
  // reset the textarea value and focus on it and set deleting state to {} empty.
  useEffect(() => {
    SpeechRecognition.stopListening().then(() => {
      resetTranscript()
    })

    if (textAreaRef.current) {
      textAreaRef.current.value = ''
      textAreaRef.current?.focus()
      setIsDisabled(!textAreaRef.current.value.trim()) // when router changes, reset isDisabled state.
    }

    setDeleting({})
  }, [resetTranscript, router.query.id])

  // when the router.query.id changes, cancel the fetch request if it is still running.
  useEffect(() => {
    if (abortController.current) {
      abortController.current?.abort()
    }
  }, [abortController, router.query.id])

  const handleComposition = (e: CompositionEvent) => {
    if (e.type === 'compositionstart') {
      // compositionstart
      setIsComposing(true)
    } else {
      // compositionend
      setIsComposing(false)
    }
  }

  const handleCancelStreaming = () => {
    if (!abortController.current) return

    abortController.current?.abort()
    abortController.current = null
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    if (isLoading) return // prevent user from sending multiple requests
    if (isDisabled) return // prevent user from sending an empty message
    if (listening) {
      SpeechRecognition.stopListening().then(() => {
        resetTranscript()
      })
    }

    // 1. reset the textarea value and height.
    setIsLoading(true)
    const value = textAreaRef.current?.value // save textValue temporary [Must Important!!!]
    if (textAreaRef.current) {
      textAreaRef.current.value = '' // sync textValue [Must Important!]
      textAreaRef.current.style.height = 'auto' // reset height
    }

    // 2. update messages state from user input and save user input to the database.
    const userMessage: TMessage = {
      id: uuid(),
      messageContent: value || '',
      messageRole: 'user',
      // imageUrls: remoteUrls.length > 0?remoteUrls.map(item => item.url) : []
      // don't use remoteUrls, use previewUrls instead (base64).
      // so, when the user sends a message, the message will be displayed immediately.
      imageUrls: previewUrls.length > 0 ? previewUrls.map(item => item.url): []
    }
    setMessages(prev => [...prev, userMessage])
    setPreviewUrls([])
    setRemoteUrls([])

    let data
    try {
      // To update the chat items list, we need to get saveUserInput response to get the new chat item.
      let response
      if (router.query.id) {
        response = await saveUserInputRequest(value!, router.query.id as string, remoteUrls)
      } else {
        response = await saveUserInputFromHomeRequest(value!, selectedModelId, remoteUrls)
      }
      data = await response!.json()
      setChatItems(data.chatItems)
    } catch (e) {
      console.log('save user input error', e)
    }

    // 3. update messages state from LLM response, and display the response to the user.
    const receivedMessage: TMessage = {
      id: uuid(),
      messageContent: '',
      messageRole: 'assistant',
      imageUrls: [],
    }
    setMessages(prev => [...prev, receivedMessage])

    abortController.current = new AbortController()
    const sendContent = getChatHistory(remoteUrls, value!, messages, maxHistorySize, chatMessages) // context manage
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
        const {value, done} = await reader.read()
        const text = decoder.decode(value)
        completion += text
        receivedMessage.messageContent += text
        setMessages(prev => prev.map(item => item.id === receivedMessage.id ? receivedMessage : item))

        if (done) { // when the response is done, save the response to the database.
          try {
            await saveCompletionRequest(completion, modelName!, router.query.id as string | undefined, data)
          } catch (e) {
            console.log('save response error', e)
          }
          break
        }
      }
    } catch (e) {
      // stream interrupted, save the response to the database.
      await saveCompletionRequest(completion, modelName!, router.query.id as string | undefined, data)
    }

    // 4. redirect /chat/[id]
    if (!router.query.id) {
      await router.push(`/chat/${data.newChatItem.item_uuid}`)
      setMessages([])
    }

    abortController.current = null
    setIsLoading(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) return

    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleFormSubmit(e).then(() => {})
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'

    // when user input textarea and images are uploading or deleting at the same time, setting isDisabled state to true.
    const isUploading = Object.keys(uploading).length > 0
    const isDeleting = Object.values(deleting).some(item => item)
    const hasText = textAreaRef.current?.value.trim()

    if (isUploading || isDeleting) {
      setIsDisabled(true)
    } else {
      setIsDisabled(!hasText)
    }
  }

  return (
    <div className={'md:max-w-screen-sm w-full max-md:w-full p-1'}>
      <form onSubmit={handleFormSubmit} className={'relative'}>
        {
          modelName === 'gpt-4-vision-preview' && previewUrls && (
            <PreviewImg
              deleting={deleting}
              setDeleting={setDeleting}
              uploading={uploading}
              remoteUrls={remoteUrls}
              previewUrls={previewUrls}
              setRemoteUrls={setRemoteUrls}
              setUploading={setUploading}
              setPreviewUrls={setPreviewUrls}
              abortControllers={abortControllers}
            />
          )
        }
        <textarea
          ref={textAreaRef}
          required={true}
          placeholder={t('chatPage.message.textAreaPlaceholder')}
          className={`
            resize-none w-full py-1 pl-3 pr-11 text-sm custom-message-light-scrollbar bg-transparent rounded-xl
            dark:bg-chatpage-message-background-dark focus:outline-none dark:border-gray-500
          `}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
        />
        {
          isLoading ? (
            <Tooltip title={t('chatPage.message.stop')} className={'right-0 bottom-[40px]'}>
              <div
                className={'absolute bottom-5 right-3 border rounded-lg p-1 cursor-pointer'}
                onClick={handleCancelStreaming}
              >
                <LoadingDots/>
              </div>
            </Tooltip>
          ) : (
            <Tooltip title={t('chatPage.message.send')} className={'right-0 bottom-[40px]'}>
              <button
                type={'submit'}
                disabled={isDisabled}
                className={`
                  absolute bottom-4 right-3 border rounded-lg p-1 
                  hover:bg-gray-200/80 hover-transition-change dark:hover:bg-gray-500/10
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <ArrowNarrowUpIcon
                  width={20}
                  height={20}
                  className={'dark:text-gray-50/80 dark:text-gray-100'}
                />
              </button>
            </Tooltip>
          )
        }
      </form>
    </div>
  )
}
