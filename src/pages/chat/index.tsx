import Head from 'next/head'
import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Menu from '@/components/chat/Menu'
import Message from '@/components/chat/Message'

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
        <Message/>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
      ]))
    }
  }
}
