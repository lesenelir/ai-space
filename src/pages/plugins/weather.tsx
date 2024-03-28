import cookie from 'cookie'
import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import WeatherMenu from '@/components/weather/WeatherMenu'
import WeatherMessage from '@/components/weather/WeatherMessage'

interface IProps {
  initialWidth: number
}

export default function MusicPage(props: IProps) {
  const { initialWidth } = props

  return (
    <>
      <Head>
        <title>AI Space - Weather</title>
        <meta name='description' content='Lesenelir OpenAI TTS Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-screen h-screen flex flex-row'}>
        <WeatherMenu initialWidth={initialWidth}/>
        <WeatherMessage/>
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
