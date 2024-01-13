import OpenAI from 'openai'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

// Create an OpenAI API client (that's edge-friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

const handleGeneratorChatTitle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { send_content, item_uuid, model_name } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    // generator chat title
    const completion = await openai.chat.completions.create({
      messages: send_content,
      model: model_name,
    })

    const title = completion.choices[0].message.content

    // Update the item_name of the chatItem identified by item_uuid
    await prisma.chatItem.update({
      where: {
        item_uuid
      },
      data: {
        item_name: title || 'Untitled'
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

    return res.status(200).json({ message: 'Item name updated.', chatItems })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleGeneratorChatTitle)
export default router.handler()
