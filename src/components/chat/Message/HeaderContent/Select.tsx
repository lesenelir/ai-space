import { useRef, useState } from 'react'

import DropDown from '@/components/ui/DropDown'
import useOutsideClick from '@/hooks/useOutsideClick'
import ChevronUpIcon from '@/components/icons/ChevronUpIcon'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon'
import { type TOptions } from '@/components/chat/Message/HeaderContent/index'

interface IProps {
  options: TOptions[]
}

export default function Select(props: IProps) {
  const {options} = props
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>(options[0].label)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useOutsideClick(wrapperRef, () => setIsDropDownOpen(false))

  const handleSelect = (option: TOptions) => {
    setSelectedOption(option.label)
    setIsDropDownOpen(false)
  }

  return (
    <div
      className={`
        w-fit relative flex gap-3 p-2 cursor-pointer rounded-lg
        border border-gray-200 hover:bg-gray-200/80 hover-transition-change
        dark:border-gray-500 dark:hover:bg-gray-500/10
      `}
      ref={wrapperRef}
      onClick={() => setIsDropDownOpen(!isDropDownOpen)}
    >
      <p className={'text-sm'}>{selectedOption}</p>
      {
        isDropDownOpen ? (
          <ChevronUpIcon width={16} height={16} className={'flex items-center'}/>
        ) : (
          <ChevronDownIcon width={16} height={16} className={'flex items-center'}/>
        )
      }

      {/* Dropdown Items */}
      {
        isDropDownOpen && (
          <DropDown
            className={'absolute left-0 top-10 w-56 rounded-md z-10'}
            motionClassName={`
              w-full bg-gray-50 border border-gray-200 rounded-md p-2
              dark:bg-chatpage-message-background-dark dark:border-gray-500
            `}
            motionAnimation={{
              initial: { opacity: 0, y: '-20%' },
              animate: { opacity: 1, y: 0 },
            }}
          >
            {options.map((option) => (
              <span
                key={option.id}
                className={`
                  cursor-pointer py-2 rounded-md hover-transition-change
                  hover:bg-gray-200/80 dark:hover:bg-gray-500/10 dark:text-gray-50 
                `}
                onClick={() => handleSelect(option)}
              >
                {option.value}
              </span>
            ))}
          </DropDown>
        )
      }
    </div>
  )
}
