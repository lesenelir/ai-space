import Image from 'next/image'
import { useRouter } from 'next/router'
import { UserButton, useUser } from '@clerk/nextjs'
import { type MouseEvent, useRef, useState } from 'react'

import Modal from '@/components/ui/Modal'
import DropDown from '@/components/ui/DropDown'
import useOutsideClick from '@/hooks/useOutsideClick'
import UserCard, { userData } from '@/components/chat/Menu/FooterMenuContent/UserCard'
import ModalPlan from '@/components/chat/Menu/FooterMenuContent/ModalPlan'
import ModalSettings from '@/components/chat/Menu/FooterMenuContent/ModalSettings'

export default function FooterMenuContent() {
  const router = useRouter()
  const {user} = useUser()
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const dropDownDivRef = useRef<HTMLDivElement>(null)
  const triggerDivRef = useRef<HTMLDivElement>(null)

  useOutsideClick(dropDownDivRef, (event) => {
    if (!triggerDivRef.current?.contains(event!.target as Node)) setIsDropDownOpen(false)
  })

  const handlerMyPlan = () => {
    setIsDropDownOpen(false)
    setIsModalOpen(true)
    setActiveModal('MyPlan')
  }

  const handlerSettings = () => {
    setIsDropDownOpen(false)
    setIsModalOpen(true)
    setActiveModal('Settings')
  }

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
                  onClick={item.id === 1 ? handlerMyPlan : handlerSettings}
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

      {
        isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            {activeModal === 'MyPlan' && <ModalPlan setIsModalOpen={setIsModalOpen}/>}
            {activeModal === 'Settings' && <ModalSettings setIsModalOpen={setIsModalOpen}/>}
          </Modal>
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
