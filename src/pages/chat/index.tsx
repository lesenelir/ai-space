import Head from 'next/head'
import { useSetAtom } from 'jotai'
import { type GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { TChatItem } from '@/types'
import { chatItemsAtom } from '@/atoms'
import Menu from '@/components/chat/Menu'
import Message from '@/components/chat/Message'
import toCamel from '@/utils/toCamel'

const prisma = new PrismaClient()

interface IProps {
  chatItems: TChatItem[]
}

export default function ChatPage(props: IProps) {
  const { chatItems } = props
  const setChatItems = useSetAtom(chatItemsAtom)

  setChatItems(chatItems) // useEffect

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

  // userId exists, then fetch chat items
  const userWithChatItems = await prisma.user.findUnique({
    where: {
      userId
    },
    include: {
      chatItems: true
    }
  })

  const chatItems = JSON.parse(JSON.stringify(toCamel(userWithChatItems!.chatItems)))
  console.log(chatItems)

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      chatItems
    }
  }
}
