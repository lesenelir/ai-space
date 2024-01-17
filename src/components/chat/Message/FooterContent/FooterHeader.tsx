import clsx from 'clsx'
import { v4 as uuid } from 'uuid'
import { useAtomValue } from 'jotai'
import { toast, Toaster } from 'sonner'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'

import { chatMessagesAtom, selectedModelIdAtom } from '@/atoms'
import { uploadImage } from '@/utils'
import type { TImage, TMessage } from '@/types'
import Modal from '@/components/ui/Modal'
import Tooltip from '@/components/ui/Tooltip'
import DropDown from '@/components/ui/DropDown'
import DotsIcon from '@/components/icons/DotsIcon'
import LinkIcon from '@/components/icons/LinkIcon'
import useOutsideClick from '@/hooks/useOutsideClick'
import RefreshIcon from '@/components/icons/RefreshIcon'
import PlayerRecordIcon from '@/components/icons/PlayerRecord'
import MicrophoneIcon from '@/components/icons/MicrophoneIcon'
import useGetChatInformation from '@/hooks/useGetChatInformation'
import ModalDelete from '@/components/chat/Message/FooterContent/ModalDelete'
import FooterMoreIconsData from '@/components/chat/Message/FooterContent/FooterMoreIconsData'

interface IProps {
  listening: boolean
  messages: TMessage[]
  previewUrls: TImage[]
  resetTranscript: () => void
  setMessages: Dispatch<SetStateAction<TMessage[]>>
  setRemoteUrls: Dispatch<SetStateAction<TImage[]>>
  setPreviewUrls: Dispatch<SetStateAction<TImage[]>>
  setUploading: Dispatch<SetStateAction<{[p: string]: boolean}>>
  abortImageController: MutableRefObject<{[p: string]: AbortController}>
}

export default function FooterHeader(props: IProps) {
  const {
    listening,
    resetTranscript,
    messages,
    previewUrls,
    setMessages,
    setPreviewUrls,
    setUploading,
    setRemoteUrls,
    abortImageController
  } = props
  const router = useRouter()
  const { t } = useTranslation('common')
  const { browserSupportsSpeechRecognition } = useSpeechRecognition()
  const chatMessages = useAtomValue(chatMessagesAtom)
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const [disabled, setDisabled] = useState<boolean>(true)
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [generatingChatTitle, setGeneratingChatTitle] = useState<boolean>(false)
  const dropDownDivRef = useRef<HTMLDivElement>(null)
  const triggerDivRef = useRef<HTMLDivElement>(null)
  const hiddenUploadImageRef = useRef<HTMLInputElement>(null)
  const { modelName } = useGetChatInformation(router.query.id as string | undefined, selectedModelId)

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

  const handleUploadImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const [files, len] = [e.target.files, e.target.files.length]
    const newPreviewUrls: TImage[] = []

    for (let i = 0; i < len; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = () => {
        newPreviewUrls.push({id: uuid(), url: reader.result as string})
        if (newPreviewUrls.length === files.length) {
          setPreviewUrls(prev => [...prev, ...newPreviewUrls])
          handleUploadSubmit(e, e.target.files, newPreviewUrls)
        }
      }
      reader.readAsDataURL(file)
    }

  }

  const handleUploadSubmit = (
    e: FormEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement>,
    files: FileList | null,
    newPreviewUrls: TImage[] | null
  ) => {
    e.preventDefault()
    if (!files || !files.length) return

    const mergedPreviewUrls = [...previewUrls, ...(newPreviewUrls || [])]
    const len = !Object.keys(previewUrls).length ? files.length : mergedPreviewUrls.length
    const start = !Object.keys(previewUrls).length ? 0 : previewUrls.length

    // initial uploading state
    const initialUploadingState: {[key: string]: boolean} = {}
    for (let i = start; i < len; i++) {
      initialUploadingState[mergedPreviewUrls[i].id] = true
    }

    setUploading(initialUploadingState)

    // update images urls to cloudinary
    const uploadTask = [...files].map(async (file, index) => {
      const controller = new AbortController() // cancel upload (abort)
      abortImageController.current[mergedPreviewUrls[start + index].id] = controller

      try {
        const item = await uploadImage(file, mergedPreviewUrls[start + index].id, controller)
        setUploading(prev => ({...prev, [mergedPreviewUrls[start + index].id]: false})) // when upload success, set uploading to false
        return item
      } catch {
        setUploading(prev => ({...prev, [mergedPreviewUrls[start + index].id]: false})) // when upload failed, set uploading to false
        return undefined
      }
    })

    Promise.all(uploadTask).then((values) => {
      const successfulUploads = values.filter(item => item !== undefined) as TImage[]
      setUploading({}) // reset uploading state
      setRemoteUrls(prev => [...prev, ...successfulUploads])
    }).catch((error) => {
      console.log(error)
    })
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
      <div className={'md:max-w-screen-sm w-full max-md:w-full p-1 flex'}>
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

        {/* upload */}
        {
          modelName === 'gpt-4-vision-preview' && (
            <div onClick={() => hiddenUploadImageRef.current?.click()}>
              <form
                className={'relative p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
                onSubmit={(e) => handleUploadSubmit(e, null, null)}
              >
                <Tooltip title={t('chatPage.message.upload')} className={'w-24 left-0 flex justify-center'}>
                  <input
                    ref={hiddenUploadImageRef}
                    multiple={true}
                    type={'file'}
                    accept={'image/*'}
                    className={'opacity-0 absolute w-0 h-0'}
                    onChange={handleUploadImageChange}
                  />
                  <LinkIcon width={16} height={16}/>
                </Tooltip>
              </form>
            </div>
          )
        }

        {/* more */}
        {
          router.query.id && (
            generatingChatTitle ? (
              <div className={'relative p-2 rounded-md hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}>
                <Tooltip title={t('chatPage.message.generating')} className={'w-28 left-0 flex justify-center'}>
                  <RefreshIcon width={16} height={16} className={'animate-spinReverse'}/>
                </Tooltip>
              </div>
            ) : (
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
                      motionClassName={clsx(
                        'bg-gray-50 border',
                        'dark:bg-chatpage-message-background-dark dark:border-gray-500 dark:text-chatpage-message-text-dark'
                      )}
                      motionAnimation={{
                        initial: {opacity: 0, y: '20%'},
                        animate: {opacity: 1, y: 0},
                      }}
                    >
                      <FooterMoreIconsData
                        disabled={disabled}
                        messages={messages}
                        setShowDeleteModal={setShowDeleteModal}
                        setGeneratingChatTitle={setGeneratingChatTitle}
                      />
                    </DropDown>
                  )
                }
                {/* more */}
                <DotsIcon width={16} height={16}/>
              </div>
            )
          )
        }
      </div>
    </>
  )
}
