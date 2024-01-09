import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import { encodingForModel } from 'js-tiktoken'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleSaveRobotMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { completion, chat_item_uuid, model_name } = req.body

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

    // update chat item updated_at
    await prisma.chatItem.update({
      where: {
        item_uuid: chat_item_uuid
      },
      data: {
        updated_at: new Date()
      }
    })

    // create a chat message
    await prisma.chatMessage.create({
      data: {
        message_type: 'text',
        message_content: completion,
        message_role: 'assistant',
        cost_tokens: encodingForModel(model_name).encode(completion).length,
        image_urls: [], // empty array
        created_at: new Date(),
        user_primary_id: user!.id,
        chat_item_primary_id: chatItem!.id
      }
    })

    return res.status(200).json({ status: 'save robot message' })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleSaveRobotMessage)
export default router.handler()
