import OpenAI from 'openai'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

const router = createRouter<NextApiRequest, NextApiResponse>()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

const handleCreateImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { content } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const image = await openai.images.generate({
      model: 'dall-e-3',
      prompt: content,
      size: '1024x1024'
    })
    const url = image.data[0].url

    return res.status(200).json({ status: 'Create Image Success', url })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleCreateImage)
export default router.handler()
