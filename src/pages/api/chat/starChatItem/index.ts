import { PrismaClient } from '@prisma/client'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { toCamelArr } from '@/utils'

const prisma = new PrismaClient()
const router = createRouter<NextApiRequest, NextApiResponse>()

const handleStarChatItem = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { item_uuid } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const chatItem = await prisma.chatItem.findUnique({
      where: {
        item_uuid
      }
    })

    if (!chatItem) {
      return res.status(404).json({message: 'ChatItem not found'})
    }

    await prisma.chatItem.update({
      where: {
        item_uuid
      },
      data: {
        isStarred: !chatItem.isStarred
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

    return res.status(200).json({ message: 'StarChatItem.', chatItems })
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

router.post(handleStarChatItem)
export default router.handler()
