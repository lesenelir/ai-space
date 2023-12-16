import { useRef, useState } from 'react'

import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import MessageIcon from '@/components/icons/MessageIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import XIcon from '@/components/icons/XIcon'

interface IProps {
  text: string
}

export default function ChatItemCard(props: IProps) {
  const {text} = props
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [displayText, setDisplayText] = useState<string>(text)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCheckClick = () => {
    setIsEdit(false)
    if (inputRef.current) {
      setDisplayText(inputRef.current.value)
    }
  }

  const handleXClick = () => {
    setIsEdit(false)
  }

  const handleEditClick = () => {
    setIsEdit(true)
    setTimeout(() => { // focus on input
      if(inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  return (
    <div
      className={`
         w-full h-12 p-3 my-1 flex justify-between cursor-pointer rounded-md 
         hover:bg-chatpage-menu-hover hover-transition-change chat-item
      `}
    >
      {!isEdit && (
        <>
          {/* left */}
          <div className={'flex flex-row gap-2 overflow-hidden'}>
            <MessageIcon width={16} height={16} className={'flex items-center'}/>
            <p className={'truncate'}>{displayText}</p>
          </div>
          {/* right */}
          <div className={'flex flex-row gap-2 icon-hidden ml-4'}>
            <EditIcon
              width={16}
              height={16}
              className={'flex items-center hover:text-white hover-transition-change'}
              onClick={handleEditClick}
            />
            <TrashIcon
              width={16}
              height={16}
              className={'flex items-center hover:text-white hover-transition-change'}
            />
          </div>
        </>
      )}

      {
        isEdit && (
          <>
            {/* left */}
            <input
              ref={inputRef}
              type="text"
              defaultValue={displayText}
              className={`
                rounded-md w-2/3 h-full p-2 bg-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
              `}
            />

            {/* right */}
            <div className={'flex flex-row gap-2'}>
              <CheckIcon
                width={16}
                height={16}
                className={'flex items-center hover:text-white hover-transition-change'}
                onClick={handleCheckClick}
              />
              <XIcon
                width={16}
                height={16}
                className={'flex items-center hover:text-white hover-transition-change'}
                onClick={handleXClick}
              />
            </div>
          </>
        )
      }
    </div>
  )
}
