import OpenAI from 'openai'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

const router = createRouter<NextApiRequest, NextApiResponse>()

// Create an OpenAI API client (that's edge-friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

const handleGenerateQuestions = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { send_content, model_name } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    // generate questions
    const completion = await openai.chat.completions.create({
      messages: send_content,
      model: model_name,
    })

    const questions = completion.choices[0].message.content

    return res.status(200).json({ message: 'Item name updated.', questions })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleGenerateQuestions)
export default router.handler()
