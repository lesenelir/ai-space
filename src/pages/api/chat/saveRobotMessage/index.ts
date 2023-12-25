import { createRouter } from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleSaveRobotMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  // unprotected route [unsafe!], this route is for the edge runtime call only.
  const { completion, chat_item_uuid, userId } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId
      }
    })

    const chatItem = await prisma.chatItem.findUnique({
      where: {
        item_uuid: chat_item_uuid
      }
    })

    // create a chat message
    const ss = await prisma.chatMessage.create({
      data: {
        message_type: 'text',
        message_content: completion,
        message_role: 'assistant',
        created_at: new Date(),
        user_primary_id: user!.id,
        chat_item_primary_id: chatItem!.id
      }
    })
    console.log(ss)

    return res.status(200).json({ status: 'save user input' })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleSaveRobotMessage)
export default router.handler()