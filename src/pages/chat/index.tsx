import Head from 'next/head'

import Menu from '@/components/chat/Menu'
import Content from '@/components/chat/Content'

export default function chatPage() {
  return (
    <>
      <Head>
        <title>AI Space - Chat</title>
        <meta name='description' content='Lesenelir OpenAI Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-full h-screen flex flex-row'}>
        <Menu/>
        <Content/>
      </div>
    </>
  )
}

// import { UserButton } from '@clerk/nextjs'
//
// export default function ChatPage() {
//
//   const tt = async () => {
//     const Response = await fetch('/api/example', {
//       method: 'POST',
//     })
//
//     const data = await Response.json()
//
//     console.log(data)
//   }
//
//   return (
//     <>
//       <header>
//         <UserButton afterSignOutUrl={'/'}/>
//       </header>
//       Chat Page
//
//
//       <button className={'bg-blue-500'} onClick={tt}>Test</button>
//     </>
//   )
// }
