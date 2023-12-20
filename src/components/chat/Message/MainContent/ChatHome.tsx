import { type FormEvent, useRef } from 'react'
import { useTranslation } from 'next-i18next'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ChatHome() {
  const {t} = useTranslation('common')
  const ref = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (ref.current) {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({openAIKey: ref.current?.value}),
      }

      try {
        await fetch('/api/chat/saveOpenAIKey', options)
        ref.current.value = ''
      } catch (e) {
        console.log('save openai key error: ', e)
      }
    }
  }

  return (
    <>
      <div className={'flex justify-center'}>
        <h1 className={'text-xl'}>AI Space Chat App</h1>
      </div>

      <form className={'w-full mt-8 flex gap-2'} onSubmit={handleSubmit}>
        <Input
          ref={ref}
          required={true}
          type={'password'}
          className={'w-full dark:bg-chatpage-message-background-dark focus:outline-none focus:ring-1 focus:border-transparent'}
          placeholder={`${t('chatPage.message.openaiKey')}`}
        />
        <Button
          type={'submit'}
          className={'p-2 font-normal border border-input hover:bg-gray-200/80 dark:hover:bg-gray-500/10 hover-transition-change'}
        >
          {t('chatPage.message.save')}
        </Button>
      </form>
    </>
  )
}
