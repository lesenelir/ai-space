import cookie from 'cookie'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useHydrateAtoms } from 'jotai/utils'
import { getAuth } from '@clerk/nextjs/server'
import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import prisma from '@/utils/db.server'
import Menu from '@/components/chat/Menu'
import Message from '@/components/chat/Message'
import type { TChatItem, TChatMessages, TModel } from '@/types'
import { toCamelArr } from '@/utils/toCamel'
import {
  modelsAtom,
  chatItemsAtom,
  chatMessagesAtom,
  userGeminiKeyAtom,
  userOpenAIKeyAtom,
  isUserSaveOpenAIKeyAtom,
  isUserSaveGeminiKeyAtom,
} from '@/atoms'

interface IProps {
  initialWidth: number
  chatItems: TChatItem[]
  models: TModel[]
  isUserSaveOpenAIKey: boolean
  isUserSaveGeminiKey: boolean
  userOpenAIKey: string
  userGeminiKey: string
  chatMessages: TChatMessages[]
}

export default function ChatPage(props: IProps) {
  const {
    initialWidth,
    chatItems,
    models,
    isUserSaveOpenAIKey,
    isUserSaveGeminiKey,
    userOpenAIKey,
    userGeminiKey ,
    chatMessages
  } = props
  const router = useRouter()

  // hydrate chatItems ==> initialize from the server data
  useHydrateAtoms([
    [chatItemsAtom, chatItems],
    [modelsAtom, models],
    [isUserSaveOpenAIKeyAtom, isUserSaveOpenAIKey],
    [isUserSaveGeminiKeyAtom, isUserSaveGeminiKey],
    [userOpenAIKeyAtom, userOpenAIKey],
    [userGeminiKeyAtom, userGeminiKey],
    [chatMessagesAtom, chatMessages]
  ])

  const currentChatUUID = router.query.id as string
  const currentChat = chatItems.find(item => item.itemUuid === currentChatUUID) as TChatItem // no need to useMemo,
  // because it will be re-rendered when the currentChatUUID changes.
  // => must be re-rendered because the currentChatUUID is from the router.query.id, which is from the url.
  const currentChatName = currentChat?.itemName

  return (
    <>
      <Head>
        <title>{currentChatName}</title>
        <meta name='description' content='Lesenelir OpenAI Chat Project'/>
        <link rel='icon' href={`/favicon.ico`}/>
      </Head>

      <div className={'w-screen h-screen flex flex-row'}>
        <Menu initialWidth={initialWidth}/>
        <Message/>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req)
  const currentChatUuid = ctx.query.id as string

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
      model_primary_id: 4
    }
  })

  const chatItemFromUuid = await prisma.chatItem.findUnique({
    where: {
      item_uuid: currentChatUuid
    }
  })

  const chatMessagesUnSerialized = await prisma.chatMessage.findMany({
    where: {
      user_primary_id: user!.id,
      chat_item_primary_id: chatItemFromUuid!.id
    }
  })

  const chatMessages = JSON.parse(JSON.stringify(toCamelArr(chatMessagesUnSerialized)))

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      initialWidth,
      chatItems,
      models,
      isUserSaveOpenAIKey: isUserSaveOpenAIKey.length > 0,
      isUserSaveGeminiKey: isUserSaveGeminiKey.length > 0,
      userOpenAIKey: isUserSaveOpenAIKey.length > 0 ? isUserSaveOpenAIKey[0].api_key : '',
      userGeminiKey: isUserSaveGeminiKey.length > 0 ? isUserSaveGeminiKey[0].api_key : '',
      chatMessages
    }
  }
}
