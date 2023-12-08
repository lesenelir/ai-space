import { UserButton } from '@clerk/nextjs'

export default function ThirdMenuContent() {
  return (
    <div className={'w-full h-[48px] p-2 rounded-lg cursor-pointer transition-change hover:bg-gray-500/10'}>
      <UserButton afterSignOutUrl={'/'}/>
    </div>
  )
}
