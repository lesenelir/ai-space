import { UserButton } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={`${inter.className} bg-blue-200`}>
      <header>
        <UserButton afterSignOutUrl={'/'}/>
      </header>
      hello
    </div>
  )
}
