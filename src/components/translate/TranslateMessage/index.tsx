import clsx from 'clsx'

import CommonMessageHeader from '@/components/common/commonMessageHeader'

export default function TranslateMessage() {

  return (
    <div
      className={clsx(
        'flex-1 w-full flex flex-col bg-gray-50',
        'dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'
      )}
    >
      <CommonMessageHeader/>

      <div className={'w-full p-3 bg-violet-200'}>
        TranslateMessage
      </div>
    </div>
  )
}
