import { type KeyboardEvent, useRef } from 'react'

import TextArea from '@/components/ui/TextArea'
import SendIcon from '@/components/icons/SendIcon'

export default function FooterContent() {
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (ref.current) {
      const message = ref.current.value
      console.log('message', message)
      ref.current.value = ''
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={'flex justify-center items-center p-3'}>
      <TextArea
        ref={ref}
        placeholder={'Type a message ...'}
        className={'lg:w-[640px]'}
        onKeyDown={handleKeyDown}
      />

      <SendIcon
        width={24}
        height={24}
        className={'cursor-pointer text-gray-600 hover:opacity-50 transition-change -ml-8'}
      />
    </div>
  )
}
