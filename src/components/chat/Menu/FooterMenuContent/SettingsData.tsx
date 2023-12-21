import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { useAtom, useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { type ChangeEvent, type FormEvent, useEffect, useRef } from 'react'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PuzzleIcon from '@/components/icons/PuzzleIcon'
import SettingsBoltIcon from '@/components/icons/SettingsBoltIcon'
import { isUserSaveGeminiKeyAtom, isUserSaveOpenAIKeyAtom, userGeminiKeyAtom, userOpenAIKeyAtom } from '@/atoms'

export const GeneralTab = () => {
  const {t} = useTranslation('common')

  return (
    <div className={'flex gap-1 items-center'}>
      <SettingsBoltIcon width={20} height={20}/>
      {t('chatPage.menu.general')}
    </div>
  )
}

export const ModelTab = () => {
  const { t } = useTranslation('common')

  return (
    <div className={'flex gap-1 items-center'}>
      <PuzzleIcon width={20} height={20}/>
      {t('chatPage.menu.model')}
    </div>
  )
}

// -------------------------------------------------------------------

export const GeneralContent = () => {
  const { setTheme } = useTheme()
  const router = useRouter()
  const currentLocale = router.locale
  const currentThemeRef = useRef<string>('system')
  const { t } = useTranslation('common')

  const handleLanguageChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    if (e.target.value !== currentLocale) {
      await router.push(router.pathname, router.asPath, { locale: newLocale })
    }
  }

  const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value)
    currentThemeRef.current = e.target.value
  }

  useEffect(() => {
    currentThemeRef.current = localStorage.getItem('theme') || 'system'
  }, [])

  return (
    <div className={'flex flex-col gap-8'}>
      {/* header */}
      <div className={'flex flex-col gap-8'}>
        <div className={'flex gap-4 items-center'}>
          <p className={'w-28'}>{t('chatPage.menu.language')} {' '}:</p>
          <select
            value={currentLocale}
            onChange={handleLanguageChange}
            className={'bg-chatpage-message-background-dark cursor-pointer rounded-lg p-2 px-6 focus:outline-none '}
          >
            <option value="zh">{t('chatPage.menu.zh')}</option>
            <option value="en">{t('chatPage.menu.en')}</option>
          </select>
        </div>
        <div className={'flex gap-4 items-center'}>
          <p className={'w-28'}>{t('chatPage.menu.theme')} {' '}:</p>
          <select
            value={currentThemeRef.current}
            onChange={handleThemeChange}
            className={'bg-chatpage-message-background-dark cursor-pointer rounded-lg p-2 px-6'}
          >
            <option value="system">{t('chatPage.menu.system')}</option>
            <option value="light">{t('chatPage.menu.light')}</option>
            <option value="dark">{t('chatPage.menu.dark')}</option>
          </select>
        </div>
      </div>

      <div className={'border-b border-gray-500'}/>

      {/* import and export content */}
      <div className={'flex flex-col gap-4'}>
        <div className={'flex gap-4 items-center'}>
          <span>{t('chatPage.menu.importTitle')} {' '}:</span>
          <span className={'text-sm'}>{' '} {t('chatPage.menu.importContent')}</span>
        </div>

        <div className={'flex gap-4'}>
          <button
            disabled={true}
            className={`
              border border-gray-500 rounded-md p-1 text-sm disabled:cursor-not-allowed 
              bg-chatpage-message-background-dark !disabled:hover:bg-gray-500/10 transition-change
            `}
          >
            {t('chatPage.menu.importData')}
          </button>
          <button
            disabled={true}
            className={`
              border border-gray-500 rounded-md p-1 text-sm disabled:cursor-not-allowed 
              bg-chatpage-message-background-dark !disabled:hover:bg-gray-500/10 transition-change
            `}
          >
            {t('chatPage.menu.exportData')}
          </button>
        </div>
      </div>
    </div>
  )
}

export const ModelContent = () => {
  const {t} = useTranslation('common')
  const [userOpenAIKey, setUserOpenAIKey] = useAtom(userOpenAIKeyAtom)
  const [userGeminiKey, setUserGeminiKey] = useAtom(userGeminiKeyAtom)
  const setIsUserSaveOpenAIKey = useSetAtom(isUserSaveOpenAIKeyAtom)
  const setIsUserSaveGeminiKey =  useSetAtom(isUserSaveGeminiKeyAtom)

  const handleSaveOpenAIKey = async (e: FormEvent<HTMLFormElement>) => {
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
      toast.success('Saved OpenAI API Key successfully')
    } catch (e) {
      toast.error('Saved OpenAI API Key Unsuccessfully')
      console.log('save openai key error: ', e)
    }
  }

  const handleSaveGeminiKey = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({googleGeminiKey: userGeminiKey}),
    }

    try {
      await fetch('/api/chat/saveGeminiKey', options)
      setIsUserSaveGeminiKey(true)
      toast.success('Saved Gemini API Key successfully')
    } catch (e) {
      toast.error('Saved Gemini API Key Unsuccessfully')
      console.log('save gemini key error: ', e)
    }
  }

  return (
    <>
      <Toaster richColors position={'top-center'}/>
      <div className={'flex flex-col gap-8'}>
        <form onSubmit={handleSaveOpenAIKey} className={'flex flex-col gap-8'}>
          <label htmlFor={'openai'}>
            <p className={'text-sm mb-2'}>{t('chatPage.menu.openAPIKey')}{' '}:</p>
            <div className={'flex items-center gap-4'}>
              <Input
                type="password"
                id={'openai'}
                required={true}
                value={userOpenAIKey}
                onChange={(e) => setUserOpenAIKey(e.target.value)}
                className={'h-8 text-gray-900 dark:text-gray-50'}
              />
              <Button
                type={'submit'}
                className={'p-1.5 text-sm border border-gray-500 hover:bg-chatpage-message-background-dark hover-transition-change'}
              >
                {t('chatPage.message.save')}
              </Button>
            </div>
          </label>
        </form>

        <div className={'border-b border-gray-500'}/>

        <form onSubmit={handleSaveGeminiKey} className={'flex flex-col gap-8'}>
          <label htmlFor="google">
            <p className={'text-sm mb-2'}>{t('chatPage.menu.geminiAPIKey')}{' '}:</p>
            <div className={'flex items-center gap-4'}>
              <Input
                type="password"
                id={'google'}
                required={true}
                value={userGeminiKey}
                onChange={(e) => setUserGeminiKey(e.target.value)}
                className={'h-8 text-gray-900 dark:text-gray-50'}
              />
              <Button
                type={'submit'}
                className={'p-1.5 text-sm border border-gray-500 hover:bg-chatpage-message-background-dark hover-transition-change'}
              >
                {t('chatPage.message.save')}
              </Button>
            </div>
          </label>
        </form>
      </div>
    </>
  )
}
