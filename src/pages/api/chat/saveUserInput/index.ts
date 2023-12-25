import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleSaveUserInput = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { message, chat_item_uuid } = req.body

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
    await prisma.chatMessage.create({
      data: {
        message_type: 'text',
        message_content: message,
        message_role: 'user',
        created_at: new Date(),
        user_primary_id: user!.id,
        chat_item_primary_id: chatItem!.id
      }
    })

    return res.status(200).json({ status: 'save user input' })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleSaveUserInput)
export default router.handler()
