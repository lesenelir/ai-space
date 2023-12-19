import { useRouter } from 'next/router'
import { useAtomValue, useSetAtom } from 'jotai'
import { useMemo, useRef, useState } from 'react'

import type { TModel } from '@/types'
import DropDown from '@/components/ui/DropDown'
import useOutsideClick from '@/hooks/useOutsideClick'
import ChevronUpIcon from '@/components/icons/ChevronUpIcon'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon'
import { chatItemsAtom, modelsAtom, selectedModelIdAtom } from '@/atoms'
import { GPT3, GPT4 } from '@/components/chat/Message/HeaderContent/OptionData'

export default function Select() {
  const router = useRouter()
  const models = useAtomValue(modelsAtom)
  const chatItemLists =  useAtomValue(chatItemsAtom)
  const setSelectedModelIdAtom = useSetAtom(selectedModelIdAtom)
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>(models[0].modelName)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useOutsideClick(wrapperRef, () => setIsDropDownOpen(false))

  const handleSelect = (model: TModel) => {
    setSelectedOption(model.modelName)
    setSelectedModelIdAtom(model.id) // change global state, --> Modal Table id
    setIsDropDownOpen(false)
  }

  const currentChatItem = useMemo(() =>
      chatItemLists.find(item => item.itemUuid === router.query.id),
    [chatItemLists, router.query.id]
  )
  const currentChatModel = useMemo(() =>
    models.find(model => model.id === currentChatItem?.modelPrimaryId),
    [models, currentChatItem?.modelPrimaryId]
  )

  const renderModelIcon = (id: number) => {
    switch (id) {
      case 1:
        return <GPT3/>
      case 2:
        return <GPT4/>
      default:
        return null
    }
  }

  return (
    <>
      {/* user in /chat/*, the current chatItem model is determined */}
      {
        router.query.id && (
          <div className={'w-fit p-2 rounded-lg border border-gray-200 dark:border-gray-500'}>
            <p className={'text-sm'}>{currentChatModel?.modelName}</p>
          </div>
        )
      }

      {/* user in /chat page */}
      {
        !router.query.id && (
          <div
            className={`
              w-fit relative flex gap-3 p-2 cursor-pointer rounded-lg
              border border-gray-200 hover:bg-gray-200/80 hover-transition-change
              dark:border-gray-500 dark:hover:bg-gray-500/10
            `}
            ref={wrapperRef}
            onClick={() => setIsDropDownOpen(!isDropDownOpen)}
          >
            <p className={'text-sm'}>{selectedOption}</p>
            {
              isDropDownOpen ? (
                <ChevronUpIcon width={16} height={16} className={'flex items-center'}/>
              ) : (
                <ChevronDownIcon width={16} height={16} className={'flex items-center'}/>
              )
            }

            {/* Dropdown Items */}
            {
              isDropDownOpen && (
                <DropDown
                  className={'absolute left-0 top-10 w-56 rounded-md z-10'}
                  motionClassName={`
                    w-full bg-gray-50 border border-gray-200 rounded-md p-2
                    dark:bg-chatpage-message-background-dark dark:border-gray-500
                  `}
                  motionAnimation={{
                    initial: {opacity: 0, y: '-20%'},
                    animate: {opacity: 1, y: 0},
                  }}
                >
                  {models.map((item) => (
                    <div
                      key={item.id}
                      className={`
                        cursor-pointer p-2 rounded-md hover-transition-change text-sm flex gap-2
                        hover:bg-gray-200/80 dark:hover:bg-gray-500/10 dark:text-gray-50 
                      `}
                      onClick={() => handleSelect(item)}
                    >
                      {renderModelIcon(item.id)} {/* Picture icon */}
                      <span>{item.modelName}</span>
                    </div>
                  ))}
                </DropDown>
              )
            }
          </div>
        )
      }
    </>
  )
}
