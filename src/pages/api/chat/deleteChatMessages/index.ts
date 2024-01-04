import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleDeleteChatMessages = async (req: NextApiRequest, res: NextApiResponse) => {
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

    await prisma.chatMessage.deleteMany({
      where: {
        chat_item_primary_id: chatItem!.id,
        user_primary_id: user!.id
      }
    })

    const chatMessagesFromUuid = await prisma.chatMessage.findMany({
      where: {
        chat_item_primary_id: chatItem!.id,
        user_primary_id: user!.id
      }
    })

    const chatMessages = JSON.parse(JSON.stringify(toCamelArr(chatMessagesFromUuid)))

    return res.status(200).json({ status: 'Delete Chat Messages successfully!', chatMessages })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleDeleteChatMessages)
export default router.handler()
