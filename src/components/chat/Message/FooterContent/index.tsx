import { useTranslation } from 'next-i18next'
import { type ChangeEvent, FormEvent, type KeyboardEvent, useRef, useState } from 'react'

import TextArea from '@/components/ui/TextArea'
import ArrowNarrowUpIcon from '@/components/icons/ArrowNarrowUpIcon'

export default function FooterContent() {
  const [textValue, setTextValue] = useState<string>('')
  const ref = useRef<HTMLTextAreaElement>(null) // change textarea height
  const { t } = useTranslation('common')
  const maxHeight = 200

  const handleSubmit = (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()

    // Todo: send message to server
    console.log('textValue', textValue)
    setTextValue('')

    if (ref.current) {
      ref.current.value = '' // sync textValue [Must Important!]
      ref.current.style.height = 'auto' // reset height
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !textValue) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    setTextValue(textarea.value)
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
  }

  return (
    <div className={'w-full flex justify-center items-center p-3'}>
      <form onSubmit={handleSubmit} className={'relative max-lg:w-full'}>
        <TextArea
          ref={ref}
          required={true}
          value={textValue}
          placeholder={t('chatPage.message.textAreaPlaceholder')}
          className={`
            lg:w-[640px] lg:-ml-6 resize-none rounded-xl drop-shadow custom-message-light-scrollbar
            dark:bg-chatpage-message-background-dark 
          `}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button
          type={'submit'}
          disabled={!textValue}
          className={`
            absolute bottom-4 right-4 border rounded-lg p-1 
            hover:bg-gray-200/80 hover-transition-change dark:hover:bg-gray-500/10
            disabled:opacity-50 disabled:cursor-not-allowed 
          `}
        >
          <ArrowNarrowUpIcon
            width={20}
            height={20}
            className={'dark:text-gray-50/80 dark:text-gray-100'}
          />
        </button>
      </form>
    </div>
  )
}
