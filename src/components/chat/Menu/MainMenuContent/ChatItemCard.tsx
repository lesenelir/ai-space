import { useRef, useState } from 'react'
import { useSetAtom } from 'jotai'

import { chatItemsAtom } from '@/atoms'
import XIcon from '@/components/icons/XIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import MessageIcon from '@/components/icons/MessageIcon'
import StarIcon from '@/components/icons/StarIcon'

interface IProps {
  id?: number
  text: string
  uuid: string
}

export default function ChatItemCard(props: IProps) {
  const {text, uuid} = props
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const setChatItems = useSetAtom(chatItemsAtom)

  const handleEditClick = () => {
    setIsEdit(true)
    setTimeout(() => { // focus on input
      if(inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  // update chat item name
  const handleEditCheckClick = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item_uuid: uuid,
        item_name: inputRef.current?.value
      })
    }

    try {
      const response = await fetch('/api/chat/updateChatName', options)
      const data = (await response.json()).chatItems
      setChatItems(data)
      setIsEdit(false)
    } catch (e) {
      console.log('update item name error: ', e)
    }
  }

  // delete chat item
  const handleDeleteCheckClick = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({item_uuid: uuid})
    }

    try {
      const response = await fetch('/api/chat/deleteChatItem', options)
      const data = (await response.json()).chatItems
      setChatItems(data)
      setIsDelete(false)
    } catch (e) {
      console.log('delete item error: ', e)
    }
  }

  return (
    <div className={`
      w-full h-11 p-2 flex justify-between cursor-pointer rounded-md
      hover:bg-chatpage-menu-hover hover-transition-change group
    `}>
      {!isEdit && (
        <>
          {/* left */}
          <div className={'flex flex-row gap-2 overflow-hidden'}>
            <MessageIcon width={16} height={16} className={'flex items-center group-hover:hidden'}/>
            <StarIcon width={16} height={16} className={'hidden group-hover:flex group-hover:items-center'} />
            <p className={'truncate flex items-center tracking-wide'}>{text}</p>
          </div>
          {/* right */}
          <div className={'flex flex-row gap-2 ml-4'}>
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
                    className={'hidden group-hover:flex group-hover:items-center'}
                    onClick={handleEditClick}
                  />
                  <TrashIcon
                    width={16}
                    height={16}
                    className={'hidden group-hover:flex group-hover:items-center'}
                    onClick={() => setIsDelete(true)}
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
              defaultValue={text}
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
