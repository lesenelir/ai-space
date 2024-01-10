import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import Tabs from '@/components/ui/Tabs'
import XIcon from '@/components/icons/XIcon'
import {
  GeneralTab,
  ModelTab,
  GeneralContent,
  ModelContent,
  ChatSettingsTab,
  ChatSettingsContent
} from '@/components/chat/Menu/FooterMenuContent/SettingsData'

interface IProps {
  setIsModalOpen: (isModalOpen: boolean) => void
}

const tabsData = [
  { key: 'tab1', title: <GeneralTab/>, content: <GeneralContent/> },
  { key: 'tab2', title: <ModelTab/>, content: <ModelContent/> },
  { key: 'tab3', title:  <ChatSettingsTab/>, content: <ChatSettingsContent/>}
]

export default function ModalSettings(props: IProps) {
  const { setIsModalOpen } = props
  const { t } = useTranslation('common')
  const router = useRouter()

  return (
    <div className={'w-full h-full flex flex-col text-white'}>
      {/* header */}
      <div className={'h-20 p-4 flex flex-row justify-between rounded-t-md bg-chatpage-menu-hover'}>
        <p className={'font-medium text-2xl'}>{t('chatPage.menu.settings')}</p>
        <XIcon
          width={24}
          height={24}
          className={'h-1/4 cursor-pointer text-gray-200/70 hover:text-gray-200 transition-change'}
          onClick={() => setIsModalOpen(false)}
        />
      </div>

      {/* Main */}
      <div className={'flex-1 p-4 overflow-y-auto custom-scrollbar'}>
        <Tabs tabs={tabsData}/>
      </div>

      {/* Footer */}
      <div className={'h-20 flex justify-center items-center p-2 text-sm rounded-b-md bg-chatpage-menu-hover'}>
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
