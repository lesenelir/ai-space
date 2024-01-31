import OpenAI from 'openai'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

const router = createRouter<NextApiRequest, NextApiResponse>()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

const handleCreateVoice = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { text, voice, format, model, speed } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const generateAudio = await openai.audio.speech.create({
      input: text,
      model,
      voice,
      response_format: format,
      speed
    })
    const buffer = Buffer.from(await generateAudio.arrayBuffer())

    // return res.status(200).json({ status: 'Create Voice success' })
    return res.status(200).setHeader('Content-Type', 'audio/mpeg').send(buffer)
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleCreateVoice)
export default router.handler()
