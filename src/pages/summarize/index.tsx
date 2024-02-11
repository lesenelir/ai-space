import Head from 'next/head'
import prisma from '@/utils/db.server'
import { useHydrateAtoms } from 'jotai/utils'
import { getAuth } from '@clerk/nextjs/server'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { toCamelArr } from '@/utils'
import { type TModel } from '@/types'
import { modelsAtom, userGeminiKeyAtom, userOpenAIKeyAtom } from '@/atoms'
import { SummarizeMenu } from '@/components/summarize'
import SummarizeMessage from '@/components/summarize/SummarizeMessage'
import cookie from 'cookie'

interface IProps {
  initialWidth: number
  models: TModel[]
  userOpenAIKey: string
  userGeminiKey: string
}

export default function SummarizePage(props: IProps) {
  const { initialWidth, models, userOpenAIKey, userGeminiKey } = props

  useHydrateAtoms([
    [modelsAtom, models],
    [userOpenAIKeyAtom, userOpenAIKey],
    [userGeminiKeyAtom, userGeminiKey]
  ])

  return (
    <>
      <Head>
        <title>AI Space - Summarize</title>
        <meta name='description' content='Lesenelir OpenAI Summarize Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-screen h-screen flex flex-row'}>
        <SummarizeMenu initialWidth={initialWidth}/>
        <SummarizeMessage/>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req)

  const cookies = ctx.req.headers.cookie ? cookie.parse(ctx.req.headers.cookie) : {}
  const initialWidth = cookies.resizableWidth ? parseInt(cookies.resizableWidth, 10) : 320

  if (!userId) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const models = toCamelArr(await prisma.model.findMany()) // This data will never change.

  const user = await prisma.user.findUnique({
    where: {
      userId
    }
  })

  const isUserSaveOpenAIKey = await prisma.userAPIKey.findMany({
    where: {
      user_primary_id: user!.id,
      model_primary_id: 1
    }
  })

  const isUserSaveGeminiKey = await prisma.userAPIKey.findMany({
    where: {
      user_primary_id: user!.id,
      model_primary_id: 4
    }
  })

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      initialWidth,
      models,
      userOpenAIKey: isUserSaveOpenAIKey.length > 0 ? isUserSaveOpenAIKey[0].api_key : '',
      userGeminiKey: isUserSaveGeminiKey.length > 0 ? isUserSaveGeminiKey[0].api_key : '',
    }
  }
}
