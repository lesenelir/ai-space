import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { type ChangeEvent, useRef } from 'react'
import { useRouter } from 'next/router'

import { chatItemsAtom, isMenuOpenAtom, isSearchActiveAtom, searchQueryNameAtom, selectedModelIdAtom } from '@/atoms'
import FolderPlusIcon from '@/components/icons/FolderPlusIcon'
import ColumnsIcon from '@/components/icons/ColumnsIcon'

export default function HeaderMenuContent() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const selectedModelId = useAtomValue(selectedModelIdAtom)
  const setIsMenuOpen = useSetAtom(isMenuOpenAtom)
  const setChatItems = useSetAtom(chatItemsAtom)
  const setIsSearchActive = useSetAtom(isSearchActiveAtom)
  const setSearchQueryName = useSetAtom(searchQueryNameAtom)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleNewChat = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model_primary_id: selectedModelId })
    }

    try {
      const response = await fetch('/api/chat/newChat', options)
      const data = (await response.json()).chatItems
      setChatItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(e.target.value)
  }

  const handleSearchFocus = () => {
    setIsSearchActive(true)
    setSearchQueryName('')
  }

  const handleSearchBlur = () => {
    setIsSearchActive(false)
    if (inputRef.current) {
      inputRef.current.value = ''
      setSearchQueryName('')
    }
  }

  return (
    <div className={'w-full mb-2'}>
      {/* first content */}
      <div className={'w-full h-[48px] flex gap-2 mb-2'}>
        <span
          className={`
            text-xl font-extrabold inline-flex items-center cursor-pointer
            text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-orange-300
          `}
          onClick={() => router.push('/chat')}
        >
          Chat
        </span>

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

      {/* second content Search */}
      <input
        ref={inputRef}
        type="text"
        placeholder={t('chatPage.menu.search')}
        className={`
          w-full h-[48px] menu-first-content-item bg-chatpage-menu-background
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
        `}
        onChange={handleSearchChange}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
      />
    </div>
  )
}
