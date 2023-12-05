import Head from 'next/head'
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>AI Space - Sign In</title>
        <meta name='description' content='Lesenelir OpenAI Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'h-screen flex justify-center items-center'}>
        <SignIn/>
      </div>
    </>
  )
}
