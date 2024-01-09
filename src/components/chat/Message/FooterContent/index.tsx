import { useRouter } from 'next/router'
import { useSpeechRecognition } from 'react-speech-recognition'
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'

import type { TImage, TMessage } from '@/types'
import FooterHeader from '@/components/chat/Message/FooterContent/FooterHeader'
import FooterTextArea from '@/components/chat/Message/FooterContent/FooterTextArea'

interface IProps {
  messages: TMessage[]
  setMessages: Dispatch<SetStateAction<TMessage[]>>
}

export default function FooterContent(props: IProps) {
  const { messages, setMessages } = props
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

  return (
    <div className={'w-full flex flex-col items-center border-t dark:border-t-gray-500'}>
      {/* icons */}
      <FooterHeader
        messages={messages}
        setMessages={setMessages}
        listening={listening}
        previewUrls={previewUrls}
        resetTranscript={resetTranscript}
        setPreviewUrls={setPreviewUrls}
        setUploading={setUploading}
        setRemoteUrls={setRemoteUrls}
        abortControllers={abortControllers}
      />

      {/* footer main content area: textarea */}
      {/* ref={ref}; does not forward ref */}
      <FooterTextArea
        messages={messages}
        setMessages={setMessages}
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
