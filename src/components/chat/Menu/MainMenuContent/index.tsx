import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'next-i18next'
import { isToday, isYesterday, subDays } from 'date-fns'

import { chatItemsAtom } from '@/atoms'
import { type TCategorizedChatItems, type TChatItem } from '@/types'
import ChatItemCard from '@/components/chat/Menu/MainMenuContent/ChatItemCard'

export default function MainMenuContent() {
  const chatItemLists =  useAtomValue(chatItemsAtom)
  const {t} = useTranslation('common')

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
  }, [chatItemLists])

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
                <p className={'text-xs font-light text-gray-400'}>{t(`chatPage.menu.${categoryDate}`)}</p>
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
