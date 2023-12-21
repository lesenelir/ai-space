import { useAtom } from 'jotai'
import { type FormEvent } from 'react'
import { Toaster, toast } from 'sonner'
import { useTranslation } from 'next-i18next'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { isUserSaveOpenAIKeyAtom, userOpenAIKeyAtom } from '@/atoms'

export default function ChatHome() {
  const {t} = useTranslation('common')
  const [isUserSaveOpenAIKey, setIsUserSaveOpenAIKey] = useAtom(isUserSaveOpenAIKeyAtom)
  const [userOpenAIKey, setUserOpenAIKey] = useAtom(userOpenAIKeyAtom)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({openAIKey: userOpenAIKey}),
    }

    try {
      await fetch('/api/chat/saveOpenAIKey', options)
      setIsUserSaveOpenAIKey(true)
      toast.success('Saved successfully')
    } catch (e) {
      console.log('save openai key error: ', e)
    }
  }


  return (
    <>
      <div className={'flex justify-center'}>
        <h1 className={'text-xl'}>AI Space Chat App</h1>
      </div>
      <Toaster richColors position={'top-center'}  />
      {
        !isUserSaveOpenAIKey && (
          <form className={'w-full mt-8 flex gap-2'} onSubmit={handleSubmit}>
            <Input
              value={userOpenAIKey}
              onChange={(e) => setUserOpenAIKey(e.target.value)}
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
        )
      }
    </>
  )
}
