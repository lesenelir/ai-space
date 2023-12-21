import { type FormEvent } from 'react'
import { useTranslation } from 'next-i18next'

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
  const { t } = useTranslation('common')

  return (
    <div className={'flex flex-col gap-8'}>
      {/* header */}
      <div className={'flex flex-col gap-8'}>
        <div className={'flex gap-4 items-center'}>
          <p className={'w-28'}>{t('chatPage.menu.language')} {' '}:</p>
          <select className={'bg-chatpage-message-background-dark cursor-pointer rounded-lg p-2 px-6'}>
            <option value="s">{t('chatPage.menu.zh')}</option>
            <option value="s">{t('chatPage.menu.en')}</option>
          </select>
        </div>
        <div className={'flex gap-4 items-center'}>
          <p className={'w-28'}>{t('chatPage.menu.theme')} {' '}:</p>
          <select className={'bg-chatpage-message-background-dark cursor-pointer rounded-lg p-2 px-6'}>
            <option value="s">{t('chatPage.menu.system')}</option>
            <option value="s">{t('chatPage.menu.light')}</option>
            <option value="s">{t('chatPage.menu.dark')}</option>
          </select>
        </div>
      </div>

      <div className={'border-b border-gray-500'}/>

      {/* asd */}
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
