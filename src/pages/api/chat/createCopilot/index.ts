import { v4 as uuidv4 } from 'uuid'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import { encodingForModel } from 'js-tiktoken'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { getModelName, toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleCreateCopilot = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { copilotName, copilotPrompt, modelPrimaryId } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userId as string,
      }
    })

    const newChatItem = await prisma.chatItem.create({
      data: {
        item_name: copilotName,
        item_uuid: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
        user_primary_id: user!.id,
        model_primary_id: modelPrimaryId,  // default use model 2 for copilot, GPT-4 Turbo
      }
    })

    const modelName = getModelName(modelPrimaryId)
    const enc = encodingForModel(modelName as any)
    const costTokens = enc.encode(copilotPrompt).length

    // insert the input into the chat item
    await prisma.chatMessage.create({
      data: {
        message_type: 'text',
        message_content: copilotPrompt,
        message_role: 'system',
        created_at: new Date(),
        cost_tokens: costTokens,
        image_urls: [], // empty array
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

    return res.status(200).json({ status: 'New Chat Item', newChatItem, chatItems })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleCreateCopilot)
export default router.handler()




