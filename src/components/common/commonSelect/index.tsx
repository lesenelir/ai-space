import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useAtom, useAtomValue } from 'jotai'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import type { TModel } from '@/types'
import { useOutsideClick } from '@/hooks'
import DropDown from '@/components/ui/DropDown'
import ChevronUpIcon from '@/components/icons/ChevronUpIcon'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon'
import RenderModelIcon from '@/components/common/RenderModelIcon'
import { chatItemsAtom, modelsAtom, selectedModelIdAtom } from '@/atoms'

export default function CommonSelect() {
  const router = useRouter()
  const models = useAtomValue(modelsAtom)
  const chatItemLists =  useAtomValue(chatItemsAtom)
  const [selectedModelId, setSelectedModelId] = useAtom(selectedModelIdAtom)
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>(models[0]?.modelName)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useOutsideClick(wrapperRef, () => setIsDropDownOpen(false))

  useEffect(() => {
    // When selectedModelId changes, update selectedOption (model name)
    const selectedModel = models.find(model => model.id === selectedModelId)
    if (selectedModel) {
      setSelectedOption(selectedModel.modelName)
    }
  }, [selectedModelId, models])

  const handleSelect = (model: TModel) => {
    // setSelectedOption(model.modelName) // this is not necessary, because selectedOption is updated by useEffect
    setSelectedModelId(model.id) // change global state, --> Model Table id
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
            className={clsx(
              'min-w-fit relative flex gap-3 p-2 cursor-pointer rounded-lg border border-gray-200',
              'hover:bg-gray-200/80 hover-transition-change dark:border-gray-500 dark:hover:bg-gray-500/10'
            )}
            ref={wrapperRef}
            onClick={() => setIsDropDownOpen(!isDropDownOpen)}
          >
            <p className={'text-sm'}>{selectedOption}</p>
            {
              isDropDownOpen ? (
                <ChevronUpIcon width={16} height={16} className={'flex items-center'}/>
              ) : (
                <ChevronDownIcon width={16} height={16} strokeWidth={2} className={'flex items-center'}/>
              )
            }

            {/* Dropdown Items */}
            {
              isDropDownOpen && (
                <DropDown
                  className={'absolute left-0 top-10 w-72 rounded-md z-10'}
                  motionClassName={clsx(
                    'w-full bg-gray-50 border border-gray-200 rounded-md p-2',
                    'dark:bg-chatpage-message-background-dark dark:border-gray-500'
                  )}
                  motionAnimation={{
                    initial: {opacity: 0, y: '-20%'},
                    animate: {opacity: 1, y: 0},
                  }}
                >
                  {/* TODO: When introduce gemini pro, its should be uncomment.  */}
                  {/*{models.map((item) => (*/}
                  {/*  <div*/}
                  {/*    key={item.id}*/}
                  {/*    className={`*/}
                  {/*      cursor-pointer p-2 rounded-md hover-transition-change text-sm flex gap-2*/}
                  {/*      hover:bg-gray-200/80 dark:hover:bg-gray-500/10 dark:text-gray-50 items-center*/}
                  {/*    `}*/}
                  {/*    onClick={() => handleSelect(item)}*/}
                  {/*  >*/}
                  {/*    {renderModelIcon(item.id)} /!* Picture icon *!/*/}
                  {/*    <span>{item.modelName}</span>*/}
                  {/*  </div>*/}
                  {/*))}*/}
                  {models.map(item => (
                    <Fragment key={item.id}>
                      {item.id === 4 ? (
                        <div
                          className={clsx(
                            'flex gap-2 pointer-events-none',
                            'cursor-pointer p-2 rounded-md text-sm hover-transition-change'
                          )}
                        >
                          {/*{renderModelIcon(item.id)} /!* Picture icon *!/*/}
                          <RenderModelIcon id={item.id} width={16} height={16}/>
                          <span>{item.modelName} (not supported yet)</span>
                        </div>
                      ) : (
                        <div
                          className={clsx(
                            'cursor-pointer p-2 rounded-md hover-transition-change text-sm flex gap-2',
                            'hover:bg-gray-200/80 dark:hover:bg-gray-500/10 dark:text-gray-50 items-center'
                          )}
                          onClick={() => handleSelect(item)}
                        >
                          {/*{renderModelIcon(item.id)} /!* Picture icon *!/*/}
                          <RenderModelIcon id={item.id} width={16} height={16}/>
                          <span>{item.modelName}</span>
                        </div>
                      )}
                    </Fragment>
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
