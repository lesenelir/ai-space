import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleUpdateChatName = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { item_uuid, item_name } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    // Update the item_name of the chatItem identified by item_uuid
    await prisma.chatItem.update({
      where: {item_uuid},
      data: {item_name}
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

    return res.status(200).json({ message: 'Item name updated.', chatItems })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleUpdateChatName)
export default router.handler()
