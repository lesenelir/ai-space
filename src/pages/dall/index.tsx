import Head from 'next/head'
import { UserButton } from '@clerk/nextjs'

export default function DallPage() {
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
    </>
  )
}
