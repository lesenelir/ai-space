import { useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'

import { chatItemsAtom, isMenuOpenAtom } from '@/atoms'
import FolderPlusIcon from '@/components/icons/FolderPlusIcon'
import ColumnsIcon from '@/components/icons/ColumnsIcon'

export default function HeaderMenuContent() {
  const { t } = useTranslation('common')
  const setIsMenuOpen = useSetAtom(isMenuOpenAtom)
  const setChatItems = useSetAtom(chatItemsAtom)

  const handleNewChat = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const response = await fetch('/api/chat/newChat', options)
      const data = (await response.json()).chatItems
      setChatItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={'w-full mb-2'}>
      {/* first content */}
      <div className={'w-full h-[48px] flex gap-2 mb-2'}>
        {/* new chat */}
        <div
          className={`
            w-5/6 font-light menu-first-content-item 
            transition-change cursor-pointer hover:bg-gray-500/10
          `}
          onClick={handleNewChat}
        >
          {t('chatPage.menu.newChat')}
        </div>

        <div className={'flex-1 flex justify-between gap-2 ml-auto'}>
          {/* create file folder */}
          <div className={`
            menu-first-content-item transition-change 
            cursor-pointer hover:bg-gray-500/10
          `}>
            <FolderPlusIcon width={24} height={24}/>
          </div>

          {/* scalability */}
          <div
            className={`
              menu-first-content-item transition-change cursor-pointer hover:bg-gray-500/10
            `}
            onClick={() => setIsMenuOpen(pre => !pre)}
          >
            <ColumnsIcon width={24} height={24}/>
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={t('chatPage.menu.search')}
        className={`
          w-full h-[48px] menu-first-content-item bg-chatpage-menu-background
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
        `}
      />
    </div>
  )
}
