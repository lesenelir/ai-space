import { useTranslation } from 'next-i18next'

import TrashIcon from '@/components/icons/TrashIcon'

interface IProps {
  onDelete: () => void
}

export default function IgnoreLine(props: IProps) {
  const { onDelete } = props
  const { t } = useTranslation('common')

  return (
    <div className={'w-full h-[1rem] flex items-center gap-1 mb-4 -mt-4 group/ignore'}>
      <div className={'flex-grow h-[1px] bg-gray-200 dark:bg-chatpage-message-robot-content-dark'}/>
      <div className={'text-xs text-gray-400 dark:text-gray-500'}>
        <span className={'group-hover/ignore:hidden'}>{t('chatPage.message.ignoreMessagesContent')}</span>
        <span
          className={'hidden group-hover/ignore:inline-flex items-center gap-1 text-rose-600 cursor-pointer dark:text-red-500'}
          onClick={onDelete}
        >
          <TrashIcon width={12} height={12}/>
          {t('chatPage.message.deleteMessagesContent')}
        </span>
      </div>
      <div className={'flex-grow h-[1px] bg-gray-200 dark:bg-chatpage-message-robot-content-dark'}/>
    </div>
  )
}
