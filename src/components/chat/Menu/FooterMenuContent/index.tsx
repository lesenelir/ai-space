import Image from 'next/image'
import { useRouter } from 'next/router'
import { UserButton, useUser } from '@clerk/nextjs'
import { type MouseEvent, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'

import Modal from '@/components/ui/Modal'
import DropDown from '@/components/ui/DropDown'
import useOutsideClick from '@/hooks/useOutsideClick'
import UserCard, { userData } from '@/components/chat/Menu/FooterMenuContent/UserCard'
import ModalPlan from '@/components/chat/Menu/FooterMenuContent/ModalPlan'
import ModalSettings from '@/components/chat/Menu/FooterMenuContent/ModalSettings'

export default function FooterMenuContent() {
  const router = useRouter()
  const {t} = useTranslation('common')
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
            motionAnimation={{
              initial: { opacity: 0, y: '20%' },
              animate: { opacity: 1, y: 0 },
            }}
          >
            {/* user data: my plan & settings */}
            {
              userData.map((item) => (
                <UserCard
                  key={item.id}
                  imageSrc={item.imageSrc}
                  imageAlt={item.imageAlt}
                  text={t(item.textKey)}
                  onClick={item.id === 1 ? handlerMyPlan : handlerSettings}
                />
              ))
            }

            <div className={'border-b border-gray-900'}/>

            {/* go back home page */}
            <div
              className={'flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-gray-200 transition-change'}
              onClick={() => router.push('/')}
            >
              <Image
                width={20}
                height={20}
                src={'/log-out.svg'}
                alt={'Logout'}
              />
              <p className={'text-sm'}>{t('chatPage.menu.back')}</p>
            </div>
          </DropDown>
        )
      }

      {/* global modal dialog  */}
      {
        isModalOpen && (
          <Modal
            motionClassName={`${activeModal === 'Settings' && 'w-2/5 h-4/5 max-lg:w-4/5 max-md:w-full max-sm:w-full max-sm:h-5/6'}`}
            onClose={() => setIsModalOpen(false)}
          >
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
