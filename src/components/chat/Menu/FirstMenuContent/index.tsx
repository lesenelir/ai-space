import FolderPlusIcon from '@/components/icons/FolderPlusIcon'
import ColumnsIcon from '@/components/icons/ColumnsIcon'

export default function FirstMenuContent() {
  return (
    <div className={'w-full mb-2'}>
      {/* first content */}
      <div className={'w-full h-[48px] flex gap-2 mb-2'}>
        {/* new chat */}
        <div className={'w-5/6 font-light menu-first-content-item'}>
          + New Chat
        </div>

        <div className={'flex-1 flex justify-between gap-2 ml-auto'}>
          {/* create file folder */}
          <div className={'menu-first-content-item'}>
            <FolderPlusIcon width={24} height={24}/>
          </div>

          {/* scalability */}
          <div className={'menu-first-content-item'}>
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
