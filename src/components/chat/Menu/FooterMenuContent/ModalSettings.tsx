import { type FormEvent } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import XIcon from '@/components/icons/XIcon'
import Input from '@/components/ui/Input'

interface IProps {
  setIsModalOpen: (isModalOpen: boolean) => void
}

export default function ModalSettings(props: IProps) {
  const {setIsModalOpen} = props
  const {t} = useTranslation('common')
  const router = useRouter()

  const handlerSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Todo: Save API Key')
  }

  return (
    <div className={'w-full h-full flex flex-col text-white overflow-y-auto custom-scrollbar'}>
      {/* header */}
      <div className={'h-1/6 p-4 flex flex-row justify-between rounded-t-md bg-chatpage-menu-hover'}>
        <p className={'font-medium text-2xl'}>{t('chatPage.menu.settings')}</p>
        <XIcon
          width={24}
          height={24}
          className={'h-1/4 cursor-pointer text-gray-200/70 hover:text-gray-200 transition-change'}
          onClick={() => setIsModalOpen(false)}
        />
      </div>

      {/* Main */}
      <div className={'flex-1 p-4 flex flex-row overflow-y-auto custom-scrollbar'}>
        <div className={'w-2/3'}>
          <form onSubmit={handlerSave}>
            <label className={''} htmlFor="openai">
              <span className={'text-sm'}>{t('chatPage.menu.openAPIKey')}：</span>
              <Input id={'openai'} type={'password'} className={'h-6 text-gray-900'}/>
            </label>
            <label className={''} htmlFor="baidu">
              <span className={'text-sm'}>{t('chatPage.menu.baiduAPIKey')}：</span>
              <Input id={'baidu'} type={'password'} className={'h-6 text-gray-900'}/>
            </label>
            <button type={'submit'} className={'mt-2 p-1 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 transition-change'}>
              {t('chatPage.menu.saveAll')}
            </button>
          </form>
        </div>

        <div className={'w-[1px] h-full bg-gray-300'}></div>

        <div className={'w-1/3 flex flex-col items-end gap-4'}>
          <button className={'w-4/5 p-1 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 transition-change'}>
            {t('chatPage.menu.importData')}
          </button>
          <button className={'w-4/5 p-1 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 transition-change'}>
            {t('chatPage.menu.exportData')}
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className={'h-1/6 flex justify-center items-center p-2 text-sm rounded-b-md bg-chatpage-menu-hover'}>
        <p>
          {t('chatPage.menu.footer')} {' '}
          <span className={'underline cursor-pointer'} onClick={() => router.push('/#research')}>
            {t('chatPage.menu.footerLink')}
          </span>
        </p>
      </div>
    </div>
  )
}
