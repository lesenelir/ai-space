import type { Message } from 'ai/react'
import { Toaster, toast } from 'sonner'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { type FormEvent, useRef} from 'react'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { isUserSaveOpenAIKeyAtom, userOpenAIKeyAtom } from '@/atoms'
import DataItem from '@/components/chat/Message/MainContent/DataItem'

interface IProps {
  messages: Message[]
  speakingId: number | null
  startSpeaking: (id: number, content: string, rate: number) => void
  stopSpeaking: () => void
}

export default function ChatHome(props: IProps) {
  const { messages, speakingId, startSpeaking, stopSpeaking } = props
  const { t } = useTranslation('common')
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const [userOpenAIKey, setUserOpenAIKey] = useAtom(userOpenAIKeyAtom)
  const [isUserSaveOpenAIKey, setIsUserSaveOpenAIKey] = useAtom(isUserSaveOpenAIKeyAtom)

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
      <div>
        {messages.map(m => (
          <DataItem
            key={m.id}
            ref={endOfMessagesRef}
            data={{
              id: Number(m.id),
              role: m.role,
              content: m.content
            }}
            speakingId={speakingId}
            startSpeaking={startSpeaking}
            stopSpeaking={stopSpeaking}
          />
        ))}
      </div>

      {messages.length === 0 && (
        <>
          <div className={'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}>
            <div className={'flex justify-center'}>
              <h1 className={'text-xl'}>AI Space Chat App</h1>
            </div>
            <Toaster richColors position={'top-center'}/>
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
          </div>
        </>
      )}
    </>
  )
}
