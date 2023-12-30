import { useRouter } from 'next/router'
import { useAuth } from '@clerk/nextjs'
import { type ChatRequestOptions } from 'ai'
import { useTranslation } from 'next-i18next'
import { encodingForModel } from 'js-tiktoken'
import { useAtomValue, useSetAtom } from 'jotai'
import { type Message, type CreateMessage } from 'ai/react'
import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type KeyboardEvent,
  type SetStateAction,
  useEffect,
  useRef
} from 'react'

import Tooltip from '@/components/ui/Tooltip'
import TextArea from '@/components/ui/TextArea'
import LoadingDots from '@/components/ui/LoadingDots'
import ArrowNarrowUpIcon from '@/components/icons/ArrowNarrowUpIcon'
import useGetChatInformation from '@/hooks/useGetChatInformation'
import { chatItemsAtom, maxTokensAtom, selectedModelIdAtom, temperatureAtom } from '@/atoms'

interface IProps {
  input: string
  isLoading: boolean
  setInput: Dispatch<SetStateAction<string>>
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
  handleInputChange: (e: (ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>)) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void
}

export default function FooterContent(props: IProps) {
  const { input, isLoading, handleInputChange, handleSubmit, append, setInput } = props
  const { t } = useTranslation('common')
  const { userId } = useAuth()
  const router = useRouter()
  const ref = useRef<HTMLTextAreaElement>(null) // change textarea height
  const temperature  = useAtomValue(temperatureAtom)
  const maxTokens = useAtomValue(maxTokensAtom)
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const setChatItems = useSetAtom(chatItemsAtom)
  const { modelName } = useGetChatInformation(router.query.id ? router.query.id as string : '', selectedModelId)
  const maxHeight = 200

  useEffect(() => {
    setInput('')
    ref.current?.focus()
  }, [router.query.id, setInput])

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    if (isLoading) return // prevent user from sending multiple requests

    if (ref.current) {
      ref.current.value = '' // sync textValue [Must Important!]
      ref.current.style.height = 'auto' // reset height
    }

    const enc = encodingForModel(modelName as 'gpt-3.5-turbo' | 'gpt-4-1106-preview')
    const costTokens = enc.encode(input).length

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
            message: input,
            costTokens
          })
        }

        // To update the chat items list, we need to get saveUserInput response to get the new chat item.
        const response = await fetch('/api/chat/saveUserInput', options)
        const data = await response.json()
        setChatItems(data.chatItems)

        // 2. call useChat hook
        handleSubmit(e as any, {
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
            message: input,
            model_primary_id: selectedModelId,
            costTokens
          })
        }

        const response = await fetch('api/chat/newChatFromHome', options)
        const data = (await response.json())
        setChatItems(data.chatItems)

        // 2. trigger api call
        setInput('')
        await append({
          id: 'start',
          content: input,
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
    if (e.key === 'Enter' && !input) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFormSubmit(e).then(() => {})
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
    handleInputChange(e) // call useChat hook
  }

  return (
    <div className={'w-full flex justify-center items-center p-3'}>
      <form onSubmit={handleFormSubmit} className={'relative max-md:w-full'}>
        <TextArea
          ref={ref}
          required={true}
          value={input}
          placeholder={t('chatPage.message.textAreaPlaceholder')}
          className={`
            md:w-[640px] md:-ml-6 resize-none rounded-xl drop-shadow custom-message-light-scrollbar
            dark:bg-chatpage-message-background-dark 
          `}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {
          isLoading ? (
            <>
              <button
                disabled={true}
                className={'absolute bottom-4 right-4 border rounded-lg p-1'}
              >
                <LoadingDots/>
                {/*<StopIcon width={20} height={20} className={'text-gray-600 dark:text-gray-50'}/>*/}
              </button>
            </>
          ) : (
            <Tooltip title={t('chatPage.message.send')}>
              <button
                type={'submit'}
                disabled={!input}
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
