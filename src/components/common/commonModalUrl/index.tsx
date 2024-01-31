import clsx from 'clsx'
import { toast, Toaster } from 'sonner'
import { useTranslation } from 'next-i18next'
import {
  type MutableRefObject,
  type SetStateAction,
  type FormEvent,
  type Dispatch,
  forwardRef,
  useState,
  useRef,
} from 'react'

import RefreshIcon from '@/components/icons/RefreshIcon'

interface IProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  setShowAudio?: Dispatch<SetStateAction<boolean>>
  setText?: Dispatch<SetStateAction<string>>
}

const CommonModalUrl = forwardRef<HTMLTextAreaElement, IProps>((
  props,
  ref
) => {
  const { setIsModalOpen, setShowAudio, setText } = props
  const { t } = useTranslation('common')
  const inputRef = useRef<HTMLInputElement>(null)
  const [extracting, setExtracting] = useState<boolean>(false)
  const textAreaRef = ref as MutableRefObject<HTMLTextAreaElement>

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url = inputRef.current?.value!

    if (isValidUrl(url)) {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      }
      setExtracting(true)
      try {
        const response = await fetch('/api/tts/extractContent', options)
        if (!response.ok) { // return status 500
          toast.error('extract data error, because of network problem')
          setShowAudio && setShowAudio(false)
          setText && setText('')
          setExtracting(false)
          setIsModalOpen(false)
          textAreaRef.current.value = ''
          textAreaRef.current.style.height = 'auto'
          textAreaRef.current.style.height = '144px'
          return
        }
        const data = await response.json()
        textAreaRef.current.value = data.text
        textAreaRef.current.style.height = 'auto'
        textAreaRef.current.style.height = Math.min(Math.max(textAreaRef.current.scrollHeight, 144), 250) + 'px'
      } catch (e) {
        toast.error('extract data error')
        textAreaRef.current.value = ''
      }
      setShowAudio && setShowAudio(false)
      setText && setText('')
      setExtracting(false)
      setIsModalOpen(false)
    } else {
      toast.error('please input correct url')
    }
  }

  return (
    <>
      <Toaster richColors position={'top-center'} className={'fixed'}/>
      <div className={'w-full h-full flex flex-col gap-5'}>
        <div className={'flex flex-col gap-2'}>
          <h1 className={'text-xl font-medium'}>
            {t('ttsPage.enterURL')}
          </h1>
          <p className={'text-sm text-gray-600 dark:text-gray-200'}>
            {t('ttsPage.urlModalText')}
          </p>
        </div>

        <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type={'url'}
            required={true}
            placeholder={t('ttsPage.urlModalInputPlaceholder')}
            className={clsx(
              'bg-transparent text-sm h-10 border p-1.5 rounded-lg dark:border-gray-500',
              'focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500'
            )}
          />

          <div className={'self-end flex gap-2'}>
            <button
              type={'button'}
              className={clsx(
                'w-20 border p-2 text-sm rounded-lg active:border-blue-500',
                'dark:border-gray-500 text-gray-800 dark:text-white',
                'hover:bg-gray-500/10 hover-transition-change'
              )}
              onClick={() => setIsModalOpen(false)}
            >
              {t('ttsPage.cancel')}
            </button>
            <button
              type={'submit'}
              disabled={extracting}
              className={clsx(
                'w-20 bg-blue-500 p-2 rounded-lg text-white flex justify-center items-center gap-1',
                'shadow-md text-sm hover:bg-blue-500/90 hover-transition-change active:border-blue-500',
                'disabled:opacity-80 disabled:hover:bg-blue-500 disabled:cursor-not-allowed',
                extracting && 'w-fit'
              )}
            >
              {extracting && (
                <RefreshIcon width={16} height={16} className={'animate-spinReverse'}/>
              )}
              {t('ttsPage.confirm')}
            </button>
          </div>
        </form>
      </div>
    </>
  )
})

CommonModalUrl.displayName = 'CommonModalUrl'

export default CommonModalUrl



