import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, {
  type FormEvent,
  type MouseEvent,
  useRef,
  useState
} from 'react'

import { TMyCopilot } from '@/types'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { chatItemsAtom, myCopilotsAtom, selectedModelIdAtom, superCopilotsAtom, } from '@/atoms'
import XIcon from '@/components/icons/XIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import CirclePlusIcon from '@/components/icons/CirclePlusIcon'

interface IProps {
  setIsModalOpen: (isModalOpen: boolean) => void
}

export default function ModalCopilot(props: IProps) {
  const {setIsModalOpen} = props
  const router = useRouter()
  const {t} = useTranslation('common')
  const setChatItems = useSetAtom(chatItemsAtom)
  const superCopilot = useAtomValue(superCopilotsAtom)
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const [myCopilots, setMyCopilots] = useAtom(myCopilotsAtom)
  const [showCreateCopilot, setShowCreateCopilot] = useState<boolean>(false)
  const [editingCopilotId, setEditingCopilotId] = useState<string | null>(null)
  const copilotNameRef = useRef<HTMLInputElement>(null)
  const copilotPromptsRef = useRef<HTMLInputElement>(null)

  const handleMyCopilotClick = async (id: string) => {
    // send copilot to chat
    const copilot = myCopilots.find(item => item.id === id)!
    // 1.create a chatItem
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          modelPrimaryId: selectedModelId,
          copilotName: copilot.copilotName,
          copilotPrompt: copilot.copilotPrompt,
        })
      }
      const response = await fetch('/api/chat/createCopilot', options)
      const data = await response.json()
      setChatItems(data.chatItems)
      setIsModalOpen(false)
      await router.push(`/chat/${data.newChatItem.item_uuid}`)
    } catch (e) {
      console.log(e)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement && e.key === 'Enter') {
      if (copilotNameRef.current?.value && copilotPromptsRef.current?.value) {
        handleSubmit(e)
      } else {
        e.preventDefault()
      }
    }
  }

  const handleEditClick = (e: MouseEvent, id: string) => {
    e.stopPropagation()
    // edit my copilot
    const copilot = myCopilots.find(item => item.id === id)!
    setShowCreateCopilot(true)
    setEditingCopilotId(id)
    setTimeout(() => {
      if (copilotNameRef.current && copilotPromptsRef.current) {
        copilotNameRef.current.value = copilot.copilotName
        copilotPromptsRef.current.value = copilot.copilotPrompt
      }
    }, 0)
  }

  const handleDeleteClick = (e: MouseEvent, id: string) => {
    e.stopPropagation()
    // delete my copilot
    const newMyCopilots = myCopilots.filter(item => item.id !== id)
    setMyCopilots(newMyCopilots)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement> | React.KeyboardEvent) => {
    e.preventDefault()

    if (editingCopilotId) {
      // editor my copilot
      const updatedMyCopilots = myCopilots.map(item => {
        if (item.id === editingCopilotId) {
          return {
            ...item,
            copilotName: copilotNameRef.current!.value,
            copilotPrompt: copilotPromptsRef.current!.value,
          }
        }
        return item
      })
      setMyCopilots(updatedMyCopilots)
      setEditingCopilotId(null) // reset editingCopilotId to null
    } else {
      // create a new copilot
      const newCopilot: TMyCopilot = {
        id: uuid(),
        copilotName: copilotNameRef.current!.value,
        copilotPrompt: copilotPromptsRef.current!.value,
      }
      setMyCopilots(prev => [...prev, newCopilot])
    }

    copilotNameRef.current!.value = ''
    copilotPromptsRef.current!.value = ''
    setShowCreateCopilot(false)
  }

  const handleSuperCopilotClick = (id: string) => {
    // add a new copilot to my copilots' array
    const copilot = superCopilot.find(item => item.id === id)!
    const newCopilot: TMyCopilot = {
      id: uuid(),
      copilotName: copilot.copilotName,
      copilotPrompt: copilot.copilotPrompt,
    }
    setMyCopilots(prev => [...prev, newCopilot])
  }

  return (
    <div className={'w-full h-full flex flex-col text-white'}>
      {/* header */}
      <div className={'h-20 p-4 flex flex-row justify-between rounded-t-md bg-chatpage-menu-hover'}>
        <p className={'font-medium text-2xl'}>{t('chatPage.menu.myCopilot')}</p>
        <XIcon
          width={24}
          height={24}
          className={'h-1/4 cursor-pointer text-gray-200/70 hover:text-gray-200 transition-change'}
          onClick={() => setIsModalOpen(false)}
        />
      </div>

      {/* main */}
      <div className={'flex-1 p-4 overflow-y-auto custom-scrollbar'}>
        {/* create a new Chat Copilot */}
        <div>
          {
            !showCreateCopilot ? (
              <div
                className={'flex items-center gap-2 p-2 border border-gray-500 rounded-md w-fit cursor-pointer hover:bg-gray-500/10 hover-transition-change'}
                onClick={() => setShowCreateCopilot(true)}
              >
                <CirclePlusIcon width={20} height={20}/>
                <p className={'text-sm'}>{t('chatPage.menu.createCopilot')}</p>
              </div>
            ) : (
              <form
                className={'bg-chatpage-menu-hover rounded-md p-2 flex flex-col gap-2'}
                onSubmit={handleSubmit}
              >
                <label htmlFor="name" className={'flex gap-2'}>
                  <p className={'text-sm flex items-center w-40'}>{t('chatPage.menu.copilotName')}：</p>
                  <input
                    type="text"
                    id={'name'}
                    ref={copilotNameRef}
                    required={true}
                    onKeyDown={handleKeyDown}
                    placeholder={t('chatPage.menu.copilotName')}
                    className={'flex-1 bg-transparent border border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'}
                  />
                </label>

                <label htmlFor="prompts" className={'flex gap-2'}>
                  <p className={'text-sm flex items-center w-40'}>{t('chatPage.menu.copilotPrompt')}：</p>
                  <input
                    type="text"
                    id={'description'}
                    ref={copilotPromptsRef}
                    required={true}
                    onKeyDown={handleKeyDown}
                    placeholder={t('chatPage.menu.copilotPrompt')}
                    className={'flex-1 bg-transparent border border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'}
                  />
                </label>

                <div className={'flex gap-2 justify-end'}>
                  <button
                    className={'w-20 border border-gray-500 p-1 rounded-md hover:bg-gray-500/10 hover-transition-change'}
                    onClick={() => setShowCreateCopilot(false)}
                  >
                    {t('chatPage.message.cancel')}
                  </button>
                  <button
                    type={'submit'}
                    className={'w-20 border border-gray-500 p-1 rounded-md hover:bg-gray-500/10 hover-transition-change'}
                  >
                    {t('chatPage.message.save')}
                  </button>
                </div>
              </form>
            )
          }
        </div>

        {/* my chatLists */}
        {
          myCopilots.length > 0 && (
            <div className={'flex flex-col gap-2 mt-10'}>
              <p>{t('chatPage.menu.myCopilot')}：</p>
              <div className={'flex flex-wrap gap-2'}>
                {
                  myCopilots.map(item => (
                    <div
                      key={item.id}
                      className={'w-40 flex gap-2 p-2 group border border-gray-500 rounded-md cursor-pointer hover:bg-gray-500/10 hover-transition-change'}
                      onClick={() => handleMyCopilotClick(item.id)}
                    >
                      <p className={'text-sm w-4/5 truncate'}>{item.copilotName}</p>

                      {/* icons */}
                      <div className={'flex gap-1 items-center'}>
                        <EditIcon
                          width={16}
                          height={16}
                          className={'hidden group-hover:flex items-center hover:text-zinc-400 hover-transition-change'}
                          onClick={(e) => handleEditClick(e, item.id)}
                        />
                        <TrashIcon
                          width={16}
                          height={16}
                          className={'hidden group-hover:flex items-center hover:text-red-500 hover-transition-change'}
                          onClick={(e) => handleDeleteClick(e, item.id)}
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }

        {/* super chatLists */}
        <div className={'flex flex-col gap-2 mt-10'}>
          <p>{t('chatPage.menu.copilotTitle')}：</p>
          <div className={'flex flex-wrap gap-2'}>
            {
              superCopilot.map(item => (
                <div
                  key={item.id}
                  className={'p-2 border border-gray-500 rounded-md cursor-pointer hover:bg-gray-500/10 hover-transition-change'}
                  onClick={() => handleSuperCopilotClick(item.id)}
                >
                  <p className={'text-sm'}>{item.copilotName}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={'h-20 flex justify-center items-center p-2 text-sm rounded-b-md bg-chatpage-menu-hover'}>
        <p>
          {t('chatPage.menu.footer')} {' '}
          <span className={'underline cursor-pointer'} onClick={() => router.push('/#research')}>
            {t('chatPage.menu.footerLink')}
          </span>
        </p>
      </div>
    </div>
  )
}
