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

  // { key: Date, value: [chatItem, chatItem, ...] }
  const categorizedChatItemLists = useMemo(() => {
    return chatItemLists.reduce<TCategorizedChatItems>((pre: TCategorizedChatItems, item: TChatItem) => {
      let category
      const updatedAt = new Date(item.updatedAt)

      // Note: category value must be the same as the key in i18n/common.json
      if (isToday(updatedAt)) {
        category = 'today'
      } else if (isYesterday(updatedAt)) {
        category = 'yesterday'
      } else if (updatedAt >= subDays(new Date(), 7)) {
        category = 'previous7Days'
      } else if (updatedAt >= subDays(new Date(), 30)) {
        category = 'previous30Days'
      } else {
        category = 'older'
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
      {
        Object.entries(categorizedChatItemLists).map(([categoryDate, chatItemsList]) => (
          <div key={categoryDate} className={'mb-1'}>
            <h3 className={'text-sm font-light text-gray-400'}>{t(`chatPage.menu.${categoryDate}`)}</h3>
            <div className={'flex flex-col gap-1'}>
              {
                chatItemsList
                  .sort((a: TChatItem, b: TChatItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map((chatItem: TChatItem) => (
                    <ChatItemCard
                      key={chatItem.id}
                      id={chatItem.id}
                      text={chatItem.itemName}
                      uuid={chatItem.itemUuid}
                    />
                  ))
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}
