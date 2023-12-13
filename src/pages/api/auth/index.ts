import { createRouter } from 'next-connect'
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()
const router = createRouter<NextApiRequest, NextApiResponse>()

const handlerAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    // Check if the current user exists in my database.
    let user = await prisma.user.findUnique({
      where: {
        userId: userId as string,
      }
    })

    // If the current user does not exist in my database, create a new user.
    if (!user) {
      user = await prisma.user.create({
        data: {
          userId: userId as string,
          balance: 0,
        }
      })
    }

    return res.status(200).json({ status: 'User Data', user })
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

router.post(handlerAuth)

export default router.handler()
