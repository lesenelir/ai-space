import HeaderContent from '@/components/chat/Message/HeaderContent'
import MainContent from '@/components/chat/Message/MainContent'
import FooterContent from '@/components/chat/Message/FooterContent'
import { useTranslation } from 'next-i18next'

export default function Message() {
  const { t } = useTranslation('common')

  return (
    <div className={'flex-1 flex flex-col bg-gray-50 dark:bg-chatpage-message-background-dark'}>
      <p>{t('title')}</p>
      <HeaderContent/>
      <MainContent/>
      <FooterContent/>
    </div>
  )
}
