import { toast, Toaster } from 'sonner'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import Tooltip from '@/components/ui/Tooltip'
import DropDown from '@/components/ui/DropDown'
import DotsIcon from '@/components/icons/DotsIcon'
import PlayerRecordIcon from '@/components/icons/PlayerRecord'
import MicrophoneIcon from '@/components/icons/MicrophoneIcon'
import useOutsideClick from '@/hooks/useOutsideClick'
import FooterMoreIconsData from '@/components/chat/Message/FooterContent/FooterMoreIconsData'

interface IProps {
  listening: boolean
  resetTranscript: () => void
}

export default function FooterHeader(props: IProps) {
  const { listening, resetTranscript } = props
  const router = useRouter()
  const { t } = useTranslation('common')
  const { browserSupportsSpeechRecognition } = useSpeechRecognition()
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
  const dropDownDivRef = useRef<HTMLDivElement>(null)
  const triggerDivRef = useRef<HTMLDivElement>(null)

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
                    className={'w-48 bottom-7 left-0'}
                    motionClassName={`
                  bg-gray-50 border
                  dark:bg-chatpage-message-background-dark dark:border-gray-500 dark:text-chatpage-message-text-dark
                `}
                    motionAnimation={{
                      initial: {opacity: 0, y: '20%'},
                      animate: {opacity: 1, y: 0},
                    }}
                  >
                    <FooterMoreIconsData/>
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
