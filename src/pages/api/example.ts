import { getAuth } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req)

  console.log(userId)

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // retrieve data from your database

  res.status(200).json({
    name: 'John Doe',
    userId,
  })
}
