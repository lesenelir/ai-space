import { UserButton } from '@clerk/nextjs'

export default function ChatPage() {

  const tt = async () => {
    const Response = await fetch('/api/example', {
      method: 'POST',
    })

    const data = await Response.json()

    console.log(data)
  }

  return (
    <>
      <header>
        <UserButton afterSignOutUrl={'/'}/>
      </header>
      Chat Page


      <button className={'bg-blue-500'} onClick={tt}>Test</button>
    </>
  )
}
