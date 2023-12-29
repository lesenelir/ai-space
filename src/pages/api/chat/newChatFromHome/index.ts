import { v4 as uuidv4 } from 'uuid'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleNewChatFromHome = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { model_primary_id, message, costTokens } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId,
      }
    })

    // create a new chat item
    const newChatItem = await prisma.chatItem.create({
      data: {
        item_name: 'New Chat Home',
        item_uuid: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
        user_primary_id: user!.id,
        model_primary_id: model_primary_id,  // from the request body, user selected model
      }
    })

    // insert the input into the chat item
    await prisma.chatMessage.create({
      data: {
        message_type: 'text',
        message_content: message,
        message_role: 'user',
        created_at: new Date(),
        cost_tokens: costTokens,
        user_primary_id: user!.id,
        chat_item_primary_id: newChatItem.id
      }
    })

    const userWithChatItems = await prisma.user.findUnique({
      where: {
        userId
      },
      include: {
        chatItems: true
      }
    })

    const chatItems = toCamelArr(userWithChatItems!.chatItems)

    return res.status(200).json({ status: 'New Chat Item From Chat Home Page', newChatItem, chatItems })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleNewChatFromHome)
export default router.handler()

