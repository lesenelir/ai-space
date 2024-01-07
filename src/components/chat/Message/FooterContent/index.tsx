import { useRouter } from 'next/router'
import { type ChatRequestOptions } from 'ai'
import { useEffect, useRef, useState } from 'react'
import { type Message, type CreateMessage } from 'ai/react'
import { useSpeechRecognition } from 'react-speech-recognition'

import { type TImage } from '@/types'
import FooterHeader from '@/components/chat/Message/FooterContent/FooterHeader'
import FooterTextArea from '@/components/chat/Message/FooterContent/FooterTextArea'

interface IProps {
  isLoading: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
}

export default function FooterContent(props: IProps) {
  const { isLoading, append, messages, setMessages } = props
  const router = useRouter()
  const { transcript, listening, resetTranscript } = useSpeechRecognition()
  const [remoteUrls, setRemoteUrls] = useState<TImage[]>([])
  const [previewUrls, setPreviewUrls] = useState<TImage[]>([])
  const [uploading, setUploading] = useState<{[key: string]: boolean}>({})
  const abortControllers = useRef<{[key: string]: AbortController}>({})
  // const ref = useRef<HTMLTextAreaElement>(null) // or this way: create ref in FooterTextArea.tsx

  // when router.query.id changes, reset remoteUrls, previewUrls, uploading
  useEffect(() => {
    setRemoteUrls([])
    setPreviewUrls([])
    setUploading({})
  }, [router.query.id])

  console.log(remoteUrls)
  console.log(previewUrls, 'asdasd')
  return (
    <div className={'w-full flex flex-col items-center border-t dark:border-t-gray-500'}>
      {/* icons */}
      <FooterHeader
        messages={messages}
        setMessages={setMessages}
        listening={listening}
        resetTranscript={resetTranscript}
        setPreviewUrls={setPreviewUrls}
        setUploading={setUploading}
        setRemoteUrls={setRemoteUrls}
        abortControllers={abortControllers}
      />

      {/* footer main content area: textarea */}
      {/* ref={ref}; does not forward ref */}
      <FooterTextArea
        isLoading={isLoading}
        append={append}
        listening={listening}
        transcript={transcript}
        resetTranscript={resetTranscript}
        previewUrls={previewUrls}
        setPreviewUrls={setPreviewUrls}
        remoteUrls={remoteUrls}
        setRemoteUrls={setRemoteUrls}
        uploading={uploading}
        setUploading={setUploading}
        abortControllers={abortControllers}
      />
    </div>
  )
}
