import { ReactNode } from 'react'
import { useAtomValue } from 'jotai'

import { isMenuOpenAtom } from '@/atoms'
import Select from '@/components/chat/Message/HeaderContent/Select'
import I18Change from '@/components/chat/Message/HeaderContent/I18Change'
import ThemeChange from '@/components/chat/Message/HeaderContent/ThemeChange'
import { GPT3, GPT4 } from '@/components/chat/Message/HeaderContent/OptionData'

export type TOptions = {
  id: number
  value: ReactNode
  label: string
}

const options: TOptions[] = [
  {id: 1, value: <GPT3/>, label: 'GPT-3.5 Turbo'},
  {id: 2, value: <GPT4/>, label: 'GPT-4 Turbo'},
]

export default function HeaderContent() {
  const isMenuOpen = useAtomValue(isMenuOpenAtom)

  return (
    <div
      className={`
        w-full h-[66px] p-3 border-b mb-1 flex justify-between items-center 
        dark:bg-chatpage-message-background-dark dark:border-b-gray-500
      `}
    >
      {/* left icon */}
      <div className={`${isMenuOpen ? '' : 'ml-12'}`}>
        <Select options={options}/>
      </div>

      {/* right icon */}
      <div className={'flex flex-row gap-4'}>
        <I18Change/>
        <ThemeChange/>
      </div>
    </div>
  )
}
