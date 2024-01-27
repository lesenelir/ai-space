import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import FirstContentArea from '@/components/home/FirstContentArea'
import SecondContentArea from '@/components/home/SecondContentArea'
import ThirdContentArea from '@/components/home/ThirdContentArea'
import FourthContentArea from '@/components/home/FourthContentArea'
import FifthContentArea from '@/components/home/FifthContentArea'

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Space</title>
        <meta name='description' content='Lesenelir OpenAI Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div id={'homepage'}>
        {/* First Content Area */}
        <FirstContentArea/>

        {/* Second Content Area */}
        <SecondContentArea/>

        {/* Third Content Area */}
        <ThirdContentArea/>

        {/* Fourth Content Area */}
        <FourthContentArea/>

        {/* Fifth Content Area */}
        <FifthContentArea/>
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

