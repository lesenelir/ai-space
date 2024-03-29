import clsx from 'clsx'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import {
  type KeyboardEvent,
  type MouseEvent,
  useRef,
  useState
} from 'react'

import { chatItemsAtom } from '@/atoms'
import XIcon from '@/components/icons/XIcon'
import EditIcon from '@/components/icons/EditIcon'
import StarIcon from '@/components/icons/StarIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import MessageIcon from '@/components/icons/MessageIcon'
import MessageChatIcon from '@/components/icons/MessageChatIcon'

interface IProps {
  id?: number
  text: string
  uuid: string
  isStarred: boolean
}

export default function ChatItemCard(props: IProps) {
  const { text, uuid, isStarred } = props
  const router = useRouter()
  const { t } = useTranslation('common')
  const setChatItems = useSetAtom(chatItemsAtom)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isDelete, setIsDelete] = useState<boolean>(false)

  const isCurrentChat = router.query.id === uuid

  // click edit icon
  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation()

    setIsEdit(true)
    setTimeout(() => { // focus on input
      if(inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  // click star icon
  const handleStarClick = async (e: MouseEvent) => {
    e.stopPropagation()

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({item_uuid: uuid})
    }

    try {
      const response = await fetch('/api/chat/starChatItem', options)
      const data = (await response.json()).chatItems
      setChatItems(data)
    } catch (e) {
      console.log('star item error: ', e)
    }
  }

  // update chat item name
  const updateChatItemName = async () => {
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
      await router.push(`/chat/${uuid}`)
    } catch (e) {
      console.log('update item name error: ', e)
    }
  }

  // when in edit mode, click check icon -> update chat item name
  const handleEditCheckClick = async (e: MouseEvent) => {
    e.stopPropagation()
    await updateChatItemName()
  }

  // when in edit mode, press enter -> update chat item name
  const handleInputKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await updateChatItemName()
    }
  }

  // when in delete mode, click check icon -> delete chat item
  const handleDeleteCheckClick = async (e: MouseEvent) => {
    e.stopPropagation()

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
      await router.push('/chat')
    } catch (e) {
      console.log('delete item error: ', e)
    }
  }

  return (
    <div
      className={clsx(
        'w-full p-2 h-10 flex justify-between cursor-pointer rounded-lg',
        'hover:bg-chatpage-menu-hover hover-transition-change group',
        isCurrentChat && 'bg-chatpage-menu-hover',
      )}
      onClick={() => router.push(`/chat/${uuid}`)}
    >
      {!isEdit && (
        <>
          {
            // When user click delete icon, rather than click edit icon
            isDelete ? (
              <div className={'w-full flex gap-2 overflow-hidden justify-between'}>
                <p className={'truncate flex items-center tracking-wide'}>
                  {t('chatPage.menu.delete') + ' ' + `"${text}"`}
                </p>
                <div className={'flex gap-2 ml-2'}>
                  <CheckIcon
                    width={16}
                    height={16}
                    className={clsx(
                      'flex items-center text-green-400 p-1 border border-gray-500 rounded-md',
                      'hover:text-green-600 hover:bg-gray-500/10 hover-transition-change',
                    )}
                    onClick={handleDeleteCheckClick}
                  />
                  <XIcon
                    width={16}
                    height={16}
                    className={clsx(
                      'flex items-center text-red-500 p-1 border border-gray-500 rounded-md',
                      'hover:text-red-600 hover:bg-gray-500/10 hover-transition-change',
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsDelete(false)
                    }}
                  />
                </div>
              </div>
            ) : (
              // when user don't click edit icon and user don't click delete icon
              // normal display
              <>
                {/* left */}
                <div className={'flex flex-row gap-2 overflow-hidden'}>
                  {
                    isCurrentChat ? (
                      <MessageChatIcon
                        width={16}
                        height={16}
                        className={clsx(isStarred ? 'hidden' : 'flex items-center group-hover:hidden')}
                      />
                    ) : (
                      <MessageIcon
                        width={16}
                        height={16}
                        className={clsx(isStarred ? 'hidden' : 'flex items-center group-hover:hidden')}
                      />
                    )
                  }

                  <StarIcon
                    width={16}
                    height={16}
                    className={clsx(
                      isStarred
                        ? 'flex items-center text-yellow-500'
                        : 'hidden group-hover:flex group-hover:items-center hover:text-yellow-500',
                    )}
                    onClick={handleStarClick}
                  />
                  <p className={'truncate flex items-center tracking-wide'}>{text}</p>
                </div>
                {/* right */}
                <div className={'flex gap-2 ml-4'}>
                  <EditIcon
                    width={16}
                    height={16}
                    className={'hidden group-hover:flex group-hover:items-center hover:text-stone-400 hover-transition-change'}
                    onClick={handleEditClick}
                  />
                  <TrashIcon
                    width={16}
                    height={16}
                    className={'hidden group-hover:flex group-hover:items-center hover:text-red-500 hover-transition-change'}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsDelete(true)
                    }}
                  />
                </div>
              </>
            )
          }
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
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleInputKeyDown}
              className={clsx(
                'rounded-md w-2/3 p-2 bg-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              )}
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
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEdit(false)
                }}
              />
            </div>
          </>
        )
      }
    </div>
  )
}
