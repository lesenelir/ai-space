import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Navbar from '@/components/dall/Navbar'
import MainContent from '@/components/dall/MainContent'

export default function DallPage() {
  return (
    <>
      <Head>
        <title>AI Space - Dall·E</title>
        <meta name='description' content='Lesenelir OpenAI DallE Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-full min-h-screen bg-gray-100 dark:bg-dallpage-dark-background'}>
        <Navbar/>
        <MainContent/>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
    }
  }
}
