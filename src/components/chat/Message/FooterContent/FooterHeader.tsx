import { useAtomValue } from 'jotai'
import { toast, Toaster } from 'sonner'
import { useRouter } from 'next/router'
import type { Message } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import { chatMessagesAtom } from '@/atoms'
import Modal from '@/components/ui/Modal'
import Tooltip from '@/components/ui/Tooltip'
import DropDown from '@/components/ui/DropDown'
import DotsIcon from '@/components/icons/DotsIcon'
import useOutsideClick from '@/hooks/useOutsideClick'
import PlayerRecordIcon from '@/components/icons/PlayerRecord'
import MicrophoneIcon from '@/components/icons/MicrophoneIcon'
import ModalDelete from '@/components/chat/Message/FooterContent/ModalDelete'
import FooterMoreIconsData from '@/components/chat/Message/FooterContent/FooterMoreIconsData'

interface IProps {
  listening: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  resetTranscript: () => void
}

export default function FooterHeader(props: IProps) {
  const { listening, resetTranscript, messages, setMessages } = props
  const router = useRouter()
  const { t } = useTranslation('common')
  const { browserSupportsSpeechRecognition } = useSpeechRecognition()
  const chatMessages = useAtomValue(chatMessagesAtom)
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)
  const dropDownDivRef = useRef<HTMLDivElement>(null)
  const triggerDivRef = useRef<HTMLDivElement>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  useEffect(() => {
    if (!chatMessages.length && !messages.length) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [chatMessages.length, messages.length])

  useOutsideClick(dropDownDivRef, (event) => {
    if (!triggerDivRef.current?.contains(event!.target as Node)) setIsDropDownOpen(false)
  })

  const handleSpeechRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Your browser does not support speech recognition.')
      return
    }

    if (listening) {
      // stop listening
      SpeechRecognition.stopListening().then(() => {
        resetTranscript()
      })
      return
    } else {
      SpeechRecognition.startListening({
        continuous: true,
        language: 'zh-CN',  // not general...
      }).then(() => {})
    }
  }

  return (
    <>
      {
        showDeleteModal && (
          <Modal
            motionClassName={'w-1/3 h-[170px] p-4 bg-zinc-800 text-white border border-gray-500 rounded-xl'}
            onClose={() => setShowDeleteModal(true)}
          >
            <ModalDelete setShowDeleteModal={setShowDeleteModal} setMessages={setMessages}/>
          </Modal>
        )
      }

      <Toaster richColors position={'top-center'}/>
      {/* icons */}
      <div className={'md:w-[640px] max-md:w-full p-1 flex'}>
        {/* microphone */}
        <div
          className={'relative p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
          onClick={handleSpeechRecognition}
        >
          {
            listening ? (
              <PlayerRecordIcon width={16} height={16} className={'animate-record text-rose-700 dark:text-rose-400'}/>
            ) : (
              <Tooltip title={t('chatPage.message.voiceInput')} className={'w-24 left-0 flex justify-center'}>
                <MicrophoneIcon width={16} height={16}/>
              </Tooltip>
            )
          }
        </div>

        {/* more */}
        {
          router.query.id && (
            <div
              ref={triggerDivRef}
              className={'relative p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
              onClick={() => setIsDropDownOpen(!isDropDownOpen)}
            >
              {
                isDropDownOpen && (
                  <DropDown
                    ref={dropDownDivRef}
                    className={`w-48 bottom-7 left-0 ${disabled && 'pointer-events-none'}`}
                    motionClassName={`
                      bg-gray-50 border
                      dark:bg-chatpage-message-background-dark dark:border-gray-500 dark:text-chatpage-message-text-dark
                    `}
                    motionAnimation={{
                      initial: {opacity: 0, y: '20%'},
                      animate: {opacity: 1, y: 0},
                    }}
                  >
                    <FooterMoreIconsData disabled={disabled} messages={messages} setShowDeleteModal={setShowDeleteModal}/>
                  </DropDown>
                )
              }
              {/* more */}
              <DotsIcon width={16} height={16}/>
            </div>
          )
        }
      </div>
    </>
  )
}
