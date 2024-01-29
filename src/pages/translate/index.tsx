import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import TranslateMenu from '@/components/translate/TranslateMenu'
import TranslateMessage from '@/components/translate/TranslateMessage'

export default function SummarizePage() {
  return (
    <>
      <Head>
        <title>AI Space - Translate</title>
        <meta name='description' content='Lesenelir OpenAI Translate Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-screen h-screen flex flex-row'}>
        <TranslateMenu/>
        <TranslateMessage/>
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
