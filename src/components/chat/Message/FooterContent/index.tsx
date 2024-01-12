import { useRouter } from 'next/router'
import { useSpeechRecognition } from 'react-speech-recognition'
import {
  type Dispatch,
  type MutableRefObject,
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
  abortController: MutableRefObject<AbortController | null>
}

export default function FooterContent(props: IProps) {
  const { messages, setMessages, abortController } = props
  const router = useRouter()
  const { transcript, listening, resetTranscript } = useSpeechRecognition()
  const [remoteUrls, setRemoteUrls] = useState<TImage[]>([])
  const [previewUrls, setPreviewUrls] = useState<TImage[]>([])
  const [uploading, setUploading] = useState<{[key: string]: boolean}>({})
  const abortImageController = useRef<{[key: string]: AbortController}>({})
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
        listening={listening}
        setMessages={setMessages}
        previewUrls={previewUrls}
        setUploading={setUploading}
        setRemoteUrls={setRemoteUrls}
        setPreviewUrls={setPreviewUrls}
        resetTranscript={resetTranscript}
        abortImageController={abortImageController}
      />

      {/* footer main content area: textarea */}
      {/* ref={ref}; does not forward ref */}
      <FooterTextArea
        messages={messages}
        listening={listening}
        uploading={uploading}
        transcript={transcript}
        remoteUrls={remoteUrls}
        setMessages={setMessages}
        previewUrls={previewUrls}
        setUploading={setUploading}
        setRemoteUrls={setRemoteUrls}
        setPreviewUrls={setPreviewUrls}
        abortController={abortController}
        resetTranscript={resetTranscript}
        abortImageController={abortImageController}
      />
    </div>
  )
}
