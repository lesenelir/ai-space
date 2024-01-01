import { toast, Toaster } from 'sonner'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import DotsIcon from '@/components/icons/DotsIcon'
import PlayerRecordIcon from '@/components/icons/PlayerRecord'
import MicrophoneIcon from '@/components/icons/MicrophoneIcon'

interface IProps {
  listening: boolean
  resetTranscript: () => void
}

export default function FooterHeader(props: IProps) {
  const { listening, resetTranscript } = props
  const { browserSupportsSpeechRecognition } = useSpeechRecognition()

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
          className={'p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
          onClick={handleSpeechRecognition}
        >
          {
            listening ? (
              <PlayerRecordIcon width={16} height={16} className={'animate-record text-rose-700 dark:text-rose-400'}/>
            ) : (
              <MicrophoneIcon width={16} height={16}/>
            )
          }
        </div>

        {/* more */}
        <DotsIcon
          width={16}
          height={16}
          className={'p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
        />
      </div>
    </>
  )
}
