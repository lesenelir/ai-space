import { useTranslation } from 'next-i18next'

import SeparatorIcon from '@/components/icons/SeparatorIcon'
import MessageClearIcon from '@/components/icons/MessageClearIcon'

interface IProps {
  disabled: boolean
}

export default function FooterMoreIconsData(props: IProps) {
  const { disabled } = props
  const { t } = useTranslation('common')

  return (
    <div>
      {/* ignore messages */}
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-gray-200/60
          dark:hover:bg-chatpage-message-robot-content-dark
          ${disabled && 'opacity-40'}
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
          ${disabled && 'opacity-40'}
        `}
      >
        <MessageClearIcon width={16} height={16}/>
        {t('chatPage.message.deleteMessages')}
      </div>
    </div>
  )
}
