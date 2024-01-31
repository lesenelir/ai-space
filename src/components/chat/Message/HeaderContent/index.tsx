import clsx from 'clsx'
import { useAtom } from 'jotai'

import { isMenuOpenAtom } from '@/atoms'
import I18Change from '@/components/common/I18Change'
import ColumnsIcon from '@/components/icons/ColumnsIcon'
import ThemeChange from '@/components/common/ThemeChange'
import CommonSelect from '@/components/common/commonSelect'

export default function HeaderContent() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom)

  return (
    <div
      className={clsx(
        'w-full h-[66px] p-3 border-b mb-1 flex justify-between items-center',
        'dark:bg-chatpage-message-background-dark dark:border-b-gray-500'
      )}
    >
      {/* left icon */}
      <div className={'flex gap-2 text-black dark:text-white'}>
        {!isMenuOpen && (
          <ColumnsIcon
            width={24}
            height={24}
            className={clsx(
              'border p-2 rounded-lg cursor-pointer hover:bg-gray-200',
              'hover-transition-change dark:border-gray-500 dark:hover:bg-gray-500/10',
            )}
            onClick={() => setIsMenuOpen(true)}
          />
        )}
        <CommonSelect/>
      </div>

      {/* right icon */}
      <div className={'flex flex-row gap-4'}>
        <I18Change/>
        <ThemeChange/>
      </div>
    </div>
  )
}
