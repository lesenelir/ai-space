import OpenAI, { OpenAIError } from 'openai'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || ''
// })

const handleCreateVoice = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { text, voice, format, model, speed } = req.body

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

    const generateAudio = await openai.audio.speech.create({
      input: text,
      model,
      voice,
      response_format: format,
      speed
    })
    const buffer = Buffer.from(await generateAudio.arrayBuffer())

    return res.status(200).setHeader('Content-Type', 'audio/mpeg').send(buffer)
  } catch (e) {
    if (e instanceof OpenAIError && e.message.includes('401')) {
      return res.status(401).json({ status: 'Incorrect API key provided', message: e.message })
    }
    return res.status(500).json({ status: 'Error' })
  }
}

router.post(handleCreateVoice)
export default router.handler()
