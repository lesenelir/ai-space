import Image from 'next/image'
import { useRouter } from 'next/router'
import { type MouseEvent, useRef, useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'

import DropDown from '@/components/ui/DropDown'
import useOutsideClick from '@/hooks/useOutsideClick'
import UserCard, { userData } from '@/components/chat/Menu/FooterMenuContent/UserCard'

export default function FooterMenuContent() {
  const {user} = useUser()
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const dropDownDivRef = useRef<HTMLDivElement>(null)
  const triggerDivRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
            {/* user data */}
            {
              userData.map((item) => (
                <UserCard
                  key={item.id}
                  imageSrc={item.imageSrc}
                  imageAlt={item.imageAlt}
                  text={item.text}
                />
              ))
            }
            <div className={'border-b border-gray-900'}/>
            {/* logout */}
            <div
              className={'flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-gray-200 transition-change'}
              onClick={() => router.back()}
            >
              <Image
                width={20}
                height={20}
                src={'/log-out.svg'}
                alt={'Logout'}
              />
              <p className={'text-sm'}>Go Back</p>
            </div>
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
