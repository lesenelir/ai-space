import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleExportData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const chatItemWithMessages = await prisma.chatItem.findMany({
      include: {
        ChatMessage: true
      }
    })

    return res.status(200).json({ status: 'Exported data successfully', chatItemWithMessages })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleExportData)
export default router.handler()
