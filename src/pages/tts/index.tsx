import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import TTSMenu from '@/components/tts/TTSMenu'
import TTSMessage from '@/components/tts/TTSMessage'

export default function TTSPage() {
  return (
    <>
      <Head>
        <title>AI Space - TTS</title>
        <meta name='description' content='Lesenelir OpenAI TTS Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-screen h-screen flex flex-row'}>
        <TTSMenu/>
        <TTSMessage/>
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
