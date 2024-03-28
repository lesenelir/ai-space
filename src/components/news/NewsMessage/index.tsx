import CommonMessageHeader from '@/components/common/commonMessageHeader'

export default function NewsMessage() {
  return (
    <div className={'flex-1 flex flex-col bg-gray-50 dark:bg-chatpage-message-background-dark'}>
      <CommonMessageHeader/>
    </div>
  )
}
