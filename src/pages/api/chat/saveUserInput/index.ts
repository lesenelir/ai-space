import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import { encodingForModel } from 'js-tiktoken'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { toCamelArr } from '@/utils'
import { getModelName } from '@/utils/modelName'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleSaveUserInput = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { message, chat_item_uuid, image_urls } = req.body

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

    const modelName = getModelName(chatItem!.model_primary_id)
    const enc = encodingForModel(modelName as any)
    const costTokens = enc.encode(message).length

    // update chat item updated_at
    await prisma.chatItem.update({
      where: {
        item_uuid: chat_item_uuid
      },
      data: {
        updated_at: new Date()
      }
    })

    // create a chat message (main)
    await prisma.chatMessage.create({
      data: {
        message_type: 'text',
        message_content: message,
        message_role: 'user',
        created_at: new Date(),
        cost_tokens: costTokens,
        image_urls: image_urls, // empty array or array of urls
        user_primary_id: user!.id,
        chat_item_primary_id: chatItem!.id
      }
    })

    // update chatItemsLists
    const userWithChatItems = await prisma.user.findUnique({
      where: {
        userId
      },
      include: {
        chatItems: true
      }
    })

    const chatItems = JSON.parse(JSON.stringify(toCamelArr(userWithChatItems!.chatItems)))

    return res.status(200).json({ status: 'save user input', chatItems })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleSaveUserInput)
export default router.handler()
