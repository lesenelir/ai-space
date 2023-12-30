import { useRouter } from 'next/router'
import { useAuth } from '@clerk/nextjs'
import { type ChatRequestOptions } from 'ai'
import { useTranslation } from 'next-i18next'
import { useAtomValue, useSetAtom } from 'jotai'
import { type Message, type CreateMessage } from 'ai/react'
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type CompositionEvent,
  useEffect,
  useRef,
  useState
} from 'react'

import Tooltip from '@/components/ui/Tooltip'
import TextArea from '@/components/ui/TextArea'
import LoadingDots from '@/components/ui/LoadingDots'
import ArrowNarrowUpIcon from '@/components/icons/ArrowNarrowUpIcon'
import useGetChatInformation from '@/hooks/useGetChatInformation'
import { chatItemsAtom, maxTokensAtom, selectedModelIdAtom, temperatureAtom } from '@/atoms'

interface IProps {
  isLoading: boolean
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
}

export default function FooterContent(props: IProps) {
  const { isLoading, append } = props
  const { t } = useTranslation('common')
  const { userId } = useAuth()
  const router = useRouter()
  const ref = useRef<HTMLTextAreaElement>(null) // change textarea height
  const temperature  = useAtomValue(temperatureAtom)
  const maxTokens = useAtomValue(maxTokensAtom)
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const setChatItems = useSetAtom(chatItemsAtom)
  const [isComposing, setIsComposing] = useState<boolean>(false)
  const { modelName } = useGetChatInformation(router.query.id ? router.query.id as string : '', selectedModelId)
  const maxHeight = 200

  useEffect(() => {
    if (ref.current) {
      ref.current.value = ''
      ref.current?.focus()
    }
  }, [router.query.id])

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
            message: ref.current?.value,
          })
        }

        // To update the chat items list, we need to get saveUserInput response to get the new chat item.
        const response = await fetch('/api/chat/saveUserInput', options)
        const data = await response.json()
        setChatItems(data.chatItems)

        // 2. call useChat hook
        const message = ref.current?.value!
        if (ref.current) {
          ref.current.value = '' // sync textValue [Must Important!]
          ref.current.style.height = 'auto' // reset height
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
      // router.query.id is undefined, it means that the chat is not created yet. The user is in the chat home page.
      try {
        // 1. create a new chat and save user input to the database.
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: ref.current?.value,
            model_primary_id: selectedModelId,
          })
        }

        const response = await fetch('api/chat/newChatFromHome', options)
        const data = (await response.json())
        setChatItems(data.chatItems)

        // 2. trigger api call
        const message = ref.current?.value!
        if (ref.current) {
          ref.current.value = '' // sync textValue [Must Important!]
          ref.current.style.height = 'auto' // reset height
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
  }

  return (
    <div className={'w-full flex justify-center items-center p-3'}>
      <form onSubmit={handleFormSubmit} className={'relative max-md:w-full'}>
        <TextArea
          ref={ref}
          required={true}
          placeholder={t('chatPage.message.textAreaPlaceholder')}
          className={`
            md:w-[640px] md:-ml-6 resize-none rounded-xl drop-shadow custom-message-light-scrollbar
            dark:bg-chatpage-message-background-dark 
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
                className={'absolute bottom-4 right-4 border rounded-lg p-1'}
              >
                <LoadingDots/>
              </button>
            </>
          ) : (
            <Tooltip title={t('chatPage.message.send')}>
              <button
                type={'submit'}
                disabled={ref.current?.value === ''}
                className={`
                  absolute bottom-4 right-4 border rounded-lg p-1 
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
