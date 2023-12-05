import Head from 'next/head'
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>AI Space - Sign Up</title>
        <meta name='description' content='Lesenelir OpenAI Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'h-screen flex justify-center items-center'}>
        <SignUp/>
      </div>
    </>
  )
}
