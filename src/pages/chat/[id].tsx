import Head from 'next/head'
import { useRouter } from 'next/router'
import { useHydrateAtoms } from 'jotai/utils'
import { getAuth } from '@clerk/nextjs/server'
import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import prisma from '@/utils/db.server'
import Menu from '@/components/chat/Menu'
import Message from '@/components/chat/Message'
import { TChatItem } from '@/types'
import { chatItemsAtom } from '@/atoms'
import { toCamelArr } from '@/utils/toCamel'

interface IProps {
  chatItems: TChatItem[]
}

export default function ChatPage(props: IProps) {
  const { chatItems } = props
  const router = useRouter()

  // hydrate chatItems ==> initialize from the server data
  useHydrateAtoms([
    [chatItemsAtom, chatItems],
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

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      chatItems
    }
  }
}
