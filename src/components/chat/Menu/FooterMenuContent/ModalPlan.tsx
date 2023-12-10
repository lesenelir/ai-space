import Image from 'next/image'
import { useRouter } from 'next/router'

import XIcon from '@/components/icons/XIcon'
import CheckIcon from '@/components/icons/CheckIcon'

export default function ModalPlan() {
  const router = useRouter()

  return (
    <div className={'w-full h-full flex flex-col text-white'}>
      {/* header */}
      <div className={'h-1/4 p-4 flex flex-row justify-between rounded-t-md bg-chatpage-menu-hover'}>
        <div className={'flex flex-col justify-between'}>
          <p className={'font-medium text-2xl'}>My Plan</p>
          <p className={'font-medium text-2xl'}>Upgrade your plan</p>
        </div>
        <XIcon width={24} height={24} className={'h-1/4 cursor-pointer text-gray-200/70 hover:text-gray-200 transition-change'}/>
      </div>

      {/* main */}
      <div className={'flex-1 p-4'}>
        <div className={'flex items-center gap-3'}>
          <Image
            width={36}
            height={36}
            src={'/leaf.svg'}
            alt={'Leaf'}
          />
          <span className={'text-xl'}>Plus</span>
        </div>
        <p className={'my-2 text-gray-200/40'}>Credit: USD $5/Once</p>

        <button
          className={`
            w-full text-lg h-1/4 rounded-md bg-green-800/80 hover:bg-green-800/70 hover:text-gray-200
          `}
          onClick={() => console.log('Todo: Go to plus page')}
        >
          Go to Plus
        </button>

        <div className={'flex gap-2 my-2'}>
          <CheckIcon width={16} height={16}/>
          <p className={'text-sm'}>Use credit points to substitute API_Key</p>
        </div>
        <div className={'flex gap-2 my-2'}>
          <CheckIcon width={16} height={16}/>
          <p className={'text-sm'}>Charge only 0.3 more than the official fee</p>
        </div>
        <div className={'flex gap-2 my-2'}>
          <CheckIcon width={16} height={16}/>
          <p className={'text-sm'}>Get 100 credit points for free when you register</p>
        </div>
      </div>

      {/* footer */}
      <div className={'h-1/6 flex justify-center items-center p-2 text-sm rounded-b-md bg-chatpage-menu-hover'}>
        <p>
          Need more capabilities? See {' '}
          <span className={'underline cursor-pointer'} onClick={() => router.push('/#research')}>AI Space Website</span>
        </p>
      </div>
    </div>
  )
}
