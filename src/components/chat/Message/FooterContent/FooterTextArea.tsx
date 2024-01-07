import { useRouter } from 'next/router'
import { useAuth } from '@clerk/nextjs'
import type { ChatRequestOptions } from 'ai'
import { useTranslation } from 'next-i18next'
import { useAtomValue, useSetAtom } from 'jotai'
import type { CreateMessage, Message } from 'ai/react'
import SpeechRecognition from 'react-speech-recognition'
import {
  type ChangeEvent,
  type CompositionEvent,
  type FormEvent,
  type KeyboardEvent,
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
  forwardRef,
  useState,
  useEffect,
  useRef,
} from 'react'

import { chatItemsAtom, maxTokensAtom, selectedModelIdAtom, temperatureAtom } from '@/atoms'
import { TImage } from '@/types'
import Tooltip from '@/components/ui/Tooltip'
import LoadingDots from '@/components/common/chat/LoadingDots'
import useGetChatInformation from '@/hooks/useGetChatInformation'
import ArrowNarrowUpIcon from '@/components/icons/ArrowNarrowUpIcon'
import PreviewImg from '@/components/chat/Message/FooterContent/PreviewImg'

interface IProps {
  isLoading: boolean
  listening: boolean
  transcript: string
  previewUrls: {id: string, url: string}[]
  uploading: {[key: string]: boolean}
  resetTranscript: () => void
  remoteUrls: TImage[]
  setPreviewUrls: Dispatch<SetStateAction<TImage[]>>
  setRemoteUrls: Dispatch<SetStateAction<TImage[]>>
  abortControllers: MutableRefObject<{[p: string]: AbortController}>
  setUploading: Dispatch<SetStateAction<{[p: string]: boolean}>>
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
}

const FooterTextArea = forwardRef<HTMLTextAreaElement, IProps>((props, ref) => {
  const {
    isLoading,
    append,
    transcript,
    listening,
    resetTranscript,
    previewUrls,
    setPreviewUrls,
    uploading,
    setUploading,
    setRemoteUrls,
    abortControllers,
    remoteUrls
  } = props
  const maxHeight = 200
  const router = useRouter()
  const { userId } = useAuth()
  const { t } = useTranslation('common')
  const temperature  = useAtomValue(temperatureAtom)
  const maxTokens = useAtomValue(maxTokensAtom)
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const setChatItems = useSetAtom(chatItemsAtom)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [isComposing, setIsComposing] = useState<boolean>(false)
  const { modelName } = useGetChatInformation(router.query.id as string | undefined, selectedModelId)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  // const textAreaRef = ref as MutableRefObject<HTMLTextAreaElement>

  // when the transcript changes, set the value of the textarea.
  useEffect(() => {
    if (listening && textAreaRef.current) {
      textAreaRef.current.value = transcript
      setIsDisabled(!transcript.trim())
    }
  }, [transcript, listening, textAreaRef])

  // when the router.query.id changes, reset the textarea value and focus on it.
  useEffect(() => {
    SpeechRecognition.stopListening().then(() => {
      resetTranscript()
    })

    if (textAreaRef.current) {
      textAreaRef.current.value = ''
      textAreaRef.current?.focus()
      setIsDisabled(!textAreaRef.current.value.trim()) // set disabled true
    }
  }, [resetTranscript, router.query.id])

  const handleComposition = (e: CompositionEvent) => {
    if (e.type === 'compositionstart') {
      // compositionstart
      setIsComposing(true)
    } else {
      // compositionend
      setIsComposing(false)
    }
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    if (isLoading) return // prevent user from sending multiple requests
    if (listening) {
      SpeechRecognition.stopListening().then(() => {
        resetTranscript()
      })
    }

    // In an existing chat, send the request to openai directly.
    if (router.query.id) {
      // when router.query.id exists, it means that the chat is already created.
      // 1. save user input to the database
      try {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_item_uuid: router.query.id,
            message: textAreaRef.current?.value,
          })
        }

        // To update the chat items list, we need to get saveUserInput response to get the new chat item.
        const response = await fetch('/api/chat/saveUserInput', options)
        const data = await response.json()
        setChatItems(data.chatItems)

        // 2. call useChat hook
        const message = textAreaRef.current?.value!
        if (textAreaRef.current) {
          textAreaRef.current.value = '' // sync textValue [Must Important!]
          textAreaRef.current.style.height = 'auto' // reset height
        }
        await append({
          id: String(new Date().getTime()),
          content: message,
          role: 'user'
        }, {
          options: {
            body: {
              maxTokens,
              temperature,
              userId,
              modelName: modelName,
              chat_item_uuid: router.query.id
            }
          }
        })
      } catch (e) {
        console.log('save user input error: ', e)
      }
    } else {
      // router.query.id is undefined, it means that the chat is not created yet. The user is on the chat home page.
      try {
        // 1. create a new chat and save user input to the database.
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: textAreaRef.current?.value,
            model_primary_id: selectedModelId,
          })
        }

        const response = await fetch('api/chat/newChatFromHome', options)
        const data = (await response.json())
        setChatItems(data.chatItems)

        // 2. trigger api call
        const message = textAreaRef.current?.value!
        if (textAreaRef.current) {
          textAreaRef.current.value = '' // sync textValue [Must Important!]
          textAreaRef.current.style.height = 'auto' // reset height
        }
        await append({
          id: 'start',
          content: message,
          role: 'user'
        }, {
          options: {
            body: {
              maxTokens,
              temperature,
              userId,
              modelName: modelName,
              chat_item_uuid: data.newChatItem.item_uuid
            }
          }
        })

        // 3. redirect /chat/[id]
        await router.push(`/chat/${data.newChatItem.item_uuid}`)
      } catch (e) {
        console.log(e)
      }
    }
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
    setIsDisabled(!textarea.value.trim())
  }

  return (
    <>
      <div className={'md:w-[640px] max-md:w-full p-1'}>
        <form onSubmit={handleFormSubmit} className={'relative'}>
          {
            modelName === 'gpt-4-vision-preview' && previewUrls && (
              <PreviewImg
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
              <>
                <button
                  disabled={true}
                  className={'absolute bottom-5 right-3 border rounded-lg p-1'}
                >
                  <LoadingDots/>
                </button>
              </>
            ) : (
              <Tooltip title={t('chatPage.message.send')} className={'right-0 bottom-11'}>
                <button
                  type={'submit'}
                  // disabled={!textAreaRef.current || textAreaRef.current?.value === ''}
                  disabled={isDisabled}
                  className={`
                    absolute bottom-5 right-3 border rounded-lg p-1
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
    </>
  )
})

FooterTextArea.displayName = 'FooterTextArea'

export default FooterTextArea
