import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { useTranslation } from 'next-i18next'
import { type ChangeEvent, type FormEvent, useEffect, useRef } from 'react'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PuzzleIcon from '@/components/icons/PuzzleIcon'
import SettingsBoltIcon from '@/components/icons/SettingsBoltIcon'

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

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Todo: Save API Key', e.target)
    // TODO: save API Key
  }

  return (
    <>
      <form onSubmit={handleSave} className={'flex flex-col gap-8'}>
        <label htmlFor={'openai'}>
          <p className={'text-sm mb-2'}>{t('chatPage.menu.openAPIKey')}{' '}:</p>
          <Input
            type="password"
            id={'openai'}
            className={'h-8 text-gray-900 dark:text-gray-50'}
          />
        </label>

        <div className={'border-b border-gray-500'}/>

        <label htmlFor="google">
          <p className={'text-sm mb-2'}>{t('chatPage.menu.geminiAPIKey')}{' '}:</p>
          <Input
            type="password"
            id={'google'}
            className={'h-8 text-gray-900 dark:text-gray-50'}
          />
        </label>

        <div className={'border-b border-gray-500'}/>

        <Button
          type={'submit'}
          className={'p-2 font-normal border border-input hover:bg-gray-500/20 hover-transition-change'}
        >
          {t('chatPage.menu.saveAll')}
        </Button>
      </form>
    </>
  )
}
