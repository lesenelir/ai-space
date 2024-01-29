import clsx from 'clsx'

import CommonMessageHeader from '@/components/common/commonMessageHeader'

export default function SummarizeMessage() {

  return (
    <div
      className={clsx(
        'flex-1 w-full flex flex-col bg-gray-50',
        'dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'
      )}
    >
      <CommonMessageHeader/>
      <div className={'p-3'}>
        SummarizeMessage
      </div>
    </div>
  )
}
