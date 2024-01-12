import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleEmptyChatMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { item_uuid } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    // find user
    const user = await prisma.user.findUnique({
      where: {
        userId
      }
    })

    // find chat item
    const chatItem = await prisma.chatItem.findUnique({
      where: {
        item_uuid
      }
    })

    if (!chatItem) {
      return res.status(400).json({ status: 'Chat item not found' })
    }

    // delete last chat message
    const lastChatMessage = await prisma.chatMessage.findFirst({
      where: {
        chat_item_primary_id: chatItem!.id,
        user_primary_id: user!.id
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    if (lastChatMessage) {
      await prisma.chatMessage.delete({
        where: {
          id: lastChatMessage.id
        }
      })
    }

    const chatMessagesFromUuid = await prisma.chatMessage.findMany({
      where: {
        chat_item_primary_id: chatItem!.id,
        user_primary_id: user!.id
      }
    })

    const chatMessages = JSON.parse(JSON.stringify(toCamelArr(chatMessagesFromUuid)))

    return res.status(200).json({ status: 'Last chat message deleted successfully', chatMessages })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleEmptyChatMessage)
export default router.handler()
