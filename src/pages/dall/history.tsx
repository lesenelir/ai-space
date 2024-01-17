import Head from 'next/head'

import Navbar from '@/components/dall/Navbar'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function HistoryPage() {
  return (
    <>
      <Head>
        <title>History | Dall·E</title>
        <meta name='description' content='Lesenelir OpenAI DallE Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-full min-h-screen bg-gray-50 dark:bg-dallpage-dark-background'}>
        <Navbar/>
        history
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
