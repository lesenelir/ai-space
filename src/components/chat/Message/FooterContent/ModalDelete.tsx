import { useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import type { Message } from 'ai/react'
import { useTranslation } from 'next-i18next'
import type { Dispatch, SetStateAction } from 'react'

import { chatMessagesAtom } from '@/atoms'

interface IProps {
  setMessages: (messages: Message[]) => void
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>
}

export default function ModalDelete(props: IProps) {
  const { setShowDeleteModal, setMessages } = props
  const router = useRouter()
  const { t } = useTranslation('common')
  const setChatMessages = useSetAtom(chatMessagesAtom)

  const handleDeleteConfirm = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_uuid: router.query.id })
    }

    try {
      const response = await fetch('/api/chat/deleteChatMessages', options)
      const data = await response.json()
      setMessages([])
      setChatMessages(data.chatMessages)
      setShowDeleteModal(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={'w-full h-full flex flex-col justify-between'}>
      <h1 className={'text-xl font-semibold'}>{t('chatPage.message.deleteTitle')}</h1>
      <p className={'my-3'}>{t('chatPage.message.deleteContent')}</p>

      {/* icons */}
      <div className={'flex justify-end gap-2'}>
        <button
          className={'w-20 border border-gray-500 p-2 rounded-md active:border-blue-500'}
          onClick={() => setShowDeleteModal(false)}
        >
          {t('chatPage.message.cancel')}
        </button>

        <button
          className={'w-20 p-2 rounded-md bg-rose-700 border border-red-900 active:border-blue-500'}
          onClick={handleDeleteConfirm}
        >
          {t('chatPage.message.confirm')}
        </button>
      </div>
    </div>
  )
}

