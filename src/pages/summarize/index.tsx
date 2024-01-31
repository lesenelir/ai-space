import Head from 'next/head'
import prisma from '@/utils/db.server'
import { useHydrateAtoms } from 'jotai/utils'
import { getAuth } from '@clerk/nextjs/server'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { toCamelArr } from '@/utils'
import { modelsAtom } from '@/atoms'
import { type TModel } from '@/types'
import { SummarizeMenu } from '@/components/summarize'
import SummarizeMessage from '@/components/summarize/SummarizeMessage'

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
        <title>AI Space - Summarize</title>
        <meta name='description' content='Lesenelir OpenAI Summarize Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-screen h-screen flex flex-row'}>
        <SummarizeMenu/>
        <SummarizeMessage/>
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

  const models = toCamelArr(await prisma.model.findMany()) // This data will never change.

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      models
    }
  }
}
