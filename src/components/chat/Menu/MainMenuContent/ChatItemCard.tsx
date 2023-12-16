import { useRef, useState } from 'react'
import { useAtom } from 'jotai'

import { chatItemsAtom } from '@/atoms'
import XIcon from '@/components/icons/XIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import MessageIcon from '@/components/icons/MessageIcon'

interface IProps {
  id: number
  text: string
}

export default function ChatItemCard(props: IProps) {
  const {text, id} = props
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [displayText, setDisplayText] = useState<string>(text)
  const inputRef = useRef<HTMLInputElement>(null)
  const [chatItems, setChatItems] = useAtom(chatItemsAtom)

  const handleEditClick = () => {
    setIsEdit(true)
    setTimeout(() => { // focus on input
      if(inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  const handleEditCheckClick = () => {
    setIsEdit(false)
    if (inputRef.current) {
      setDisplayText(inputRef.current.value)
    }
  }

  const handleDeleteClick = () => {
    setIsDelete(true)
  }

  const handleDeleteCheckClick = () => {
    const newChatItems = chatItems.filter((chatItem) => chatItem.id !== id)
    setChatItems(newChatItems)
    setIsDelete(false)
  }

  return (
    <div className={`
      w-full h-12 p-3 my-1 flex justify-between cursor-pointer rounded-md 
      hover:bg-chatpage-menu-hover hover-transition-change chat-item
    `}>
      {!isEdit && (
        <>
          {/* left */}
          <div className={'flex flex-row gap-2 overflow-hidden'}>
            <MessageIcon width={16} height={16} className={'flex items-center'}/>
            <p className={'truncate'}>{displayText}</p>
          </div>
          {/* right */}
          <div
            className={`
              flex flex-row gap-2 ml-4
              ${isDelete ? 'icon-show' : 'icon-hidden'}  
            `}
          >
            {
              isDelete ? (
                <>
                  <CheckIcon
                    width={16}
                    height={16}
                    className={`
                      flex items-center text-green-400 p-1 border border-gray-500 rounded-md
                      hover:text-green-600 hover:bg-gray-500/10 hover-transition-change
                    `}
                    onClick={handleDeleteCheckClick}
                  />
                  <XIcon
                    width={16}
                    height={16}
                    className={`
                      flex items-center text-red-500 p-1 border border-gray-500 rounded-md
                      hover:text-red-600 hover:bg-gray-500/10 hover-transition-change
                    `}
                    onClick={() => setIsDelete(false)}
                  />
                </>
              ) : (
                <>
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
                    onClick={handleDeleteClick}
                  />
                </>
              )
            }
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
                onClick={handleEditCheckClick}
              />
              <XIcon
                width={16}
                height={16}
                className={'flex items-center hover:text-white hover-transition-change'}
                onClick={() => setIsEdit(false)}
              />
            </div>
          </>
        )
      }
    </div>
  )
}
