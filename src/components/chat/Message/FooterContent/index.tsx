import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { type ChatRequestOptions } from 'ai'
import { type Message, type CreateMessage } from 'ai/react'
import { useSpeechRecognition } from 'react-speech-recognition'

import FooterHeader from '@/components/chat/Message/FooterContent/FooterHeader'
import FooterTextArea from '@/components/chat/Message/FooterContent/FooterTextArea'

interface IProps {
  isLoading: boolean
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
}

export default function FooterContent(props: IProps) {
  const { isLoading, append } = props
  const router = useRouter()
  const ref = useRef<HTMLTextAreaElement>(null) // or this way: create ref in FooterTextArea.tsx
  const { transcript, listening, resetTranscript } = useSpeechRecognition()

  // when the router.query.id changes, reset the textarea value and focus on it.
  useEffect(() => {
    if (ref.current) {
      ref.current.value = ''
      ref.current?.focus()
    }
  }, [router.query.id])

  return (
    <div className={'w-full flex flex-col items-center border-t dark:border-t-gray-500'}>
      {/* icons */}
      <FooterHeader listening={listening} resetTranscript={resetTranscript} />

      {/* footer main content area: textarea */}
      <FooterTextArea
        ref={ref}
        isLoading={isLoading}
        append={append}
        listening={listening}
        transcript={transcript}
        resetTranscript={resetTranscript}
      />
    </div>
  )
}
