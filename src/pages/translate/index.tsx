import Head from 'next/head'
import prisma from '@/utils/db.server'
import { useHydrateAtoms } from 'jotai/utils'
import { getAuth } from '@clerk/nextjs/server'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { toCamelArr } from '@/utils'
import type { TModel } from '@/types'
import { modelsAtom, userGeminiKeyAtom, userOpenAIKeyAtom } from '@/atoms'
import TranslateMenu from '@/components/translate/TranslateMenu'
import TranslateMessage from '@/components/translate/TranslateMessage'

interface IProps {
  models: TModel[]
  userOpenAIKey: string
  userGeminiKey: string
}

export default function SummarizePage(props: IProps) {
  const { models, userOpenAIKey, userGeminiKey } = props

  useHydrateAtoms([
    [modelsAtom, models],
    [userOpenAIKeyAtom, userOpenAIKey],
    [userGeminiKeyAtom, userGeminiKey]
  ])

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
  const { userId } = getAuth(ctx.req)

  if (!userId) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const models = toCamelArr(await prisma.model.findMany())

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
      model_primary_id: 3
    }
  })

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      models,
      userOpenAIKey: isUserSaveOpenAIKey.length > 0 ? isUserSaveOpenAIKey[0].api_key : '',
      userGeminiKey: isUserSaveGeminiKey.length > 0 ? isUserSaveGeminiKey[0].api_key : '',
    }
  }
}
