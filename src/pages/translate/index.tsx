import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function SummarizePage() {
  return (
    <>
      <Head>
        <title>AI Space - Translate</title>
        <meta name='description' content='Lesenelir OpenAI Translate Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-full min-h-screen bg-gray-100 dark:bg-dallpage-dark-background'}>
        Translate
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
