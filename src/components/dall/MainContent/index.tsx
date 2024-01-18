import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { type FormEvent, useRef, useState } from 'react'

import LoadingDots from '@/components/common/chat/LoadingDots'
import ShowImages from '@/components/dall/MainContent/ShowImages'

export default function MainContent() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [urls, setUrls] = useState<string[]>([])
  const [surpriseLoading, setSurpriseLoading] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)

  const handleSurprise = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: router.locale // router.locale : 'zh' | 'en'
      })
    }

    try {
      setSurpriseLoading(true)
      const response = await fetch('/api/dall/surprise', options)
      const data = await response.json()
      setSurpriseLoading(false)
      if (inputRef.current) inputRef.current.value = data.text
      if (textareaRef.current) textareaRef.current.value = data.text
    } catch (e) {
      setSurpriseLoading(false)
      console.error(e)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const value = window.innerWidth >=768 ? inputRef.current?.value : textareaRef.current?.value
    if (value === '') {
      await handleSurprise()
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: window.innerWidth >=768 ? inputRef.current?.value : textareaRef.current?.value,
      })
    }
    try {
      setGenerateLoading(true)
      const response = await fetch('/api/dall/createImage', options)
      const data = await response.json()
      setUrls(prevState => [...prevState, data.url])
      setGenerateLoading(false)
    } catch (e) {
      console.log('create image error', e)
      setGenerateLoading(false)
    }

    // clear input
    if (inputRef.current) inputRef.current.value = ''
    if (textareaRef.current) textareaRef.current.value = ''
  }

  return (
    <div
      className={clsx(
        'lg:px-32 px-8 py-4 max-sm:px-4',
      )}
    >
      {/* text */}
      <div className={'flex items-center gap-2 mt-36 mb-4'}>
        <p className={'text-gray-600 text-sm font-light dark:text-[#aaa]'}>
          {t('dallPage.description')}
        </p>
        <button
          type={'button'}
          disabled={generateLoading || surpriseLoading}
          className={clsx(
            'text-sm border px-2 py-1 rounded-lg cursor-pointer flex gap-2 items-center',
            'bg-gray-200 font-medium disabled:cursor-not-allowed hover:opacity-80 hover-transition-change',
            'dark:bg-neutral-900 dark:border dark:border-gray-500 dark:hover:opacity-80'
          )}
          onClick={handleSurprise}
        >
          {!surpriseLoading && t('dallPage.surprise')}
          {surpriseLoading && t('dallPage.surprising')}
          {surpriseLoading && <LoadingDots/>}
        </button>
      </div>

      {/* input */}
      <form
        onSubmit={handleSubmit}
        className={'flex max-md:flex-col mb-20'}
      >
        {/* md: */}
        <input
          ref={inputRef}
          placeholder={t('dallPage.placeholder')}
          className={clsx(
            'md:block max-md:hidden',
            'w-full h-10 py-2 px-4 rounded-l-md shadow-sm focus:outline-none',
            'focus:shadow-lg focus:transition-shadow focus:duration-500 focus:delay-100 focus:ease-in-out',
          )}
        />
        {/* max-md: */}
        <textarea
          ref={textareaRef}
          placeholder={t('dallPage.placeholder')}
          wrap={'off'}
          className={clsx(
            'md:hidden max-md:block overflow-y-auto custom-message-light-scrollbar',
            'w-full h-40 py-2 px-4 resize-none rounded-t-md shadow-sm focus:outline-none',
            'focus:shadow-lg focus:transition-shadow focus:duration-500 focus:delay-100 focus:ease-in-out',
          )}
        />
        <button
          type={'submit'}
          disabled={surpriseLoading || generateLoading}
          className={clsx(
            'min-w-fit h-10 md:rounded-r-md flex gap-2 items-center disabled:cursor-not-allowed',
            'bg-gray-50 text-gray-500 hover:opacity-80 hover-transition-change',
            'border p-2 dark:border-gray-500 dark:bg-neutral-900 dark:text-white',
            'max-md:rounded-b-md max-md:w-full max-md:bg-white',
          )}
        >
          {!generateLoading && t('dallPage.generate')}
          {generateLoading && t('dallPage.generating')}
          {generateLoading && <LoadingDots/>}
        </button>
      </form>

      <ShowImages urls={urls}/>
    </div>
  )
}
