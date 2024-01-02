import { useTranslation } from 'next-i18next'

import SeparatorIcon from '@/components/icons/SeparatorIcon'
import MessageClearIcon from '@/components/icons/MessageClearIcon'

export default function FooterMoreIconsData() {
  const { t } = useTranslation('common')

  return (
    <div>
      {/* ignore messages */}
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-gray-200/60
          dark:hover:bg-chatpage-message-robot-content-dark
        `}
      >
        <SeparatorIcon width={16} height={16}/>
        {t('chatPage.message.ignoreMessages')}
      </div>


      {/* clear messages */}
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg text-sm text-rose-600 hover:bg-gray-200/60
          dark:text-red-500  dark:hover:bg-chatpage-message-robot-content-dark
        `}
      >
        <MessageClearIcon width={16} height={16}/>
        {t('chatPage.message.deleteMessages')}
      </div>
    </div>
  )
}
