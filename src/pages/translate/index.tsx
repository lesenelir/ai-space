import Head from 'next/head'
import prisma from '@/utils/db.server'
import { useHydrateAtoms } from 'jotai/utils'
import { getAuth } from '@clerk/nextjs/server'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { toCamelArr } from '@/utils'
import { modelsAtom } from '@/atoms'
import type { TModel } from '@/types'
import TranslateMenu from '@/components/translate/TranslateMenu'
import TranslateMessage from '@/components/translate/TranslateMessage'

interface IProps {
  models: TModel[]
}

export default function SummarizePage(props: IProps) {
  const { models } = props

  useHydrateAtoms([
    [modelsAtom, models]
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

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      models
    }
  }
}
