import OpenAI, { OpenAIError } from 'openai'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { isNetworkError, timeoutPromise, toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

// Create an OpenAI API client (that's edge-friendly!)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || ''
// })

const handleGenerateChatTitle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { send_content, item_uuid, model_name } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId
      }
    })

    const userOpenAIKey = await prisma.userAPIKey.findFirst({
      where: {
        user_primary_id: user!.id,
        model_primary_id: 1
      }
    })

    const openai = new OpenAI({
      apiKey: userOpenAIKey?.api_key || ''
    })

    // generator chat title
    // const completion = await openai.chat.completions.create({
    //   messages: send_content,
    //   model: model_name,
    // })
    // const title = completion.choices[0].message.content

    const completion = await Promise.race([
      timeoutPromise(15000),
      openai.chat.completions.create({
        messages: send_content,
        model: model_name,
      })
    ]) as OpenAI.Chat.Completions.ChatCompletion | Error

    if (!(completion instanceof Error)) {
      const title = completion.choices[0].message.content

      // Update the item_name of the chatItem identified by item_uuid
      await prisma.chatItem.update({
        where: {item_uuid},
        data: {
          item_name: title?.slice(0, 50) || 'Untitled'
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
    }

  } catch (e) {
    if (e instanceof OpenAIError && e.message.includes('401')) {
      return res.status(401).json({ status: 'Incorrect API key provided', message: e.message })
    } else if ((isNetworkError(e) && e.type === 'system' && e.code === 'ETIMEDOUT') || (e instanceof Error && e.message.includes('Request timed out') )) {
      return res.status(504).json({status: 'Network Timeout', message: 'Connection to OpenAI service timed out. Please try again later.'})
    }
    return res.status(500).json({ status: 'Error' })
  }
}

router.post(handleGenerateChatTitle)
export default router.handler()
