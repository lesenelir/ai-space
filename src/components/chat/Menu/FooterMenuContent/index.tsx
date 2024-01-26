import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { UserButton, useUser } from '@clerk/nextjs'
import { type MouseEvent, useRef, useState } from 'react'

import { useOutsideClick } from '@/hooks'
import Modal from '@/components/ui/Modal'
import DropDown from '@/components/ui/DropDown'
import CategoryIcon from '@/components/icons/CategoryIcon'
import ModalPlan from '@/components/chat/Menu/FooterMenuContent/ModalPlan'
import ModalCopilot from '@/components/chat/Menu/FooterMenuContent/ModalCopilot'
import ModalSettings from '@/components/chat/Menu/FooterMenuContent/ModalSettings'
import ModalCategory from '@/components/chat/Menu/FooterMenuContent/ModalCategory'
import UserCard, { userData } from '@/components/chat/Menu/FooterMenuContent/UserCard'

export default function FooterMenuContent() {
  const router = useRouter()
  const { user } = useUser()
  const { t } = useTranslation('common')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [showCategory, setShowCategory] = useState<boolean>(false)
  const [hoverOnParent, setHoverOnParent] = useState<boolean>(true)
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const dropDownDivRef = useRef<HTMLDivElement>(null)
  const triggerDivRef = useRef<HTMLDivElement>(null)

  useOutsideClick(dropDownDivRef, (event) => {
    if (!triggerDivRef.current?.contains(event!.target as Node)) setIsDropDownOpen(false)
  })

  const handleMyPlan = () => {
    setIsDropDownOpen(false)
    setIsModalOpen(true)
    setActiveModal('MyPlan')
  }

  const handleMyCopilot = () => {
    setIsDropDownOpen(false)
    setIsModalOpen(true)
    setActiveModal('MyCopilot')
  }

  const handleSettings = () => {
    setIsDropDownOpen(false)
    setIsModalOpen(true)
    setActiveModal('Settings')
  }

  const handleCategoryClick = (e: MouseEvent) => {
    e.stopPropagation()
    setIsDropDownOpen(false)
    setShowCategory(true)
  }

  const handleUserCardClick = (id: number) => {
    switch (id) {
      case 1:
        handleMyPlan()
        break
      case 2:
        handleMyCopilot()
        break
      case 3:
        handleSettings()
        break
    }
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
                  onClick={() => handleUserCardClick(item.id)}
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
            motionClassName={clsx(
              activeModal !== 'MyPlan' && 'w-2/5 h-4/5 max-lg:w-4/5 max-md:w-full max-sm:w-full max-sm:h-5/6',
            )}
            onClose={() => setIsModalOpen(false)}
          >
            {activeModal === 'MyPlan' && <ModalPlan setIsModalOpen={setIsModalOpen}/>}
            {activeModal === 'Settings' && <ModalSettings setIsModalOpen={setIsModalOpen}/>}
            {activeModal === 'MyCopilot' && <ModalCopilot setIsModalOpen={setIsModalOpen}/>}
          </Modal>
        )
      }

      {/* global category model dialog */}
      {
        showCategory && (
          <Modal
            motionClassName={clsx(
              activeModal !== 'MyPlan' && 'w-2/5 h-4/5 max-lg:w-4/5 max-md:w-full max-sm:w-full max-sm:h-5/6',
            )}
            onClose={() => setShowCategory(false)}
          >
            <ModalCategory setShowCategory={setShowCategory}/>
          </Modal>
        )
      }

      <div
        ref={triggerDivRef}
        onClick={() => setIsDropDownOpen(!isDropDownOpen)}
        className={clsx(
          'w-full h-[48px] p-2 rounded-lg',
          'cursor-pointer transition-change',
          'flex ite ms-center justify-between gap-4',
          hoverOnParent && 'hover:bg-gray-500/10',
          isDropDownOpen && 'bg-gray-500/10',
        )}
      >
        <div className={'flex gap-4 items-center p-2'}>
          <div onClick={(e: MouseEvent) => e.stopPropagation()}>
            <UserButton afterSignOutUrl={'/'}/>
          </div>
          <p>{user?.firstName}</p>
        </div>

        <div
          className={clsx(
            'flex items-center p-2 rounded-lg',
            'hover:bg-chatpage-menu-hover transition-change'
          )}
          onClick={handleCategoryClick}
          onMouseEnter={() => setHoverOnParent(false)}
          onMouseLeave={() => setHoverOnParent(true)}
        >
          <CategoryIcon width={18} height={18}/>
        </div>
      </div>
    </>
  )
}
