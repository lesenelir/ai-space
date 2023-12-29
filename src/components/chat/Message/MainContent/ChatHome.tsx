import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import type { Message } from 'ai/react'
import { Toaster, toast } from 'sonner'
import { useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'next-i18next'
import { encodingForModel } from 'js-tiktoken'
import { type FormEvent, useRef, useState } from 'react'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import CheckIcon from '@/components/icons/CheckIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import SpeedIcon from '@/components/icons/SpeedIcon'
import useGetChatInformation from '@/hooks/useGetChatInformation'
import MarkdownRender from '@/components/chat/Message/MainContent/MarkdownRender'
import { Gemini, GPT3, GPT4 } from '@/components/chat/Message/HeaderContent/OptionData'
import { isUserSaveOpenAIKeyAtom, modelsAtom, selectedModelIdAtom, userOpenAIKeyAtom } from '@/atoms'

interface IProps {
  messages: Message[]
}

export default function ChatHome(props: IProps) {
  const { messages } = props
  const { t } = useTranslation('common')
  const { user } = useUser()
  const router = useRouter()
  const [isUserSaveOpenAIKey, setIsUserSaveOpenAIKey] = useAtom(isUserSaveOpenAIKeyAtom)
  const [userOpenAIKey, setUserOpenAIKey] = useAtom(userOpenAIKeyAtom)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const models = useAtomValue(modelsAtom)
  const { modelName } = useGetChatInformation(router.query.id ? router.query.id as string : '', selectedModelId)
  const [copy, setCopy] = useState<{[key: string]: boolean}>({}) // key: message id, value: boolean

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

  const renderModelIcon = (id: number) => {
    switch (id) {
      case 1:
        return <GPT3 width={22} height={22} className={'rounded-full'} />
      case 2:
        return <GPT4 width={22} height={22} className={'rounded-full'} />
      case 3:
        return <Gemini width={22} height={22} className={'rounded-full'} />
      default:
        return null
    }
  }

  const handleCopyClick = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {})
    setCopy(prev => ({...prev, [id]: true}))
    setTimeout(() => {
      setCopy(prev => ({...prev, [id]: false}))
    }, 1500)
  }

  const computeTokensInFrontEnd = (content: string) => {
    const enc = encodingForModel(modelName as 'gpt-3.5-turbo' | 'gpt-4-1106-preview')
    return enc.encode(content).length
  }

  const getName = () => {
    return models.find(model => model.id === selectedModelId)?.modelName
  }

  return (
    <>
      <div>
        {
          messages.map(m => (
            <div key={m.id} className={'group'}>
              <div
                ref={endOfMessagesRef}
                className={`
                  flex flex-col gap-3 p-2 rounded-lg 
                  bg-gray-200/90 dark:bg-chatpage-message-robot-content-dark
                  text-[#374151] dark:text-chatpage-message-text-dark 
                `}
              >
                {/* avatar + name */}
                <div className={'flex gap-2'}>
                  {
                    m.role === 'user' ? (
                      <Image
                        width={30}
                        height={30}
                        src={user?.imageUrl || '/user.svg'}
                        alt='avatar'
                        className={'rounded-full'}
                      />
                    ) : (
                      renderModelIcon(selectedModelId || 1)
                    )
                  }
                  <p className={'flex items-center font-semibold text-gray-900/90 dark:text-white'}>
                    {
                      m.role === 'user' ? 'You' : getName()
                    }
                  </p>
                </div>
                {/* content */}
                <article
                  className={'prose dark:prose-invert break-words whitespace-pre-wrap overflow-x-auto custom-message-light-scrollbar'}>
                  <MarkdownRender markdown={m.content}/>
                </article>
              </div>

              {/* Footer content */}
              <div className={'mb-5 mt-1 w-full h-[16px]'}>
                <div className={'hidden group-hover:flex gap-1'}>
                  {copy[m.id] ? (
                    <CheckIcon width={16} height={16} className={'text-green-600 p-1'}/>
                  ) : (
                    <CopyIcon
                      width={16}
                      height={16}
                      className={'rounded-md p-1 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}
                      onClick={() => handleCopyClick(m.content, String(m.id))}
                    />
                  )}

                  <div className={'flex gap-1 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-chatpage-message-robot-content-dark'}>
                    <SpeedIcon width={16} height={16}/>
                    <span className={'text-xs'}>{computeTokensInFrontEnd(m.content)} tokens</span>
                  </div>

                </div>
              </div>
            </div>
          ))
        }
      </div>

      {
        messages.length === 0 && (
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
        )
      }
    </>
  )
}
