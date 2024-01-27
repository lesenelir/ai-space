import { useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useSpeechRecognition } from 'react-speech-recognition'
import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  forwardRef,
  useEffect
} from 'react'

import {
  nextQuestionsAtom,
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

const FooterContent = forwardRef<HTMLTextAreaElement, IProps>((
  props,
  ref
) => {
  const {
    messages,
    setMessages,
    abortController,
    abortImageController
  } = props
  const router = useRouter()
  const setRemoteUrls = useSetAtom(remoteUrlsAtom)
  const setPreviewUrls = useSetAtom(previewUrlsAtom)
  const setUploading = useSetAtom(uploadingAtom)
  const nextQuestions = useSetAtom(nextQuestionsAtom)
  const { transcript, listening, resetTranscript } = useSpeechRecognition()

  // when router.query.id changes, reset remoteUrls, previewUrls, uploading
  useEffect(() => {
    setRemoteUrls([])
    setPreviewUrls([])
    setUploading({})
    nextQuestions([])
  }, [nextQuestions, router.query.id, setPreviewUrls, setRemoteUrls, setUploading])

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
        ref={ref}
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
})

FooterContent.displayName = 'FooterContent'

export default FooterContent
