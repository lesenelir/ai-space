import { useTranslation } from 'next-i18next'
import { type ChangeEvent, type FormEvent, type KeyboardEvent, useRef } from 'react'

import Tooltip from '@/components/ui/Tooltip'
import TextArea from '@/components/ui/TextArea'
import ArrowNarrowUpIcon from '@/components/icons/ArrowNarrowUpIcon'

interface IProps {
  input: string
  handleInputChange: (e: (ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>)) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export default function FooterContent(props: IProps) {
  const ref = useRef<HTMLTextAreaElement>(null) // change textarea height
  const { t } = useTranslation('common')
  const { input, handleInputChange, handleSubmit } = props
  const maxHeight = 200

  const handleFormSubmit = (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()

    if (ref.current) {
      ref.current.value = '' // sync textValue [Must Important!]
      ref.current.style.height = 'auto' // reset height
    }

    handleSubmit(e as any) // call useChat hook
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !input) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFormSubmit(e)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
    handleInputChange(e) // call useChat hook
  }

  return (
    <div className={'w-full flex justify-center items-center p-3'}>
      <form onSubmit={handleFormSubmit} className={'relative max-lg:w-full'}>
        <TextArea
          ref={ref}
          required={true}
          value={input}
          placeholder={t('chatPage.message.textAreaPlaceholder')}
          className={`
            lg:w-[640px] lg:-ml-6 resize-none rounded-xl drop-shadow custom-message-light-scrollbar
            dark:bg-chatpage-message-background-dark 
          `}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <Tooltip title={t('chatPage.message.send')}>
          <button
            type={'submit'}
            disabled={!input}
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
        </Tooltip>
      </form>
    </div>
  )
}
