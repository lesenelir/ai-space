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


  const sortedChatItemLists = useMemo(() => {
    return  chatItemLists.sort((a: TChatItem, b: TChatItem) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateA.getTime() - dateB.getTime()
    })
  }, [chatItemLists])

  // { key: Date, value: [chatItem, chatItem, ...] }
  const categorizedChatItemLists = useMemo(() => {
    return sortedChatItemLists.reduce<TCategorizedChatItems>((pre: TCategorizedChatItems, item: TChatItem) => {
      let category
      const updatedAt = new Date(item.updatedAt)

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
  }, [sortedChatItemLists])

  return (
    <div className={'flex-1 overflow-y-auto custom-scrollbar mb-2'}>
      {
        Object.entries(categorizedChatItemLists).map(([categoryDate, chatItemsList]) => (
          <div key={categoryDate} className={'mb-1'}>
            <h3 className={'text-sm font-light text-gray-400'}>{t(`chatPage.menu.${categoryDate}`)}</h3>
            <div className={'flex flex-col gap-1'}>
              {
                chatItemsList.map((chatItem: TChatItem) => (
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
