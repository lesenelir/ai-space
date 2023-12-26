import { useRouter } from 'next/router'
import { useAuth } from '@clerk/nextjs'
import { type ChatRequestOptions } from 'ai'
import { useTranslation } from 'next-i18next'
import { useAtomValue, useSetAtom } from 'jotai'
import { type ChangeEvent, type FormEvent, type KeyboardEvent, useMemo, useRef } from 'react'

import Tooltip from '@/components/ui/Tooltip'
import TextArea from '@/components/ui/TextArea'
import ArrowNarrowUpIcon from '@/components/icons/ArrowNarrowUpIcon'
import { chatItemsAtom, maxTokensAtom, temperatureAtom } from '@/atoms'

interface IProps {
  input: string
  handleInputChange: (e: (ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>)) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void
}

export default function FooterContent(props: IProps) {
  const ref = useRef<HTMLTextAreaElement>(null) // change textarea height
  const { t } = useTranslation('common')
  const { input, handleInputChange, handleSubmit } = props
  const temperature  = useAtomValue(temperatureAtom)
  const maxTokens = useAtomValue(maxTokensAtom)
  const setChatItems = useSetAtom(chatItemsAtom)
  const { userId } = useAuth()
  const router = useRouter()
  const maxHeight = 200
  const chatItemLists = useAtomValue(chatItemsAtom)

  // get current chatItem
  const currentChatItem = useMemo(() => (
    chatItemLists.find(item => item.itemUuid === router.query.id)
  ), [chatItemLists, router.query.id])

  // get router.query.id -> special model name -> send openAI request as a model name
  const getCurrentChatModelName = useMemo(() => {
    const currentChatModelId = currentChatItem?.modelPrimaryId || 0

    switch (currentChatModelId) {
      case 1:
        return 'gpt-3.5-turbo'
      case 2:
        return 'gpt-4-1106-preview' // gpt4-turbo
      case 3:
        return 'gemini' // TODO: get gemini model name
    }

  }, [currentChatItem?.modelPrimaryId])

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()

    if (ref.current) {
      ref.current.value = '' // sync textValue [Must Important!]
      ref.current.style.height = 'auto' // reset height
    }

    // 1. save user input to database
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_item_uuid: router.query.id,
          message: input,
        })
      }

      // To update the chat items list, we need to get saveUserInput response to get the new chat item.
      const response =  await fetch('/api/chat/saveUserInput', options)
      const data = await response.json()
      setChatItems(data.chatItems)
    } catch (e) {
      console.log('save user input error: ', e)
    }

    // 2. call useChat hook
    handleSubmit(e as any, {
      options: {
        body: {
          maxTokens,
          temperature,
          userId,
          modelName: getCurrentChatModelName,
          chat_item_uuid: router.query.id
        }
      }
    })
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
      <form onSubmit={handleFormSubmit} className={'relative max-lg:w-full'}>
        <TextArea
          ref={ref}
          required={true}
          value={input}
          placeholder={t('chatPage.message.textAreaPlaceholder')}
          className={`
            lg:w-[640px] lg:-ml-6 resize-none rounded-xl drop-shadow custom-message-light-scrollbar
            dark:bg-chatpage-message-background-dark 
          `}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

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
      </form>
    </div>
  )
}
