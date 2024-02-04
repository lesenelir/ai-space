import clsx from 'clsx'
import { toast } from 'sonner'
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
  forwardRef
} from 'react'

import {
  chatItemsAtom,
  chatMessagesAtom,
  isLoadingAtom,
  maxHistorySizeAtom,
  nextQuestionsAtom,
  maxTokensAtom,
  previewUrlsAtom,
  remoteUrlsAtom,
  selectedModelIdAtom,
  temperatureAtom,
  uploadingAtom,
  userOpenAIKeyAtom
} from '@/atoms'
import {
  saveCompletionRequest,
  saveUserInputFromHomeRequest,
  saveUserInputRequest
} from '@/requests'
import { getChatHistory } from '@/utils'
import type { TMessage } from '@/types'
import { useGetChatInformation } from '@/hooks'
import Tooltip from '@/components/ui/Tooltip'
import LoadingDots from '@/components/common/LoadingDots'
import ArrowNarrowUpIcon from '@/components/icons/ArrowNarrowUpIcon'
import PreviewImg from '@/components/chat/Message/FooterContent/PreviewImg'

interface IProps {
  listening: boolean
  transcript: string
  messages: TMessage[]
  resetTranscript: () => void
  setMessages: Dispatch<SetStateAction<TMessage[]>>
  abortController: MutableRefObject<AbortController | null>
  abortImageController: MutableRefObject<{[p: string]: AbortController}>
}

const FooterTextArea = forwardRef<HTMLTextAreaElement, IProps>((
  props,
  ref
) => {
  const {
    transcript,
    listening,
    resetTranscript,
    abortImageController,
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
  const uploading = useAtomValue(uploadingAtom)
  const setNextQuestions = useSetAtom(nextQuestionsAtom)
  const userOpenAIKey = useAtomValue(userOpenAIKeyAtom)
  const [remoteUrls, setRemoteUrls] = useAtom(remoteUrlsAtom)
  const [previewUrls, setPreviewUrls] = useAtom(previewUrlsAtom)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [deleting, setDeleting] = useState<{[key: string]: boolean}>({})
  const [isComposing, setIsComposing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const { modelName } = useGetChatInformation(router.query.id as string | undefined, selectedModelId)
  const textAreaRef = ref as MutableRefObject<HTMLTextAreaElement>

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

  }, [deleting, textAreaRef, uploading])

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
  }, [resetTranscript, router.query.id, textAreaRef])

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
    setNextQuestions([])
    const value = textAreaRef.current?.value // save textValue temporary [Must Important!!!]
    if (textAreaRef.current) {
      textAreaRef.current.value = '' // sync textValue [Must Important!]
      textAreaRef.current.style.height = 'auto' // reset height
    }

    // 2. send user input to the LLM Model and get the response.
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

    // 2. update messages state from LLM response, and display the response to the user.
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
        send_content: sendContent,
        api_key: userOpenAIKey
      }),
      signal: abortController.current.signal
    }
    const res = await fetch('/api/chat/send', options)
    if (!res.ok && res.status === 401) {
      setMessages(prev => prev.slice(0, -2))
      abortController.current = null
      setIsLoading(false)
      toast.error('Incorrect API key provided')
      return
    }

    if (!res.ok || !res.body) {
      abortController.current = null
      setIsLoading(false)
      toast.error('Network error, please try again later.')
      return
    }

    // res.ok
    // 3. save user input to the database
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
      toast.error('Failed to save user input')
    }

    // 4. streaming responses
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
            toast.error('Failed to save response')
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
              abortImageController={abortImageController}
            />
          )
        }
        <textarea
          ref={textAreaRef}
          required={true}
          placeholder={t('chatPage.message.textAreaPlaceholder')}
          className={clsx(
            'resize-none w-full py-1 pl-3 pr-11 text-sm custom-message-light-scrollbar bg-transparent rounded-xl',
            'dark:bg-chatpage-message-background-dark focus:outline-none dark:border-gray-500'
          )}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
        />
        {
          isLoading ? (
            <Tooltip title={t('chatPage.message.stop')} className={'right-0 bottom-10'}>
              <div
                className={'absolute bottom-5 right-3 border rounded-lg p-1 cursor-pointer'}
                onClick={handleCancelStreaming}
              >
                <LoadingDots/>
              </div>
            </Tooltip>
          ) : (
            <Tooltip title={t('chatPage.message.send')} className={'right-0 bottom-10'}>
              <button
                type={'submit'}
                disabled={isDisabled}
                className={clsx(
                  'absolute bottom-4 right-3 border rounded-lg p-1',
                  'hover:bg-gray-200/80 hover-transition-change dark:hover:bg-gray-500/10',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
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
})

FooterTextArea.displayName = 'FooterTextArea'

export default FooterTextArea
