import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function SummarizePage() {
  return (
    <>
      <Head>
        <title>AI Space - Summarize</title>
        <meta name='description' content='Lesenelir OpenAI Summarize Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-full min-h-screen bg-gray-100 dark:bg-dallpage-dark-background'}>
        Summarize
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
