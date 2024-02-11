import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { isToday, isYesterday, subDays } from 'date-fns'

import {
  chatItemsAtom,
  isSearchActiveAtom,
  searchQueryNameAtom
} from '@/atoms'
import type { TCategorizedChatItems, TChatItem } from '@/types'
import DatabaseOffIcon from '@/components/icons/DatabaseOffIcon'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import ChatItemCard from '@/components/chat/Menu/MainMenuContent/ChatItemCard'

type TypeCategory = 'today' | 'yesterday' | 'previous7Days' | 'previous30Days' | 'all'

export default function MainMenuContent() {
  const { t } = useTranslation('common')
  const chatItemLists =  useAtomValue(chatItemsAtom)
  const isSearchActive = useAtomValue(isSearchActiveAtom)
  const searchQueryName = useAtomValue(searchQueryNameAtom)
  const [elastic, setElastic] = useState<{[key in TypeCategory]: boolean}>(
    {
      today: true,
      yesterday: true,
      previous7Days: true,
      previous30Days: true,
      all: false
    }
  )

  // Note: category value must be the same as the key in i18n/common.json
  const renderOrder: TypeCategory[] = useMemo(() => {
    return ['today', 'yesterday', 'previous7Days', 'previous30Days', 'all']
  }, [])

  // { key: Date, value: [chatItem, chatItem, ...] }
  const categorizedChatItemLists = useMemo(() => {
    return chatItemLists.reduce<TCategorizedChatItems>((pre: TCategorizedChatItems, item: TChatItem) => {
      let category
      const updatedAt = new Date(item.updatedAt)

      if (isToday(updatedAt)) {
        category = renderOrder[0]
      } else if (isYesterday(updatedAt)) {
        category = renderOrder[1]
      } else if (updatedAt >= subDays(new Date(), 7)) {
        category = renderOrder[2]
      } else if (updatedAt >= subDays(new Date(), 30)) {
        category = renderOrder[3]
      } else {
        category = renderOrder[4]
      }

      if (!pre[category]) {
        pre[category] = []
      }

      pre[category].push(item)
      return pre
    }, {})
  }, [chatItemLists, renderOrder])

  const handleElasticClick = (key: TypeCategory) => {
    setElastic((prev) => {
      return {
        ...prev,
        [key]: !prev[key]
      }
    })
  }

  if (isSearchActive) {
    const searchChatItems: TChatItem[] = chatItemLists.filter((chatItem: TChatItem) => chatItem.itemName.includes(searchQueryName))

    if (searchChatItems.length === 0) {
      return (
        <div className={'flex-1 overflow-y-auto custom-scrollbar mb-2'}>
          <DatabaseOffIcon
            width={48}
            height={48}
            className={'flex justify-center mt-8 mb-2'}
          />
          <p className={'text-center'}>No data.</p>
        </div>
      )
    }

    return (
      <div className={'flex-1 overflow-y-auto custom-scrollbar mb-2'}>
        {/* Star Lists */}
        <div className={'w-full flex flex-col gap-1'}>
          {
            searchChatItems
              .filter((chatItem: TChatItem) => chatItem.isStarred)
              .sort((a: TChatItem, b: TChatItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((chatItem: TChatItem) => (
                <ChatItemCard
                  key={chatItem.id}
                  id={chatItem.id}
                  text={chatItem.itemName}
                  uuid={chatItem.itemUuid}
                  isStarred={chatItem.isStarred}
                />
              ))
          }
        </div>

        <div className={'border-b border-gray-500 mt-1 mb-2'}/>

        {/* No Star Lists */}
        <div className={'w-full flex flex-col gap-1'}>
          {
            searchChatItems
              .filter((chatItem: TChatItem) => !chatItem.isStarred)
              .sort((a: TChatItem, b: TChatItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((chatItem: TChatItem) => (
                <ChatItemCard
                  key={chatItem.id}
                  id={chatItem.id}
                  text={chatItem.itemName}
                  uuid={chatItem.itemUuid}
                  isStarred={chatItem.isStarred}
                />
              ))
          }
        </div>
      </div>
    )
  }

  // !isSearchActive
  return (
    <div className={'flex-1 overflow-y-auto custom-scrollbar mb-2'}>
      {/* Star Lists */}
      <div className={'w-full flex flex-col gap-1'}>
        {
          chatItemLists
            .filter((chatItem: TChatItem) => chatItem.isStarred)
            .sort((a: TChatItem, b: TChatItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((chatItem: TChatItem) => (
              <ChatItemCard
                key={chatItem.id}
                id={chatItem.id}
                text={chatItem.itemName}
                uuid={chatItem.itemUuid}
                isStarred={chatItem.isStarred}
              />
            ))
        }
      </div>

      <div className={'border-b border-gray-500 mt-1 mb-2'}/>

      {/* No Star Lists based on Date */}
      <div className={'w-full flex flex-col gap-1'}>
        {
          renderOrder.map((categoryDate: TypeCategory) => {
            const chatItemsBasedDate = categorizedChatItemLists[categoryDate]
            if (!chatItemsBasedDate) return null
            if (categoryDate === renderOrder[0]) {
              const temp = chatItemsBasedDate.filter((chatItem: TChatItem) => !chatItem.isStarred)
              if (temp.length === 0) return null
            }

            return (
              <div key={categoryDate} className={'mb-2'}>
                <div
                  className={'flex gap-2.5 items-center cursor-pointer group mb-1.5'}
                  onClick={() => handleElasticClick(categoryDate)}
                >
                  <p className={'text-xs font-light text-gray-400 group-hover:text-gray-300 hover-transition-change'}>
                    {t(`chatPage.menu.${categoryDate}`)}
                  </p>

                    <p
                      className={clsx(
                        'text-xs rounded-full text-gray-400 bg-zinc-700 px-1 py-0.5',
                        'group-hover:text-gray-300 hover-transition-change'
                      )}
                    >
                      {chatItemsBasedDate.length}
                    </p>
                    {
                      elastic[categoryDate] ? (
                        <ChevronDownIcon
                          width={16}
                          height={16}
                          strokeWidth={1}
                          className={'text-gray-400 group-hover:text-gray-300 hover-transition-change'}
                        />
                      ) : (
                        <ChevronRightIcon
                          width={16}
                          height={16}
                          className={'text-gray-400 group-hover:text-gray-300 hover-transition-change'}
                        />
                      )
                    }
                </div>
                <div className={clsx(elastic[categoryDate] ? 'flex flex-col gap-1' : 'hidden')}>
                  {
                    chatItemsBasedDate
                      .filter((chatItem: TChatItem) => !chatItem.isStarred)
                      .sort((a: TChatItem, b: TChatItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .map((chatItem: TChatItem) => (
                        <ChatItemCard
                          key={chatItem.id}
                          id={chatItem.id}
                          text={chatItem.itemName}
                          uuid={chatItem.itemUuid}
                          isStarred={chatItem.isStarred}
                        />
                      ))
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
