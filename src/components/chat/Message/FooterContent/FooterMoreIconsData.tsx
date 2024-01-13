import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { type Dispatch, type SetStateAction } from 'react'

import {
  chatItemsAtom,
  ignoreLineAtom,
  chatMessagesAtom,
  maxHistorySizeAtom,
  selectedModelIdAtom
} from '@/atoms'
import { getCurrentChatHistory } from '@/utils'
import type { TMessage } from '@/types'
import TIcon from '@/components/icons/TIcon'
import SeparatorIcon from '@/components/icons/SeparatorIcon'
import MessageClearIcon from '@/components/icons/MessageClearIcon'
import useGetChatInformation from '@/hooks/useGetChatInformation'

interface IProps {
  disabled: boolean
  messages: TMessage[]
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>
  setGeneratingChatTitle: Dispatch<SetStateAction<boolean>>
}

export default function FooterMoreIconsData(props: IProps) {
  const { disabled, messages, setShowDeleteModal, setGeneratingChatTitle } = props
  const router = useRouter()
  const { t } = useTranslation('common')
  const setChatItems = useSetAtom(chatItemsAtom)
  const chatMessages = useAtomValue(chatMessagesAtom)
  const maxHistorySize = useAtomValue(maxHistorySizeAtom)
  const selectedModelId =  useAtomValue(selectedModelIdAtom)
  const [ignoreLine, setIgnoredLine] = useAtom(ignoreLineAtom)
  const { modelName } = useGetChatInformation(router.query.id as string, selectedModelId)

  const handleAddIgnoreLine = async () => {
    const key = router.query.id! as string
    let value: string
    if (messages.length) {
      value = String(messages[messages.length - 1].id)
    } else { // must have chatMessages
      value = String(chatMessages[chatMessages.length - 1].id)
    }

    const itemIndex = ignoreLine.findIndex(item => item.key === key)

    if (itemIndex !== -1) {
      // key exists，router.query.id exists
      setIgnoredLine(prev => {
        const newItems = [...prev]
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          value: [...newItems[itemIndex].value, value]
        }
        return newItems
      })
    } else {
      setIgnoredLine(prev => [...prev, {key, value: [value]}])
    }
  }

  const handleGeneratorChatTitle = async () => {
    const sendContent = getCurrentChatHistory(
      modelName === 'gpt-4-vision-preview',
      maxHistorySize,
      messages.length > 0 ? messages : [],
      chatMessages // chatMessages must not be empty
    )

    sendContent.unshift({
      role: 'system',
      content: 'Please generate a chat title based on these conversation contents. ' +
        'The title should be in the language most used in the conversation. ' +
        'Additionally, the chat title should summarize the content of the conversations and be as concise as possible.' +
        'The final output should not contain quotes.'
    })

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        send_content: sendContent,
        model_name: modelName,
        item_uuid: router.query.id! as string,
      })
    }
    setGeneratingChatTitle(true)
    try {
      const response = await fetch('/api/chat/generatorChatTitle', options)
      const data = (await response.json()).chatItems
      setChatItems(data)
    } catch (e) {
      console.log('generator chat title error: ', e)
    }
    setGeneratingChatTitle(false)
  }

  return (
    <div>
      {/* generator chat title */}
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-gray-200/60
          dark:hover:bg-chatpage-message-robot-content-dark
          ${disabled && 'opacity-40'}
        `}
        onClick={handleGeneratorChatTitle}
      >
        <TIcon width={16} height={16}/>
        {t('chatPage.message.generatorChatTitle')}
      </div>

      {/* ignore messages */}
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-gray-200/60
          dark:hover:bg-chatpage-message-robot-content-dark
          ${disabled && 'opacity-40'}
        `}
        onClick={handleAddIgnoreLine}
      >
        <SeparatorIcon width={16} height={16}/>
        {t('chatPage.message.ignoreMessages')}
      </div>

      {/* clear messages */}
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg text-sm text-rose-600 hover:bg-gray-200/60
          dark:text-red-500  dark:hover:bg-chatpage-message-robot-content-dark
          ${disabled && 'opacity-40'}
        `}
        onClick={() => setShowDeleteModal(true)}
      >
        <MessageClearIcon width={16} height={16}/>
        {t('chatPage.message.deleteMessages')}
      </div>
    </div>
  )
}
