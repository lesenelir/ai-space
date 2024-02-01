import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { toast, Toaster } from 'sonner'
import { useTranslation } from 'next-i18next'
import {
  type FormEvent,
  useMemo,
  useRef,
  useState
} from 'react'

import { maxTokensAtom, selectedModelIdAtom } from '@/atoms'
import { useGetChatInformation } from '@/hooks'
import RefreshIcon from '@/components/icons/RefreshIcon'
import ConfettiIcon from '@/components/icons/ConfettiIcon'
import CommonSelect from '@/components/common/commonSelect'
import CommonMessageHeader from '@/components/common/commonMessageHeader'
import LanguageSelector from '@/components/translate/TranslateMessage/LanguageSelector'

export default function TranslateMessage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const maxTokens = useAtomValue(maxTokensAtom)
  const [text, setText] = useState<string>('')
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null)
  const [translating, setTranslating] = useState<boolean>(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English')
  const { modelName } = useGetChatInformation(router.query.id as string | undefined, selectedModelId)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // inputTextArea is required, so it will never be null
    const inputText = inputTextAreaRef.current?.value!

    // 1. initialize
    setTranslating(true)
    const sendContent = [
      {
        role: 'user',
        content: `
          Use ${selectedLanguage} language to translate text: 
          ${inputText}.
          Please give me the final translation result directly, without any other content.
          At the same time, I want the format of the content you give me at the end to be exactly 
          the same as the format of the content I ask you to translate, corresponding one-to-one.
        `
      }
    ]

    // 2. send message to llm model
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        temperature: 0.2,
        max_tokens: maxTokens,
        model_name: modelName!,
        send_content: sendContent,
      })
    }
    const res = await fetch('/api/chat/send', options)
    if (!res.ok || !res.body) {
      setTranslating(false)
      toast.error('Network Connection Error')
      return
    }

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

      setTranslating(false)
    } catch (e) {
      toast.error('network error')
      setTranslating(false)
    }
  }

  const textAreaClassName = useMemo(() => (
    clsx(
      'w-full h-96 bg-transparent border dark:border-gray-500',
      'resize-none rounded-lg p-2',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500',
    )
  ), [])

  return (
    <div
      className={clsx(
        'flex-1 w-full flex flex-col bg-gray-50 overflow-y-auto custom-message-light-scrollbar',
        'dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'
      )}
    >
      <CommonMessageHeader/>

      <Toaster richColors position={'top-center'} className={'fixed'}/>

      <form className={'w-full p-3 flex flex-row gap-4 max-sm:flex-col'} onSubmit={handleSubmit}>
        {/* left / top */}
        <div className={'w-1/3 max-sm:w-full'}>
          <p className={'text-lg font-medium mb-2 sm:h-32 sm:flex sm:items-end'}>
            {t('translatePage.input')}
          </p>
          <textarea
            required={true}
            ref={inputTextAreaRef}
            className={textAreaClassName}
          />
        </div>

        {/* right / bottom */}
        <div className={'w-2/3 max-sm:w-full'}>
          <div className={'sm:h-32 flex flex-wrap items-end gap-2 mb-2'}>
            <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage}/>
            <div>
              <CommonSelect/>
            </div>
            <div className={'sm:ml-auto'}>
              <button
                type={'submit'}
                disabled={translating}
                className={clsx(
                  'w-fit flex justify-center items-center gap-2',
                  'bg-blue-500 p-2 rounded-lg text-white',
                  'shadow-md text-sm hover:bg-blue-500/90 hover-transition-change',
                  'disabled:opacity-80 disabled:cursor-not-allowed'
                )}
              >
                {
                  translating ? (
                    <RefreshIcon width={16} height={16} className={'animate-spinReverse'}/>
                  ) : (
                    <ConfettiIcon width={16} height={16}/>
                  )
                }
                {t('translatePage.translate')}
              </button>
            </div>
          </div>

          <textarea
            defaultValue={text}
            className={textAreaClassName}
          />
        </div>
      </form>
    </div>
  )
}
