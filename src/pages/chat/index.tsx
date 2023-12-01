import { UserButton } from '@clerk/nextjs'

export default function ChatPage() {
  return (
    <>
      <header>
        <UserButton afterSignOutUrl={'/'}/>
      </header>
      Chat Page
    </>
  )
}
