import { useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useSpeechRecognition } from 'react-speech-recognition'
import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
} from 'react'

import {
  previewUrlsAtom,
  remoteUrlsAtom,
  uploadingAtom
} from '@/atoms'
import type { TMessage } from '@/types'
import FooterHeader from '@/components/chat/Message/FooterContent/FooterHeader'
import FooterTextArea from '@/components/chat/Message/FooterContent/FooterTextArea'

interface IProps {
  messages: TMessage[]
  setMessages: Dispatch<SetStateAction<TMessage[]>>
  abortController: MutableRefObject<AbortController | null>
  abortImageController: MutableRefObject<{[p: string]: AbortController}>
}

export default function FooterContent(props: IProps) {
  const { messages, setMessages, abortController, abortImageController } = props
  const router = useRouter()
  const setRemoteUrls = useSetAtom(remoteUrlsAtom)
  const setPreviewUrls = useSetAtom(previewUrlsAtom)
  const setUploading = useSetAtom(uploadingAtom)
  const { transcript, listening, resetTranscript } = useSpeechRecognition()

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
        resetTranscript={resetTranscript}
        abortImageController={abortImageController}
      />

      {/* footer main content area: textarea */}
      <FooterTextArea
        messages={messages}
        listening={listening}
        transcript={transcript}
        setMessages={setMessages}
        abortController={abortController}
        resetTranscript={resetTranscript}
        abortImageController={abortImageController}
      />
    </div>
  )
}
