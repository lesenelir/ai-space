import { UserButton } from '@clerk/nextjs'

export default function DallPage() {
  return (
    <>
      <header>
        <UserButton afterSignOutUrl={'/'}/>
      </header>
      Dall page
    </>
  )
}
