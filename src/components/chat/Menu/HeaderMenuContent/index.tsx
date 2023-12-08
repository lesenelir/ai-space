import { useSetAtom } from 'jotai'

import { isOpenAtom } from '@/atoms'
import FolderPlusIcon from '@/components/icons/FolderPlusIcon'
import ColumnsIcon from '@/components/icons/ColumnsIcon'

export default function HeaderMenuContent() {
  const setIsOpen = useSetAtom(isOpenAtom)

  return (
    <div className={'w-full mb-2'}>
      {/* first content */}
      <div className={'w-full h-[48px] flex gap-2 mb-2'}>
        {/* new chat */}
        <div className={`
          w-5/6 font-light menu-first-content-item 
          transition-change cursor-pointer hover:bg-gray-500/10
        `}>
          + New Chat
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
            onClick={() => setIsOpen(pre => !pre)}
          >
            <ColumnsIcon width={24} height={24}/>
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={'search...'}
        className={`
          w-full h-[48px] menu-first-content-item bg-chatpage-menu-background
        `}
      />
    </div>
  )
}