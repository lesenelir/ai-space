import Head from 'next/head'
// import { useRouter } from 'next/router'

import Navbar from '@/components/dall/Navbar'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function DallPage() {
  // const router = useRouter()

  return (
    <>
      <Head>
        <title>AI Space - Dall·E</title>
        <meta name='description' content='Lesenelir OpenAI DallE Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-full min-h-screen bg-gray-50 dark:bg-dallpage-dark-background'}>
        <Navbar/>
        {/*<div>*/}
        {/*  hello world*/}
        {/*</div>*/}
      </div>

      {/*<div className={'fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex gap-2'}>*/}
      {/*  <p className={'self-center'}>This page is being built.</p>*/}
      {/*  <button*/}
      {/*    className={'w-fit  border px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 hover-transition-change'}*/}
      {/*    onClick={() => router.push('/')}*/}
      {/*  >*/}
      {/*    back*/}
      {/*  </button>*/}
      {/*</div>*/}
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
