import { UserButton } from '@clerk/nextjs'

export default function ThirdMenuContent() {
  return (
    <div className={'w-full h-[48px] p-2 rounded-lg cursor-pointer hover:bg-chatpage-menu-hover'}>
      <UserButton afterSignOutUrl={'/'}/>
    </div>
  )
}
