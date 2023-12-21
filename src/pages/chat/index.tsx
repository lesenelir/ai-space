import Head from 'next/head'
import { type GetServerSideProps } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { useHydrateAtoms } from 'jotai/utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import prisma from '@/utils/db.server'
import Menu from '@/components/chat/Menu'
import Message from '@/components/chat/Message'
import type { TChatItem, TModel } from '@/types'
import { chatItemsAtom, isUserSaveOpenAIKeyAtom, modelsAtom } from '@/atoms'
import { toCamelArr } from '@/utils/toCamel'

interface IProps {
  chatItems: TChatItem[]
  models: TModel[]
  isUserSaveOpenAIKey: boolean
}

export default function ChatPage(props: IProps) {
  const { chatItems, models, isUserSaveOpenAIKey } = props

  // setChatItems(chatItems)  // wrong, because setState is the effect of render
  // useEffect + setChatItems(chatItems) // wrong, because it will wait for the first render, wasting ssr advantage

  // hydrate chatItems ==> initialize from the server data
  useHydrateAtoms([
    [chatItemsAtom, chatItems],
    [modelsAtom, models],  // this data will never change.
    [isUserSaveOpenAIKeyAtom, isUserSaveOpenAIKey]
  ])

  return (
    <>
      <Head>
        <title>AI Space - Chat</title>
        <meta name='description' content='Lesenelir OpenAI Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-full h-screen flex flex-row'}>
        <Menu/>
        <Message/>
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

  const user = await prisma.user.findUnique({
    where: {
      userId
    }
  })

  // userId exists, then fetch chat items
  const userWithChatItems = await prisma.user.findUnique({
    where: {
      userId
    },
    include: {
      chatItems: true
    }
  })

  const chatItems = JSON.parse(JSON.stringify(toCamelArr(userWithChatItems!.chatItems)))

  const models = toCamelArr(await prisma.model.findMany()) // This data will never change.
  // Admin controls model table.

  const isUserSaveKey = await prisma.userAPIKey.findMany({
    where: {
      user_primary_id: user!.id,
      model_primary_id: 1
    }
  })

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      chatItems,
      models,
      isUserSaveOpenAIKey: isUserSaveKey.length > 0
    }
  }
}
