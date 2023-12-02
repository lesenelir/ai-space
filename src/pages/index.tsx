import { Inter } from 'next/font/google'

import FirstContentArea from '@/components/home/FirstContentArea'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={inter.className}>

      {/* First Content Area */}
      <FirstContentArea/>

      {/* Second Content Area */}



      {/* Third Content Area */}

    </div>
  )
}
