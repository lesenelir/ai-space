import { Inter } from 'next/font/google'

import FirstContentArea from '@/components/home/FirstContentArea'
import SecondContentArea from '@/components/home/SecondContentArea'
import ThirdContentArea from '@/components/home/ThirdContentArea'

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

    </div>
  )
}
