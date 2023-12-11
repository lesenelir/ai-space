import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import XIcon from '@/components/icons/XIcon'
import CheckIcon from '@/components/icons/CheckIcon'

interface IProps {
  setIsModalOpen: (isModalOpen: boolean) => void
}

export default function ModalPlan(props: IProps) {
  const {setIsModalOpen} = props
  const {t} = useTranslation('common')
  const router = useRouter()

  return (
    <div className={'w-full h-full flex flex-col text-white'}>
      {/* header */}
      <div className={'h-1/4 p-4 flex flex-row justify-between rounded-t-md bg-chatpage-menu-hover'}>
        <div className={'flex flex-col justify-between'}>
          <p className={'font-medium text-2xl'}>{t('chatPage.menu.plan')}</p>
          <p className={'font-medium text-2xl'}>{t('chatPage.menu.upgradeText')}</p>
        </div>
        <XIcon
          width={24}
          height={24}
          className={'h-1/4 cursor-pointer text-gray-200/70 hover:text-gray-200 transition-change'}
          onClick={() => setIsModalOpen(false)}
        />
      </div>

      {/* main */}
      <div className={'flex-1 p-4 overflow-y-auto custom-scrollbar'}>
        <div className={'flex items-center gap-3'}>
          <Image
            width={36}
            height={36}
            src={'/leaf.svg'}
            alt={'Leaf'}
          />
          <span className={'text-xl'}>{t('chatPage.menu.plus')}</span>
        </div>
        <p className={'my-2 text-gray-200/40'}>{t('chatPage.menu.credit')}</p>

        <button
          className={`
            w-full text-lg h-1/4 rounded-md bg-green-800/80 hover:bg-green-800/70 hover:text-gray-200
          `}
          onClick={() => console.log('Todo: Go to plus page')}
        >
          {t('chatPage.menu.plusLink')}
        </button>

        <div className={'flex gap-2 my-2'}>
          <CheckIcon width={16} height={16}/>
          <p className={'text-sm'}>{t('chatPage.menu.plus1')}</p>
        </div>
        <div className={'flex gap-2 my-2'}>
          <CheckIcon width={16} height={16}/>
          <p className={'text-sm'}>{t('chatPage.menu.plus2')}</p>
        </div>
        <div className={'flex gap-2 my-2'}>
          <CheckIcon width={16} height={16}/>
          <p className={'text-sm'}>{t('chatPage.menu.plus3')}</p>
        </div>
      </div>

      {/* footer */}
      <div className={'h-1/6 flex justify-center items-center p-2 text-sm rounded-b-md bg-chatpage-menu-hover'}>
        <p>
          {t('chatPage.menu.footer')} {' '}
          <span className={'underline cursor-pointer'} onClick={() => router.push('/#research')}>
            {t('chatPage.menu.footerLink')}
          </span>
        </p>
      </div>
    </div>
  )
}
