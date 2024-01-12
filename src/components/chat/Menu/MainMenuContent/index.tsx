import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'next-i18next'
import { isToday, isYesterday, subDays } from 'date-fns'

import { chatItemsAtom, isSearchActiveAtom, searchQueryNameAtom } from '@/atoms'
import type { TCategorizedChatItems, TChatItem } from '@/types'
import DatabaseOffIcon from '@/components/icons/DatabaseOffIcon'
import ChatItemCard from '@/components/chat/Menu/MainMenuContent/ChatItemCard'

export default function MainMenuContent() {
  const { t } = useTranslation('common')
  const chatItemLists =  useAtomValue(chatItemsAtom)
  const isSearchActive = useAtomValue(isSearchActiveAtom)
  const searchQueryName = useAtomValue(searchQueryNameAtom)

  // Note: category value must be the same as the key in i18n/common.json
  const renderOrder = useMemo(() => {
    return ['today', 'yesterday', 'previous7Days', 'previous30Days', 'older']
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
        <div className={'w-full'}>
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
        <div className={'w-full'}>
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

  return (
    <div className={'flex-1 overflow-y-auto custom-scrollbar mb-2'}>
      {/* Star Lists */}
      <div className={'w-full'}>
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
      <div className={'w-full'}>
        {
          renderOrder.map((categoryDate: string) => {
            const chatItemsList = categorizedChatItemLists[categoryDate]
            if (!chatItemsList) return null

            return (
              <div key={categoryDate} className={'mb-1'}>
                <p className={'text-xs font-light text-gray-400 mb-1'}>{t(`chatPage.menu.${categoryDate}`)}</p>
                <div className={'flex flex-col gap-1'}>
                  {
                    chatItemsList
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
