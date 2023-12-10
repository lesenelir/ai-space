import { type MouseEvent, useRef, useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'

import DropDown from '@/components/ui/DropDown'
import useOutsideClick from '@/hooks/useOutsideClick'

export default function FooterMenuContent() {
  const {user} = useUser()
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const dropDownDivRef = useRef<HTMLDivElement>(null)
  const triggerDivRef = useRef<HTMLDivElement>(null)

  useOutsideClick(dropDownDivRef, (event) => {
    if (!triggerDivRef.current?.contains(event!.target as Node)) setIsDropDownOpen(false)
  })

  return (
    <>
      {
        isDropDownOpen && (
          <DropDown
            ref={dropDownDivRef}
            className={'absolute left-0 bottom-12 w-full rounded-md z-10'}
          >
            <p>red</p>
            <p>red</p>
            <div className={'border'}/>
            <p>log out</p>
          </DropDown>
        )
      }

      <div
        className={`
        w-full h-[48px] flex items-center gap-4 p-2 rounded-lg 
        cursor-pointer transition-change hover:bg-gray-500/10
      `}
        ref={triggerDivRef}
        onClick={() => setIsDropDownOpen(!isDropDownOpen)}
      >
        <div onClick={(e: MouseEvent) => e.stopPropagation()}>
          <UserButton afterSignOutUrl={'/'}/>
        </div>
        <p>{user?.firstName}</p>
      </div>
    </>
  )
}
