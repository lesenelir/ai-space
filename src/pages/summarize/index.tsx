import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { SummarizeMenu } from '@/components/summarize'
import SummarizeMessage from '@/components/summarize/SummarizeMessage'

export default function SummarizePage() {
  return (
    <>
      <Head>
        <title>AI Space - Summarize</title>
        <meta name='description' content='Lesenelir OpenAI Summarize Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-screen h-screen flex flex-row'}>
        <SummarizeMenu/>
        <SummarizeMessage/>
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
