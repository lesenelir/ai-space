import { v4 as uuidv4 } from 'uuid'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleNewChat = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { model_primary_id } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userId as string,
      }
    })

    // create a new chat item
    await prisma.chatItem.create({
      data: {
        item_name: 'New Chat',
        item_uuid: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
        user_primary_id: user!.id,
        model_primary_id: model_primary_id,  // from the request body, user selected model
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

    return res.status(200).json({ status: 'New Chat Item', chatItems })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleNewChat)
export default router.handler()
