import clsx from 'clsx'
import { toast, Toaster } from 'sonner'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type CompositionEvent,
  useState,
  useRef,
  useEffect,
} from 'react'

import {
  selectedModelIdAtom,
  temperatureAtom,
  maxTokensAtom,
} from '@/atoms'
import { useGetChatInformation } from '@/hooks'
import Modal from '@/components/ui/Modal'
import WandIcon from '@/components/icons/WandIcon'
import RefreshIcon from '@/components/icons/RefreshIcon'
import CommonSelect from '@/components/common/commonSelect'
import CommonModalUrl from '@/components/common/commonModalUrl'
import CommonMessageHeader from '@/components/common/commonMessageHeader'
import CommonMarkdownRender from '@/components/common/commonMarkdownRender'

export default function SummarizeMessage() {
  const maxHeight = 200
  const router = useRouter()
  const { t } = useTranslation('common')
  const maxTokens = useAtomValue(maxTokensAtom)
  const temperature  = useAtomValue(temperatureAtom)
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isComposing, setIsComposing] = useState<boolean>(false)
  const [summarizing, setSummarizing] = useState<boolean>(false)
  const { modelName } = useGetChatInformation(router.query.id as string | undefined, selectedModelId)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  // update scroll to the bottom when the messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [text])

  const handleComposition = (e: CompositionEvent) => {
    if (e.type === 'compositionstart') {
      setIsComposing(true)
    } else {
      setIsComposing(false)
    }
  }

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(Math.max(textarea.scrollHeight, 144), maxHeight) + 'px'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) return

    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e).then()
    }
  }

  const handleSubmit = async (e: FormEvent | KeyboardEvent) => {
    e.preventDefault()
    // because of the `required` attribute, so we don't need to check the value
    const value = textAreaRef.current!.value || ''

    // 1. initialize
    setSummarizing(true)
    const sendContent = [
      {
        role: 'system',
        content: 'Could you please provide a concise and comprehensive summary of the given text? ' +
          'The summary should capture the main points and key details of the text while conveying the author\'s intended meaning accurately. ' +
          'Please ensure that the summary is well-organized and easy to read, with clear headings and subheadings to guide the reader through each section. ' +
          'The length of the summary should be appropriate to capture the main points and key details of the text, ' +
          'without including unnecessary information or becoming overly long.'
      },
      {
        role: 'user',
        content: value
      }
    ]

    // 2. send message to LLM model
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        temperature,
        max_tokens: maxTokens,
        model_name: modelName!,
        send_content: sendContent,
      })
    }

    const res = await fetch('/api/chat/send', options)
    if (!res.ok || !res.body) return

    let completion = ''
    try {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        completion += decoder.decode(value)
        setText(completion)
      }

    } catch (e) {
      toast.error('network error')
    }

    setSummarizing(false)
  }

  return (
    <div
      className={clsx(
        'flex-1 w-full flex flex-col bg-gray-50 overflow-y-auto custom-message-light-scrollbar',
        'dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'
      )}
    >
      <CommonMessageHeader/>

      <Toaster richColors position={'top-center'} className={'fixed'}/>

      {
        isModalOpen && (
          <>
            <Modal
              motionClassName={clsx(
                'w-1/3 h-[210px] p-4 border border-gray-500 rounded-xl',
                'bg-white text-black',
                'dark:bg-zinc-800 dark:text-white'
              )}
              onClose={() => setIsModalOpen(true)}
            >
              <CommonModalUrl ref={textAreaRef} setIsModalOpen={setIsModalOpen} setText={setText}/>
            </Modal>
          </>
        )
      }

      {/* Message Content */}
      <form className={'flex flex-col gap-4 p-3'} onSubmit={handleSubmit}>
        <textarea
          ref={textAreaRef}
          required={true}
          placeholder={t('ttsPage.textPlaceholder')}
          className={clsx(
            'resize-none w-full h-[144px] p-3 text-sm rounded-lg',
            'custom-message-light-scrollbar bg-transparent focus:outline-none',
            'border dark:border-gray-500',
            'focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500',
          )}
          onChange={handleTextAreaChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
        />

        {/* icons */}
        <div className={'flex gap-4'}>
          <CommonSelect/>

          <button
            type={'submit'}
            disabled={summarizing}
            className={clsx(
              'w-fit min-w-20 bg-blue-500 p-2 rounded-lg text-white flex items-center gap-1',
              'shadow-sm text-sm hover:bg-blue-500/90 hover-transition-change active:border-blue-500',
              'disabled:opacity-80 disabled:hover:bg-blue-500 disabled:cursor-not-allowed'
            )}
          >
            {
              summarizing ? (
                <RefreshIcon width={16} height={16} className={'animate-spinReverse'}/>
              ) : (
                <WandIcon width={16} height={16}/>
              )
            }
            {t('summarizePage.summarize')}
          </button>

          <button
            type={'button'}
            className={clsx(
              'p-2 font-normal text-sm rounded-lg border border-input',
              'hover:bg-gray-200/80 hover-transition-change',
              'dark:hover:bg-gray-500/10 dark:border-gray-500'
            )}
            onClick={() => setIsModalOpen(true)}
          >
            {t('ttsPage.loadFromURL')}
          </button>
        </div>
      </form>

      {/* message text */}
      <div className={'p-3'}>
        {
          text.length > 0 && (
            <div className={'w-full flex flex-col gap-2 p-3 border rounded-lg dark:border-gray-500'}>
              <p className={'font-semibold dark:text-white'}>Summary:</p>
              <article
                ref={endOfMessagesRef}
                className={'prose dark:prose-invert '}
              >
                <CommonMarkdownRender markdown={text}/>
              </article>
            </div>
          )
        }
      </div>
    </div>
  )
}
