import PlansCard from '@/components/home/FourthContentArea/PlansCard'

import { Ephesis } from 'next/font/google'

const ephesis = Ephesis({ subsets: ['latin'], weight: '400' })

export default function FourthContentArea() {
  return (
    <div className={'min-h-[70vh] lg:px-32 px-8 py-4 max-sm:px-4 bg-fuchsia-800'} id={'pricing'}>
      <div className={'border mt-12'}/>

      <h1 className={`text-6xl font-semibold text-white my-6 ${ephesis.className}`}>Pricing</h1>

      {/* Content */}
      <div className={'flex md:flex-row max-md:flex-col gap-4 justify-between'}>
        {/* Left */}
        <PlansCard main={'Free'} price={'$0 / month'} buttonText={'Try on Web'} />

        {/* Right */}
        <PlansCard main={'Plus'} price={'$ Credit'} buttonText={'Get Started'} />
      </div>
    </div>
  )
}
