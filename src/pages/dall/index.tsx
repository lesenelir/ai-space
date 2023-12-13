import Head from 'next/head'
import { UserButton } from '@clerk/nextjs'

export default function DallPage() {

  const request = async () => {
    const Response = await fetch('/api/example', {
      method: 'POST',
    })

    const data = await Response.json()

    console.log(data)
  }

  return (
    <>
      <Head>
        <title>AI Space - Dall</title>
        <meta name='description' content='Lesenelir OpenAI Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <header>
        <UserButton afterSignOutUrl={'/'}/>
      </header>
      Dall page

      <button className={'w-12 p-2 bg-blue-400 rounded-md ml-6'} onClick={request}>
        click
      </button>
    </>
  )
}
