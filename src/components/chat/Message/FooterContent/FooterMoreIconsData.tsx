import { useRouter } from 'next/router'
import { type Message } from 'ai/react'
import { useTranslation } from 'next-i18next'
import { useAtom, useAtomValue } from 'jotai'
import type { Dispatch, SetStateAction } from 'react'

import { chatMessagesAtom, ignoreLineAtom } from '@/atoms'
import SeparatorIcon from '@/components/icons/SeparatorIcon'
import MessageClearIcon from '@/components/icons/MessageClearIcon'

interface IProps {
  disabled: boolean
  messages: Message[]
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>
}

export default function FooterMoreIconsData(props: IProps) {
  const { disabled, messages, setShowDeleteModal } = props
  const router = useRouter()
  const { t } = useTranslation('common')
  const [ignoreLine, setIgnoredLine] = useAtom(ignoreLineAtom)
  const chatMessages = useAtomValue(chatMessagesAtom)

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

  return (
    <div>
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
