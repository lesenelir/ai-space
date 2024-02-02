import OpenAI, { OpenAIError } from 'openai'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || ''
// })

const handleCreateImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { content } = req.body

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

    const image = await openai.images.generate({
      model: 'dall-e-3',
      prompt: content,
      size: '1024x1024'
    })
    const url = image.data[0].url

    return res.status(200).json({ status: 'Create Image Success', url })
  } catch (e) {
    if (e instanceof OpenAIError && e.message.includes('401')) {
      return res.status(401).json({ status: 'Incorrect API key provided', message: e.message })
    }
    return res.status(500).json({ error: e })}
}

router.post(handleCreateImage)
export default router.handler()
