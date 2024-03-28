import cookie from 'cookie'
import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import MusicMenu from '@/components/music/MusicMenu'
import MusicMessage from '@/components/music/MusicMessage'

interface IProps {
  initialWidth: number
}

export default function MusicPage(props: IProps) {
  const { initialWidth } = props

  return (
    <>
      <Head>
        <title>AI Space - Music</title>
        <meta name='description' content='Lesenelir OpenAI TTS Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-screen h-screen flex flex-row'}>
        <MusicMenu initialWidth={initialWidth}/>
        <MusicMessage/>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = ctx.req.headers.cookie ? cookie.parse(ctx.req.headers.cookie) : {}
  const initialWidth = cookies.resizableWidth ? parseInt(cookies.resizableWidth, 10) : 320

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      initialWidth
    }
  }
}
