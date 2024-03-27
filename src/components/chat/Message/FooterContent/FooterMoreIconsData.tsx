import clsx from 'clsx'
import html2canvas from 'html2canvas'
import { useRouter } from 'next/router'
import { Toaster, toast } from 'sonner'
import { useTranslation } from 'next-i18next'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { type Dispatch, type SetStateAction } from 'react'

import {
  chatItemsAtom,
  ignoreLineAtom,
  chatMessagesAtom,
  nextQuestionsAtom,
  maxHistorySizeAtom,
  selectedModelIdAtom,
  isQuestionLoadingAtom,
} from '@/atoms'
import { generateChatTitle, generateQuestions } from '@/requests'
import { useGetChatInformation } from '@/hooks'
import { getCurrentChatHistory } from '@/utils'
import type { TMessage } from '@/types'
import TIcon from '@/components/icons/TIcon'
import SeparatorIcon from '@/components/icons/SeparatorIcon'
import ScreenshotIcon from '@/components/icons/ScreenshotIcon'
import PhotoShareIcon from '@/components/icons/PhotoShareIcon'
import CopyFolderIcon from '@/components/icons/CopyFolderIcon'
import MessageClearIcon from '@/components/icons/MessageClearIcon'
import MessageQuestionIcon from '@/components/icons/MessageQuestionIcon'

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
  const setNextQuestions = useSetAtom(nextQuestionsAtom)
  const setIsQuestionLoading = useSetAtom(isQuestionLoadingAtom)
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

  const handleGenerateChatTitle = async () => {
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

    setGeneratingChatTitle(true)
    try {
      const response = await generateChatTitle(sendContent, modelName!, router.query.id! as string)
      if (!response?.ok && response?.status === 401) {
        toast.error('Incorrect API key provided')
        setGeneratingChatTitle(false)
        return
      }
      if (!response?.ok && response?.status === 504) {
        toast.error('Network Timeout')
        setGeneratingChatTitle(false)
        return
      }
      const data = (await response?.json()).chatItems
      setChatItems(data)
    } catch (e) {
      toast.error('Failed to generate chat title')
    }
    setGeneratingChatTitle(false)
  }

  const handleGenerateFollowQuestions = async () => {
    const sendContent = getCurrentChatHistory(
      modelName === 'gpt-4-vision-preview',
      2,
      messages.length > 0 ? messages : [],
      chatMessages // chatMessages must not be empty
    )

    sendContent.push({
      role: 'system',
      content:
        'Please analyze potential follow-up questions from the user\'s perspective based on the conversation contents. ' +
        'The final output should not contain quotes.' +
        'The follow-up questions should be in the language most used in the conversation. ' +
        'Additionally, the follow-up questions should be as concise as possible.' +
        'Please output the questions directly. The format of the question is separated by \n'
    })

    setIsQuestionLoading(true)
    try {
      // const response = await
      const response = await generateQuestions(sendContent, modelName!)
      if (!response?.ok && response?.status === 401) {
        toast.error('Incorrect API key provided')
        setIsQuestionLoading(false)
        return
      }
      if (!response?.ok || response?.status === 504) {
        toast.error('Network Timeout')
        setIsQuestionLoading(false)
        return
      }

      const data = (await response?.json())
      const questions = data.questions.trim().split('\n')
      setNextQuestions(questions)
    } catch (e) {
      toast.error('Failed to generate follow questions')
    }
    setIsQuestionLoading(false)
  }

  const handleDuplicateChat = async () => {
    const handleResponse = async (response: Response) => {
      if (!response.ok) {
        throw new Error('Failed to duplicate chat')
      }
      const data = await response.json()
      setChatItems(data.chatItems)
      await router.push(`/chat/${data.newChatItem.item_uuid}`)
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatUuid: router.query.id
      })
    }

    toast.promise(fetch('/api/chat/generateDuplicateChat', options), {
      loading: 'Duplicating chat...',
      success: (response) => {
        handleResponse(response)
        return 'Chat duplicated successfully'
      },
      error: 'Failed to duplicate chat'
    })
  }

  const handleViewScreenshot = () => {
    const chatContent = document.getElementById('chat-content')!

    const asyncWork = html2canvas(chatContent)
    toast.promise(asyncWork, {
      loading: 'Generating screenshot...',
      success: (canvas) => {
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            window.open(url, '_blank')
          }
        }, 'image/png')
        return 'Screenshot generated successfully'
      },
      error: 'Failed to generate screenshot'
    })
  }

  const handleSaveScreenshot = () => {
    const chatContent = document.getElementById('chat-content')!

    const asyncWork = html2canvas(chatContent)
    toast.promise(asyncWork, {
      loading: 'Generating screenshot...',
      success: (canvas) => {
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'chat-screenshot.png'
            a.click()
          }
        }, 'image/png')
        return 'Screenshot saved successfully'
      },
      error: 'Failed to save screenshot'
    })
  }

  const normalDivClass = clsx(
    'flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-gray-200/60',
    'dark:hover:bg-chatpage-message-robot-content-dark',
    disabled && 'opacity-40'
  )

  return (
    <div>
      <Toaster richColors position={'top-center'}/>
      {/* generate chat title */}
      <div className={normalDivClass} onClick={handleGenerateChatTitle}>
        <TIcon width={16} height={16}/>
        {t('chatPage.message.generateChatTitle')}
      </div>

      {/* generate follow questions  */}
      <div className={normalDivClass} onClick={handleGenerateFollowQuestions}>
        <MessageQuestionIcon width={16} height={16}/>
        {t('chatPage.message.generateQuestions')}
      </div>

      {/* duplicate chat */}
      <div className={normalDivClass} onClick={handleDuplicateChat}>
        <CopyFolderIcon width={16} height={16}/>
        {t('chatPage.message.duplicateChat')}
      </div>

      {/* View Screenshot */}
      <div className={normalDivClass} onClick={handleViewScreenshot}>
        <ScreenshotIcon width={16} height={16}/>
        {t('chatPage.message.viewScreenshot')}
      </div>

      {/* Save Screenshot */}
      <div className={normalDivClass} onClick={handleSaveScreenshot}>
        <PhotoShareIcon width={16} height={16}/>
        {t('chatPage.message.saveScreenshot')}
      </div>

      {/* ignore messages */}
      <div className={normalDivClass} onClick={handleAddIgnoreLine}>
        <SeparatorIcon width={16} height={16}/>
        {t('chatPage.message.ignoreMessages')}
      </div>

      {/* clear messages */}
      <div
        className={clsx(normalDivClass, 'text-rose-600 dark:text-red-500')}
        onClick={() => setShowDeleteModal(true)}
      >
        <MessageClearIcon width={16} height={16}/>
        {t('chatPage.message.deleteMessages')}
      </div>
    </div>
  )
}
