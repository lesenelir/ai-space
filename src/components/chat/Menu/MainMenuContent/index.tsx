import { useAtomValue } from 'jotai'

import { chatItemsAtom } from '@/atoms'
import { type TChatItem } from '@/types'
import ChatItemCard from '@/components/chat/Menu/MainMenuContent/ChatItemCard'

export default function MainMenuContent() {
  const chatItemLists =  useAtomValue(chatItemsAtom)

  return (
    <div className={'flex-1 overflow-y-auto custom-scrollbar mb-2'}>
      {
        chatItemLists.map((chatItem: TChatItem) => (
          <ChatItemCard
            key={chatItem.id}
            id={chatItem.id}
            text={chatItem.itemName}
          />
        ))
      }
    </div>
  )
}
