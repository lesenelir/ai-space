import clsx from 'clsx'
import { format } from 'date-fns'
import { useTheme } from 'next-themes'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/router'
import { useAtom, useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef
} from 'react'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Slider from '@/components/ui/Slider'
import LeafIcon from '@/components/icons/LeafIcon'
import PuzzleIcon from '@/components/icons/PuzzleIcon'
import SettingsBoltIcon from '@/components/icons/SettingsBoltIcon'
import {
  chatItemsAtom,
  isUserSaveGeminiKeyAtom,
  isUserSaveOpenAIKeyAtom,
  maxHistorySizeAtom,
  maxTokensAtom,
  temperatureAtom,
  userGeminiKeyAtom,
  userOpenAIKeyAtom
} from '@/atoms'

export const GeneralTab = () => {
  const { t } = useTranslation('common')

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

export const ChatSettingsTab = () => {
  const { t } = useTranslation('common')

  return (
    <div className={'flex gap-1 items-center'}>
      <LeafIcon width={20} height={20} />
      {t('chatPage.menu.chat')}
    </div>
  )
}

// -------------------------------------------------------------------

export const GeneralContent = () => {
  const { setTheme } = useTheme()
  const { t } = useTranslation('common')
  const router = useRouter()
  const currentLocale = router.locale
  const currentThemeRef = useRef<string>('system')
  const setChatItems = useSetAtom(chatItemsAtom)
  const hiddenImportDataRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    currentThemeRef.current = localStorage.getItem('theme') || 'system'
  }, [])

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

  const handleExportData = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    toast.loading('Exporting...')
    try {
      const response = await fetch('/api/chat/exportData', options)
      const data = await response.json()
      const dataStr = JSON.stringify(data.chatItemWithMessages, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `AI-Space-Chat-Data-${format(new Date(), 'yyyy-MM-dd')}.json`
      a.click()
      toast.success('Exported!')
    } catch (e) {
      toast.error('UnExported!')
    }
  }

  const handleImportDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const reader = new FileReader()
    toast.loading('Importing...')

    reader.onload = async (e) => {
      const fileContent = e.target?.result
      const jsonData = JSON.parse(fileContent as string)

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({jsonData})
      }

      try {
        const response = await fetch('/api/chat/importData', options)
        if (!response.ok && response.status === 408) {
          toast.error('Invalid File!')
          return
        }
        const data = await response.json()
        setChatItems(data?.chatItems)
        toast.success('Imported!')
      } catch (e) {
        toast.error('UnImported!')
      }
    }

    reader.readAsText(file)
  }

  const exportImportClass = useMemo(() => (
    clsx(
      'border border-gray-500 rounded-md p-1 text-sm cursor-pointer disabled:cursor-not-allowed',
      'bg-gray-500/10 hover:bg-chatpage-message-background-dark transition-change',
    )
  ), [])

  return (
    <>
      <Toaster richColors position={'top-center'}/>
      <div className={'flex flex-col gap-8'}>
        {/* header */}
        <div className={'flex flex-col gap-8'}>
          <div className={'flex gap-4 items-center'}>
            <p className={'w-28'}>{t('chatPage.menu.language')} {' '}:</p>
            <select
              value={currentLocale}
              onChange={handleLanguageChange}
              className={'bg-chatpage-message-background-dark cursor-pointer rounded-lg py-2 px-6'}
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
              className={'bg-chatpage-message-background-dark cursor-pointer rounded-lg py-2 px-6'}
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
            <span
              className={clsx(exportImportClass, 'relative')}
              onClick={() => hiddenImportDataRef.current?.click()}
            >
              {t('chatPage.menu.importData')}
              <input
                type='file'
                ref={hiddenImportDataRef}
                accept={'application/json'}
                className={'absolute -z-10 left-0 top-0 w-full h-full opacity-0'}
                onChange={handleImportDataChange}
              />
            </span>
            <button onClick={handleExportData} className={exportImportClass}>
              {t('chatPage.menu.exportData')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export const ModelContent = () => {
  const { t } = useTranslation('common')
  const [userOpenAIKey, setUserOpenAIKey] = useAtom(userOpenAIKeyAtom)
  const [userGeminiKey, setUserGeminiKey] = useAtom(userGeminiKeyAtom)
  const setIsUserSaveOpenAIKey = useSetAtom(isUserSaveOpenAIKeyAtom)
  const setIsUserSaveGeminiKey = useSetAtom(isUserSaveGeminiKeyAtom)

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


export const ChatSettingsContent = () => {
  const { t } = useTranslation('common')
  const [maxTokens, setMaxTokens] = useAtom(maxTokensAtom)
  const [temperature, setTemperature] = useAtom(temperatureAtom)
  const [maxHistorySize, setMaxHistorySize] = useAtom(maxHistorySizeAtom)

  return (
    <div className={'flex flex-col gap-8'}>
      {/* 1. max tokens */}
      <div className={'flex flex-col gap-2'}>
        {/* words */}
        <div>
          <p>{t('chatPage.menu.tokensTitle')}</p>
          <p className={'text-sm'}>
            {t('chatPage.menu.tokensP1')} {t('chatPage.menu.tokensP2')}
          </p>
        </div>

        <Input
          type={'number'}
          step={'1'}
          min={'1'}
          max={'4086'}
          value={maxTokens}
          onChange={(e) => setMaxTokens(Number(e.target.value))}
          required={true}
          className={'h-8 text-gray-900 dark:text-gray-50'}
        />
      </div>

      {/* 2. Max history messages size  */}
      <div className={'flex flex-col gap-2'}>
        {/* words */}
        <div className={'flex gap-2'}>
          <p className={'h-7'}>{t('chatPage.menu.historyMaxTitle')} {' '}</p>
          <input
            type="number"
            step={'1'}
            min={'1'}
            max={'24'}
            value={maxHistorySize}
            onChange={(e) => setMaxHistorySize(Number(e.target.value))}
            required={true}
            className={'w-20 h-6 p-3 bg-transparent text-gray-50 rounded-md hover:border focus:border focus:outline-none'}
          />
        </div>

        <Slider
          min={1}
          max={24}
          step={1}
          value={maxHistorySize}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxHistorySize(Number(e.target.value))}
          className={'w-2/3'}
        />

        {/* explanation */}
        <p className={'text-sm'}>
          {t('chatPage.menu.historyMaxContent')}
        </p>
      </div>

      {/* 3. Temperature */}
      <div className={'flex flex-col gap-2'}>
        {/* Words */}
        <div className={'flex flex-col gap-2'}>
          {/*<p>{t('chatPage.menu.temperature')} {' '} {temperature} </p>*/}
          <div className={'flex gap-2'}>
            <p className={'h-7'}>{t('chatPage.menu.temperature')} {' '}</p>
            <input
              type="number"
              min={'0'}
              max={'1'}
              step={'0.1'}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              required={true}
              className={'w-20 h-6 p-3 bg-transparent text-gray-50 rounded-md hover:border focus:border focus:outline-none'}
            />
          </div>
          <div className={'flex justify-between text-xs w-2/3'}>
            <span>{t('chatPage.menu.precise')}</span>
            <span>{t('chatPage.menu.balanced')}</span>
            <span>{t('chatPage.menu.creative')}</span>
          </div>
        </div>

        <Slider
          min={0}
          max={1}
          step={0.1}
          value={temperature}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTemperature(Number(e.target.value))}
          className={'w-2/3'}
        />

        {/* explanation */}
        <p className={'text-sm'}>
          {t('chatPage.menu.temperatureContent')}
        </p>
      </div>
    </div>
  )
}
