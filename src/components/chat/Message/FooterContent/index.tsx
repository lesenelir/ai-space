import { type ChatRequestOptions } from 'ai'
import { type Message, type CreateMessage } from 'ai/react'
import { useSpeechRecognition } from 'react-speech-recognition'

import FooterHeader from '@/components/chat/Message/FooterContent/FooterHeader'
import FooterTextArea from '@/components/chat/Message/FooterContent/FooterTextArea'

interface IProps {
  isLoading: boolean
  messages: Message[]
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
}

export default function FooterContent(props: IProps) {
  const { isLoading, append, messages } = props
  const { transcript, listening, resetTranscript } = useSpeechRecognition()
  // const ref = useRef<HTMLTextAreaElement>(null) // or this way: create ref in FooterTextArea.tsx

  return (
    <div className={'w-full flex flex-col items-center border-t dark:border-t-gray-500'}>
      {/* icons */}
      <FooterHeader
        messages={messages}
        listening={listening}
        resetTranscript={resetTranscript}
      />

      {/* footer main content area: textarea */}
      {/* ref={ref}; does not forward ref */}
      <FooterTextArea
        isLoading={isLoading}
        append={append}
        listening={listening}
        transcript={transcript}
        resetTranscript={resetTranscript}
      />
    </div>
  )
}
