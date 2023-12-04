import { Inter } from 'next/font/google'

import FirstContentArea from '@/components/home/FirstContentArea'
import FourthContentArea from '@/components/home/FourthContentArea'
import FifthContentArea from '@/components/home/FifthContentArea'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={inter.className}>

      {/* First Content Area */}
      <FirstContentArea/>

      {/* Fourth Content Area */}
      <FourthContentArea/>

      {/* Fifth Content Area */}
      <FifthContentArea/>

    </div>
  )
}
