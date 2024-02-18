import { v4 as uuidv4 } from 'uuid'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

// Create an OpenAI API client (that's edge-friendly!)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || ''
// })

const handleGenerateDuplicateChat = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { chatUuid } = req.body

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
        item_uuid: chatUuid
      }
    })

    const newChatItem = await prisma.chatItem.create({
      data: {
        item_name: chatItem!.item_name,
        item_uuid: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
        user_primary_id: chatItem!.user_primary_id,
        model_primary_id: chatItem!.model_primary_id,
      }
    })

    const chatMessages = await prisma.chatMessage.findMany({
      where: {
        chat_item_primary_id: chatItem!.id
      }
    })

    for (const chatMessage of chatMessages) {
      await prisma.chatMessage.create({
        data: {
          message_type: chatMessage.message_type,
          message_content: chatMessage.message_content,
          message_role: chatMessage.message_role,
          created_at: new Date(),
          cost_tokens: chatMessage.cost_tokens,
          image_urls: chatMessage.image_urls!,
          user_primary_id: user!.id,
          chat_item_primary_id: newChatItem!.id
        }
      })
    }

    const userWithChatItems = await prisma.user.findUnique({
      where: {
        userId
      },
      include: {
        chatItems: true
      }
    })

    const chatItems = toCamelArr(userWithChatItems!.chatItems)

    return res.status(200).json({ status: 'Duplicate Chat', newChatItem, chatItems })
  } catch (e) {
    return res.status(500).json({error: e})
  }
}

router.post(handleGenerateDuplicateChat)
export default router.handler()
