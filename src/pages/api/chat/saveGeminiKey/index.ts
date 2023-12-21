import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleSaveGeminiKey = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { googleGeminiKey } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userId as string,
      }
    })

    const geminiModels = await prisma.model.findMany({
      where: {
        model_name: {
          contains: 'Gemini',
        }
      }
    })

    // update or create gemini key
    for (const model of geminiModels) {
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
          api_key: googleGeminiKey,
        },
        update: {
          api_key: googleGeminiKey,
        }
      })
    }

    return res.status(200).json({ status: 'GeminiPro API key saved successfully' })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleSaveGeminiKey)
export default router.handler()
