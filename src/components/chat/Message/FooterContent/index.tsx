import { type KeyboardEvent, useRef } from 'react'

import TextArea from '@/components/ui/TextArea'
import SendIcon from '@/components/icons/SendIcon'

export default function FooterContent() {
  const ref = useRef<HTMLTextAreaElement>(null)
  const maxHeight = 200

  const handleSubmit = () => {
    if (ref.current) {
      const message = ref.current.value
      console.log('message', message)
      ref.current.value = ''
      ref.current.style.height = 'auto' // reset height
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handlerChange = (e: any) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
  }

  return (
    <div className={'w-full flex justify-center items-center p-3'}>
      <TextArea
        ref={ref}
        placeholder={'Type a message ...'}
        className={'lg:w-[640px] -ml-6 resize-none rounded-xl drop-shadow'}
        onChange={handlerChange}
        onKeyDown={handleKeyDown}
      />

      <SendIcon
        width={24}
        height={24}
        className={'cursor-pointer drop-shadow text-gray-600 hover:opacity-50 transition-change -ml-12'}
        onClick={handleSubmit}
      />
    </div>
  )
}
