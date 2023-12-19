import { type FormEvent, useRef } from 'react'
import { useTranslation } from 'next-i18next'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ChatHome() {
  const {t} = useTranslation('common')
  const ref = useRef<HTMLInputElement>(null)

  // Todo: save openai key to db
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(ref.current?.value)
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
          className={'p-2 font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground0'}
        >
          Save
        </Button>
      </form>
    </>
  )
}
