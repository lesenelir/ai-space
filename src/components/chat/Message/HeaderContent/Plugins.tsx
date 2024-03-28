import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

import Modal from '@/components/ui/Modal'
import ModalPlugins from '@/components/chat/Message/HeaderContent/ModalPlugins'

export default function Plugins() {
  const { t } = useTranslation('common')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <div
      className={clsx(
        'w-fit text-sm p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-200',
        'hover-transition-change dark:border-gray-500 dark:hover:bg-gray-500/10',
      )}
      onClick={() => setIsModalOpen(!isModalOpen)}
    >
      <p>{t('chatPage.menu.plugins')}</p>

      {
        isModalOpen && (
          <Modal
            motionClassName={clsx(
              'w-2/5 h-1/3 max-lg:w-4/5 max-md:w-full max-sm:w-full max-sm:h-5/6 bg-white border',
            )}
            className={'bg-gray-300 bg-opacity-30 drop-shadow-lg'}
            onClose={() => setIsModalOpen(false)}
          >
            <ModalPlugins setIsModalOpen={setIsModalOpen}/>
          </Modal>
        )
      }
    </div>
  )
}
