import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

import useOutsideClick from '@/hooks/useOutsideClick'
import ChevronUpIcon from '@/components/icons/ChevronUpIcon'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon'
import { type TOptions } from '@/components/chat/Message/HeaderContent'

interface IProps {
  width: string
  options: TOptions[]
  className?: string
}

export default function Select({
  width,
  options,
  className,
}: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>(options[0].label)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useOutsideClick(wrapperRef, () => setIsOpen(false))

  const handleSelect = (option: TOptions) => {
    setSelectedOption(option.label)
    setIsOpen(false)
  }

  return (
    <div
      className={`relative ${width} ${className}`}
      ref={wrapperRef}
    >
      <div
        className={`
          flex gap-2 p-2 cursor-pointer border border-gray-200
          rounded-md hover:bg-gray-200 transition-change
          dark:border-gray-500 dark:hover:bg-gray-500/20
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption}
        {isOpen ? (
          <ChevronUpIcon width={16} height={16} className={'flex items-center'}/>
        ): (
          <ChevronDownIcon width={16} height={16} className={'flex items-center'}/>
        )}
      </div>

      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`
            absolute z-50 w-48 bg-gray-50 mt-1 
            border border-gray-200 rounded-md p-2 transition-change
            dark:bg-chatpage-message-background-dark dark:border-gray-500
          `}
        >
          {options.map((option, index) => (
            <motion.li
              key={index}
              onClick={() => handleSelect(option)}
              className={'cursor-pointer rounded-md py-2 hover:bg-gray-200 dark:hover:bg-gray-500/20 transition-change'}
            >
              {option.value}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
