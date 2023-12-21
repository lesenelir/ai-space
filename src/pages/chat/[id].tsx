import Head from 'next/head'
import { useRouter } from 'next/router'
import { useHydrateAtoms } from 'jotai/utils'
import { getAuth } from '@clerk/nextjs/server'
import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import prisma from '@/utils/db.server'
import Menu from '@/components/chat/Menu'
import Message from '@/components/chat/Message'
import type { TChatItem, TModel } from '@/types'
import {
  chatItemsAtom,
  isUserSaveGeminiKeyAtom,
  isUserSaveOpenAIKeyAtom,
  modelsAtom,
  userGeminiKeyAtom,
  userOpenAIKeyAtom
} from '@/atoms'
import { toCamelArr } from '@/utils/toCamel'

interface IProps {
  chatItems: TChatItem[]
  models: TModel[]
  isUserSaveOpenAIKey: boolean
  isUserSaveGeminiKey: boolean
  userOpenAIKey: string
  userGeminiKey: string
}

export default function ChatPage(props: IProps) {
  const { chatItems, models, isUserSaveOpenAIKey, isUserSaveGeminiKey, userOpenAIKey, userGeminiKey } = props
  const router = useRouter()

  // hydrate chatItems ==> initialize from the server data
  useHydrateAtoms([
    [chatItemsAtom, chatItems],
    [modelsAtom, models],
    [isUserSaveOpenAIKeyAtom, isUserSaveOpenAIKey],
    [isUserSaveGeminiKeyAtom, isUserSaveGeminiKey],
    [userOpenAIKeyAtom, userOpenAIKey],
    [userGeminiKeyAtom, userGeminiKey]
  ])

  const currentChatUUID = router.query.id as string
  const currentChat = chatItems.find(item => item.itemUuid === currentChatUUID) as TChatItem // no need to useMemo,
  // because it will be re-rendered when the currentChatUUID changes.
  // => must be re-rendered, because the currentChatUUID is from the router.query.id, which is from the url.
  const currentChatName = currentChat?.itemName

  return (
    <>
      <Head>
        <title>{currentChatName}</title>
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

  const models = toCamelArr(await prisma.model.findMany())

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
      chatItems,
      models,
      isUserSaveOpenAIKey: isUserSaveOpenAIKey.length > 0,
      isUserSaveGeminiKey: isUserSaveGeminiKey.length > 0,
      userOpenAIKey: isUserSaveOpenAIKey.length > 0 ? isUserSaveOpenAIKey[0].api_key : '',
      userGeminiKey: isUserSaveGeminiKey.length > 0 ? isUserSaveGeminiKey[0].api_key : '',
    }
  }
}
