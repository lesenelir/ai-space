import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleSaveOpenAIKey = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { openAIKey } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    // search for the user
    const user = await prisma.user.findUnique({
      where: {
        userId: userId as string,
      }
    })

    // search for the model table
    const gptModels = await prisma.model.findMany({
      where: {
        model_name: {
          contains: 'GPT',
        }
      }
    })

    //[
    //   { id: 1, model_name: 'GPT-3.5 Turbo' },
    //   { id: 2, model_name: 'GPT-4 Turbo' }
    // ]

    for (const model of gptModels) {
      await prisma.userAPIKey.upsert({
        where: {
          user_primary_id_model_primary_id: {
            user_primary_id: user!.id,
            model_primary_id: model.id,
          }
        },
        create: {
          user_primary_id: user!.id,
          model_primary_id: model.id,
          api_key: openAIKey,
        },
        update: {
          api_key: openAIKey,
        }
      })
    }

    return res.status(200).json({ status: 'OpenAI API key saved successfully' })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleSaveOpenAIKey)
export default router.handler()
