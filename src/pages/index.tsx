import { Inter } from 'next/font/google'

import FirstContentArea from '@/components/home/FirstContentArea'
import SecondContentArea from '@/components/home/SecondContentArea'
import ThirdContentArea from '@/components/home/ThirdContentArea'
import FourthContentArea from '@/components/home/FourthContentArea'
import FifthContentArea from '@/components/home/FifthContentArea'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={inter.className}>

      {/* First Content Area */}
      <FirstContentArea/>

      {/* Second Content Area */}
      <SecondContentArea/>

      {/* Third Content Area */}
      <ThirdContentArea/>

      {/* Fourth Content Area */}
      <FourthContentArea/>

      {/* Fifth Content Area */}
      <FifthContentArea/>

    </div>
  )
}
