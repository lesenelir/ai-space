import OpenAI, { OpenAIError } from 'openai'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || ''
// })

const handleSurprise = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { language } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  const content = language === 'zh'
    ? '我要你给我随机生成一句话，这句话的用作图像生成的 prompt。你只需要直接生成最后那句话就好了，不要有多余且不相关的回复。'
    : 'Please randomly generate a sentence for me, which will be used as a prompt for creating an image. ' +
      'You only need to directly generate that sentence, without any additional or irrelevant responses.'

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

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content
        }
      ],
      model: "gpt-3.5-turbo",
    })

    const text = completion.choices[0].message.content
    return res.status(200).json({ status: 'Surprise me', text })
  } catch (e) {
    if (e instanceof OpenAIError && e.message.includes('401')) {
      return res.status(401).json({ status: 'Incorrect API key provided', message: e.message })
    }
    return res.status(500).json({ error: e })}
}

router.post(handleSurprise)
export default router.handler()
